import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Real financial metrics and payment mutations from orders table
export async function GET(request: NextRequest) {
  try {
    // 1. Fetch all paid/completed orders as mutations
    const mutations = await sql`
      SELECT 
        o.id,
        o.order_code,
        o.roblox_username,
        o.payment_method,
        o.price,
        o.robux,
        o.payment_status,
        o.order_status,
        o.created_at,
        CASE 
          WHEN LOWER(o.payment_method) LIKE '%whatsapp%' OR LOWER(o.payment_method) LIKE '%wa%' THEN 'WHATSAPP'
          ELSE 'WEBSITE'
        END as channel
      FROM "public"."orders" o
      WHERE o.payment_status = 'paid' OR o.order_status = 'completed'
      ORDER BY o.created_at DESC;
    `;

    // 2. Compute aggregate metrics
    const stats = await sql`
      SELECT 
        COALESCE(COUNT(id), 0)::int as total_transactions,
        COALESCE(SUM(price), 0)::bigint as total_revenue,
        COALESCE(SUM(robux), 0)::bigint as total_robux_sold,
        COALESCE(AVG(price), 0)::bigint as aov,
        COALESCE(SUM(CASE WHEN LOWER(payment_method) NOT LIKE '%whatsapp%' AND LOWER(payment_method) NOT LIKE '%wa%' THEN price ELSE 0 END), 0)::bigint as website_revenue,
        COALESCE(COUNT(CASE WHEN LOWER(payment_method) NOT LIKE '%whatsapp%' AND LOWER(payment_method) NOT LIKE '%wa%' THEN id ELSE NULL END), 0)::int as website_count,
        COALESCE(SUM(CASE WHEN LOWER(payment_method) LIKE '%whatsapp%' OR LOWER(payment_method) LIKE '%wa%' THEN price ELSE 0 END), 0)::bigint as whatsapp_revenue,
        COALESCE(COUNT(CASE WHEN LOWER(payment_method) LIKE '%whatsapp%' OR LOWER(payment_method) LIKE '%wa%' THEN id ELSE NULL END), 0)::int as whatsapp_count
      FROM "public"."orders"
      WHERE payment_status = 'paid' OR order_status = 'completed';
    `;

    const summary = stats[0] || {
      total_transactions: 0,
      total_revenue: 0,
      total_robux_sold: 0,
      aov: 0,
      website_revenue: 0,
      website_count: 0,
      whatsapp_revenue: 0,
      whatsapp_count: 0,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          mutations,
          summary,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payments' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
