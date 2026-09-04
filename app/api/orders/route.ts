import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached, invalidateCache } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const ORDERS_CACHE_KEY = 'api_orders_list';
const CUSTOMERS_CACHE_KEY = 'api_customers_list';

// GET: Fetch all real orders or single order by token/code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || searchParams.get('code');

    if (token) {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .ilike('order_code', `%${cleanToken}%`)
        .limit(1);

      if (error) throw new Error(error.message);

      if (!order || order.length === 0) {
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

    const cached = getCached<any[]>(ORDERS_CACHE_KEY, 10000);
    if (cached) {
      return NextResponse.json(
        { success: true, data: cached },
        { status: 200, headers: noCacheHeaders }
      );
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    setCached(ORDERS_CACHE_KEY, orders || []);

    return NextResponse.json(
      { success: true, data: orders || [] },
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
      order_status = 'pending',
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
      const rawUser = cleanUsername.replace('@', '');
      const { data: blacklist } = await supabaseAdmin
        .from('blacklists')
        .select('id')
        .or(`roblox_username.ilike.${rawUser},phone.eq.${cleanPhone}`)
        .limit(1);

      if (blacklist && blacklist.length > 0) {
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

    // Normalize order_status to match check constraint ('pending' | 'processing' | 'completed' | 'cancelled')
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

    const newOrderData = {
      order_code: finalOrderCode,
      product_id: product_id ? Number(product_id) : null,
      roblox_username: cleanUsername,
      customer_phone: cleanPhone,
      robux: Number(robux),
      price: Number(price),
      payment_method,
      payment_status: finalPaymentStatus,
      payment_proof_path: payment_proof_path || null,
      order_status: dbOrderStatus,
      roblox_user_id: roblox_user_id || null,
      customer_notes: customer_notes || null,
    };

    const { data: result, error } = await supabaseAdmin
      .from('orders')
      .insert([newOrderData])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    invalidateCache(ORDERS_CACHE_KEY);
    invalidateCache(CUSTOMERS_CACHE_KEY);

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

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (order_status !== undefined) {
      let dbStatus = order_status;
      if (order_status === 'diproses' || order_status === 'proses') dbStatus = 'processing';
      else if (order_status === 'selesai') dbStatus = 'completed';
      else if (order_status === 'dibatalkan' || order_status === 'batal') dbStatus = 'cancelled';
      else if (order_status === 'masuk') dbStatus = 'pending';
      updateData.order_status = dbStatus;
    }

    if (payment_status !== undefined) updateData.payment_status = payment_status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (roblox_username !== undefined) updateData.roblox_username = roblox_username;
    if (roblox_user_id !== undefined) updateData.roblox_user_id = roblox_user_id;
    if (payment_proof_path !== undefined) updateData.payment_proof_path = payment_proof_path;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    invalidateCache(ORDERS_CACHE_KEY);
    invalidateCache(CUSTOMERS_CACHE_KEY);

    return NextResponse.json(
      { success: true, data: data[0] },
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

    const { error } = await supabaseAdmin.from('orders').delete().eq('id', Number(id));

    if (error) throw new Error(error.message);

    invalidateCache(ORDERS_CACHE_KEY);
    invalidateCache(CUSTOMERS_CACHE_KEY);

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
