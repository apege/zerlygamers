import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Aggregated customers from orders and blacklists
export async function GET(request: NextRequest) {
  try {
    const customers = await sql`
      WITH order_stats AS (
        SELECT 
          roblox_username,
          MAX(roblox_user_id) as roblox_user_id,
          MAX(customer_phone) as customer_phone,
          COUNT(id)::int as total_orders,
          SUM(price)::bigint as total_spent_raw
        FROM "public"."orders"
        GROUP BY roblox_username
      )
      SELECT 
        COALESCE(os.roblox_username, b.roblox_username) as username,
        COALESCE(os.roblox_user_id, b.roblox_user_id) as roblox_user_id,
        COALESCE(os.customer_phone, b.phone) as whatsapp_number,
        COALESCE(os.total_orders, 0) as total_orders,
        COALESCE(os.total_spent_raw, 0) as total_spent_raw,
        CASE WHEN b.id IS NOT NULL THEN 'blacklist' ELSE 'aktif' END as status,
        b.reason as blacklist_reason
      FROM order_stats os
      FULL OUTER JOIN "public"."blacklists" b 
        ON LOWER(os.roblox_username) = LOWER(b.roblox_username)
      ORDER BY total_spent_raw DESC;
    `;

    return NextResponse.json(
      { success: true, data: customers },
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
