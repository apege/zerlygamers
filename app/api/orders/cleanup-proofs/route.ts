import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached, withTimeout, getLastKnownData } from '@/lib/serverCache';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const CLEANUP_CACHE_KEY = 'api_retention_metrics';

const fallbackMetrics = {
  retention_policy_days: 90,
  warning_threshold_days: 7,
  total_proofs_stored: 0,
  expiring_soon_count: 0,
  expiring_orders: [],
  cleaned_expired_count: 0,
};

// GET: Check retention metrics (Total, Expiring in 7 days, Expired > 90 days)
export async function GET() {
  try {
    const cached = getCached<any>(CLEANUP_CACHE_KEY, 60000);
    if (cached) {
      return NextResponse.json(
        { success: true, data: cached },
        { status: 200, headers: noCacheHeaders }
      );
    }

    const { data: ordersWithProof, error } = await withTimeout<{ data: any[] | null; error: any }>(
      supabaseAdmin
        .from('orders')
        .select('id, order_code, roblox_username, created_at')
        .not('payment_proof_path', 'is', null)
        .neq('payment_proof_path', '')
        .limit(200),
      5000
    );

    if (error) throw new Error(error.message);

    const now = Date.now();
    const dayMs = 86400000;

    const allProofs = ordersWithProof || [];
    const total_proofs_stored = allProofs.length;

    const expiring_orders: any[] = [];
    const expiredOrders: any[] = [];

    allProofs.forEach((ord: any) => {
      const createdMs = new Date(ord.created_at).getTime();
      const ageDays = Math.floor((now - createdMs) / dayMs);

      if (ageDays >= 90) {
        expiredOrders.push({ ...ord, age_days: ageDays });
      } else if (ageDays >= 83 && ageDays < 90) {
        expiring_orders.push({ ...ord, age_days: ageDays });
      }
    });

    const resultData = {
      retention_policy_days: 90,
      warning_threshold_days: 7, // starts at day 83
      total_proofs_stored,
      expiring_soon_count: expiring_orders.length,
      expiring_orders,
      cleaned_expired_count: 0,
    };

    setCached(CLEANUP_CACHE_KEY, resultData);

    return NextResponse.json(
      { success: true, data: resultData },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error in retention cleanup check:', error);
    const lastData = getLastKnownData<any>(CLEANUP_CACHE_KEY) || fallbackMetrics;
    return NextResponse.json(
      { success: true, data: lastData },
      { status: 200, headers: noCacheHeaders }
    );
  }
}

// POST: Manual trigger cleanup routine
export async function POST(request: NextRequest) {
  try {
    const { data: allProofs, error } = await supabaseAdmin
      .from('orders')
      .select('id, order_code, payment_proof_path, created_at')
      .not('payment_proof_path', 'is', null)
      .neq('payment_proof_path', '');

    if (error) throw new Error(error.message);

    const now = Date.now();
    const ninetyDaysMs = 90 * 86400000;
    const expiredOrders = (allProofs || []).filter(
      (o) => now - new Date(o.created_at).getTime() >= ninetyDaysMs
    );

    let cleaned = 0;
    for (const ord of expiredOrders) {
      if (ord.payment_proof_path && ord.payment_proof_path.startsWith('/uploads/')) {
        try {
          const filePath = path.join(process.cwd(), 'public', ord.payment_proof_path.slice(1));
          await fs.unlink(filePath).catch(() => {});
        } catch {}
      }
      cleaned++;
    }

    if (expiredOrders.length > 0) {
      const expiredIds = expiredOrders.map((o) => o.id);
      await supabaseAdmin
        .from('orders')
        .update({ payment_proof_path: null, updated_at: new Date().toISOString() })
        .in('id', expiredIds);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Berhasil membersihkan ${cleaned} bukti transfer kedaluwarsa (> 90 hari).`,
        cleaned_count: cleaned,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Manual cleanup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menjalankan pembersihan' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
