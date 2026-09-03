import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Check retention metrics (Total, Expiring in 7 days, Expired > 90 days)
export async function GET() {
  try {
    // 1. Total proofs count
    const totalProofsResult = await sql`
      SELECT COUNT(*)::int as count 
      FROM "public"."orders" 
      WHERE payment_proof_path IS NOT NULL AND payment_proof_path != '';
    `;

    // 2. Proofs expiring soon (Created between 83 and 90 days ago)
    const expiringSoonResult = await sql`
      SELECT 
        id, 
        order_code, 
        roblox_username, 
        created_at,
        ROUND(EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400)::int as age_days
      FROM "public"."orders"
      WHERE payment_proof_path IS NOT NULL 
        AND payment_proof_path != ''
        AND created_at <= NOW() - INTERVAL '83 days'
        AND created_at > NOW() - INTERVAL '90 days'
      ORDER BY created_at ASC;
    `;

    // 3. Proofs expired (> 90 days ago)
    const expiredResult = await sql`
      SELECT 
        id, 
        order_code, 
        roblox_username, 
        payment_proof_path,
        created_at,
        ROUND(EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400)::int as age_days
      FROM "public"."orders"
      WHERE payment_proof_path IS NOT NULL 
        AND payment_proof_path != ''
        AND created_at <= NOW() - INTERVAL '90 days'
      ORDER BY created_at ASC;
    `;

    // Auto-cleanup if there are any expired files older than 90 days
    let autoCleanedCount = 0;
    if (expiredResult.length > 0) {
      for (const ord of expiredResult) {
        if (ord.payment_proof_path && ord.payment_proof_path.startsWith('/uploads/')) {
          try {
            const filePath = path.join(process.cwd(), 'public', ord.payment_proof_path.slice(1));
            await fs.unlink(filePath).catch(() => {});
          } catch {}
        }
      }

      await sql`
        UPDATE "public"."orders"
        SET payment_proof_path = NULL, updated_at = NOW()
        WHERE id = ANY(${expiredResult.map((o) => o.id)});
      `;
      autoCleanedCount = expiredResult.length;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          retention_policy_days: 90,
          warning_threshold_days: 7, // starts at day 83
          total_proofs_stored: totalProofsResult[0]?.count || 0,
          expiring_soon_count: expiringSoonResult.length,
          expiring_orders: expiringSoonResult,
          cleaned_expired_count: autoCleanedCount,
        },
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error in retention cleanup check:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check retention' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// POST: Manual trigger cleanup routine
export async function POST(request: NextRequest) {
  try {
    const expiredOrders = await sql`
      SELECT id, order_code, payment_proof_path 
      FROM "public"."orders"
      WHERE payment_proof_path IS NOT NULL 
        AND payment_proof_path != ''
        AND created_at <= NOW() - INTERVAL '90 days';
    `;

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
      await sql`
        UPDATE "public"."orders"
        SET payment_proof_path = NULL, updated_at = NOW()
        WHERE id = ANY(${expiredOrders.map((o) => o.id)});
      `;
    }

    return NextResponse.json(
      { success: true, message: `Berhasil membersihkan ${cleaned} bukti transfer kedaluwarsa (> 90 hari).`, cleaned_count: cleaned },
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
