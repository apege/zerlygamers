import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Real financial metrics and payment mutations from orders table
export async function GET() {
  try {
    const { data: allOrders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .or('payment_status.eq.paid,order_status.eq.completed')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const paidOrders = allOrders || [];

    const mutations = paidOrders.map((o) => {
      const isWa =
        (o.payment_method || '').toLowerCase().includes('whatsapp') ||
        (o.payment_method || '').toLowerCase().includes('wa');
      return {
        id: o.id,
        order_code: o.order_code,
        roblox_username: o.roblox_username,
        payment_method: o.payment_method,
        price: o.price,
        robux: o.robux,
        payment_status: o.payment_status,
        order_status: o.order_status,
        created_at: o.created_at,
        channel: isWa ? 'WHATSAPP' : 'WEBSITE',
      };
    });

    let total_revenue = 0;
    let total_robux_sold = 0;
    let website_revenue = 0;
    let website_count = 0;
    let whatsapp_revenue = 0;
    let whatsapp_count = 0;

    paidOrders.forEach((o) => {
      const p = Number(o.price || 0);
      const r = Number(o.robux || 0);
      const isWa =
        (o.payment_method || '').toLowerCase().includes('whatsapp') ||
        (o.payment_method || '').toLowerCase().includes('wa');

      total_revenue += p;
      total_robux_sold += r;

      if (isWa) {
        whatsapp_revenue += p;
        whatsapp_count += 1;
      } else {
        website_revenue += p;
        website_count += 1;
      }
    });

    const total_transactions = paidOrders.length;
    const aov = total_transactions > 0 ? Math.round(total_revenue / total_transactions) : 0;

    const summary = {
      total_transactions,
      total_revenue,
      total_robux_sold,
      aov,
      website_revenue,
      website_count,
      whatsapp_revenue,
      whatsapp_count,
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
