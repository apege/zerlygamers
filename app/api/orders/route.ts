import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch all real orders or single order by token/code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || searchParams.get('code');

    if (token) {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');
      const order = await sql`
        SELECT 
          o.id,
          o.order_code,
          o.product_id,
          o.user_id,
          o.roblox_username,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          o.payment_proof_path,
          o.order_status,
          o.created_at,
          o.updated_at,
          o.roblox_user_id,
          o.customer_notes,
          o.admin_notes,
          o.expires_at
        FROM "public"."orders" o
        WHERE o.order_code ILIKE ${`%${cleanToken}%`}
        LIMIT 1;
      `;

      if (order.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404, headers: noCacheHeaders }
        );
      }

      return NextResponse.json(
        { success: true, data: order[0] },
        { status: 200, headers: noCacheHeaders }
      );
    }

    const orders = await sql`
      SELECT 
        o.id,
        o.order_code,
        o.product_id,
        o.user_id,
        o.roblox_username,
        o.customer_phone,
        o.robux,
        o.price,
        o.payment_method,
        o.payment_status,
        o.payment_proof_path,
        o.order_status,
        o.created_at,
        o.updated_at,
        o.roblox_user_id,
        o.customer_notes,
        o.admin_notes,
        o.expires_at
      FROM "public"."orders" o
      ORDER BY o.created_at DESC;
    `;

    return NextResponse.json(
      { success: true, data: orders },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// POST: Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_code,
      roblox_username,
      customer_phone = 'WhatsApp Direct',
      robux,
      price,
      product_id,
      payment_method = 'Website',
      payment_status,
      order_status = 'masuk',
      roblox_user_id,
      customer_notes,
      payment_proof_path,
    } = body;

    if (!roblox_username || !robux || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required order fields (roblox_username, robux, price)' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const cleanUsername = roblox_username.startsWith('@') ? roblox_username : `@${roblox_username.trim()}`;
    const cleanPhone = (customer_phone && customer_phone.trim()) ? customer_phone.trim() : 'WhatsApp Direct';

    // Check blacklist before creating order
    if (cleanPhone !== 'WhatsApp Direct') {
      const isBlacklisted = await sql`
        SELECT id FROM "public"."blacklists" 
        WHERE LOWER(roblox_username) = LOWER(${cleanUsername.replace('@', '')}) 
           OR phone = ${cleanPhone}
        LIMIT 1;
      `;

      if (isBlacklisted.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Akun atau nomor ini terdaftar dalam blacklist toko.' },
          { status: 403, headers: noCacheHeaders }
        );
      }
    }

    // Use passed order_code or generate unique order code: #ZLY...
    const finalOrderCode = order_code
      ? (order_code.startsWith('#') ? order_code : `#${order_code}`)
      : `#ZLY${Math.floor(10000000 + Math.random() * 90000000)}`;

    const isWhatsApp = payment_method.toLowerCase().includes('whatsapp') || payment_method.toLowerCase().includes('wa');
    const finalPaymentStatus = payment_status || (isWhatsApp ? 'pending' : 'paid');

    // Normalize order_status to match PostgreSQL check constraint ('pending' | 'processing' | 'completed' | 'cancelled')
    let dbOrderStatus = 'pending';
    if (order_status === 'diproses' || order_status === 'proses' || order_status === 'processing') {
      dbOrderStatus = 'processing';
    } else if (order_status === 'selesai' || order_status === 'completed' || order_status === 'sukses') {
      dbOrderStatus = 'completed';
    } else if (order_status === 'dibatalkan' || order_status === 'batal' || order_status === 'cancelled') {
      dbOrderStatus = 'cancelled';
    } else {
      dbOrderStatus = 'pending';
    }

    const result = await sql`
      INSERT INTO "public"."orders" (
        order_code,
        product_id,
        roblox_username,
        customer_phone,
        robux,
        price,
        payment_method,
        payment_status,
        payment_proof_path,
        order_status,
        roblox_user_id,
        customer_notes,
        created_at,
        updated_at
      ) VALUES (
        ${finalOrderCode},
        ${product_id || null},
        ${cleanUsername},
        ${cleanPhone},
        ${robux},
        ${price},
        ${payment_method},
        ${finalPaymentStatus},
        ${payment_proof_path || null},
        ${dbOrderStatus},
        ${roblox_user_id || null},
        ${customer_notes || null},
        NOW(),
        NOW()
      )
      RETURNING *;
    `;

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// PATCH: Update order status, username, payment proof, or admin notes
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order_status, payment_status, admin_notes, roblox_username, roblox_user_id, payment_proof_path } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing order ID' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updated = await sql`
      UPDATE "public"."orders"
      SET 
        order_status = COALESCE(${order_status || null}, order_status),
        payment_status = COALESCE(${payment_status || null}, payment_status),
        admin_notes = COALESCE(${admin_notes !== undefined ? admin_notes : null}, admin_notes),
        roblox_username = COALESCE(${roblox_username || null}, roblox_username),
        roblox_user_id = COALESCE(${roblox_user_id || null}, roblox_user_id),
        payment_proof_path = COALESCE(${payment_proof_path || null}, payment_proof_path),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updated[0] },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Delete an order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    await sql`
      DELETE FROM "public"."orders"
      WHERE id = ${id};
    `;

    return NextResponse.json(
      { success: true, message: 'Order deleted successfully' },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete order' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
