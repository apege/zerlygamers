import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch all real orders
export async function GET(request: NextRequest) {
  try {
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
      roblox_username,
      customer_phone,
      robux,
      price,
      product_id,
      payment_method = 'Website',
      roblox_user_id,
      customer_notes,
    } = body;

    if (!roblox_username || !customer_phone || !robux || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required order fields' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Check blacklist before creating order
    const isBlacklisted = await sql`
      SELECT id FROM "public"."blacklists" 
      WHERE LOWER(roblox_username) = LOWER(${roblox_username.replace('@', '')}) 
         OR phone = ${customer_phone}
      LIMIT 1;
    `;

    if (isBlacklisted.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Akun atau nomor ini terdaftar dalam blacklist toko.' },
        { status: 403, headers: noCacheHeaders }
      );
    }

    // Generate unique order code: #ZLY...
    const orderCode = `#ZLY${Math.floor(10000000 + Math.random() * 90000000)}`;

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
        order_status,
        roblox_user_id,
        customer_notes,
        created_at,
        updated_at
      ) VALUES (
        ${orderCode},
        ${product_id || null},
        ${roblox_username.startsWith('@') ? roblox_username : '@' + roblox_username},
        ${customer_phone},
        ${robux},
        ${price},
        ${payment_method},
        'pending',
        'pending',
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

// PATCH: Update order status, username, or admin notes
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order_status, payment_status, admin_notes, roblox_username, roblox_user_id } = body;

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
