import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const CUSTOMERS_CACHE_KEY = 'api_customers_list';

// GET: Aggregated customers from orders and blacklists
export async function GET() {
  try {
    const cached = getCached<any[]>(CUSTOMERS_CACHE_KEY, 15000);
    if (cached) {
      return NextResponse.json(
        { success: true, data: cached },
        { status: 200, headers: noCacheHeaders }
      );
    }

    const [{ data: orders }, { data: blacklists }] = await Promise.all([
      supabaseAdmin.from('orders').select('roblox_username, roblox_user_id, customer_phone, price'),
      supabaseAdmin.from('blacklists').select('roblox_username, roblox_user_id, phone, reason'),
    ]);

    const blacklistMap = new Map<string, any>();
    (blacklists || []).forEach((b) => {
      blacklistMap.set(b.roblox_username.toLowerCase().replace('@', ''), b);
    });

    const customerMap = new Map<string, any>();

    (orders || []).forEach((ord) => {
      const cleanUser = (ord.roblox_username || '').replace('@', '').trim();
      if (!cleanUser) return;
      const key = cleanUser.toLowerCase();

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          username: `@${cleanUser}`,
          roblox_user_id: ord.roblox_user_id || null,
          whatsapp_number: ord.customer_phone || '-',
          total_orders: 0,
          total_spent_raw: 0,
          status: blacklistMap.has(key) ? 'blacklist' : 'aktif',
          blacklist_reason: blacklistMap.get(key)?.reason || null,
        });
      }

      const item = customerMap.get(key);
      item.total_orders += 1;
      item.total_spent_raw += Number(ord.price || 0);
      if (ord.roblox_user_id && !item.roblox_user_id) item.roblox_user_id = ord.roblox_user_id;
      if (ord.customer_phone && ord.customer_phone !== 'WhatsApp Direct') item.whatsapp_number = ord.customer_phone;
    });

    // Also include blacklisted users who haven't ordered
    (blacklists || []).forEach((b) => {
      const cleanUser = b.roblox_username.replace('@', '').trim();
      const key = cleanUser.toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          username: `@${cleanUser}`,
          roblox_user_id: b.roblox_user_id || null,
          whatsapp_number: b.phone || '-',
          total_orders: 0,
          total_spent_raw: 0,
          status: 'blacklist',
          blacklist_reason: b.reason,
        });
      }
    });

    const customerList = Array.from(customerMap.values()).sort(
      (a, b) => b.total_spent_raw - a.total_spent_raw
    );

    setCached(CUSTOMERS_CACHE_KEY, customerList);

    return NextResponse.json(
      { success: true, data: customerList },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customers' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
