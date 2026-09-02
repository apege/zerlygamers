import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch store settings
export async function GET(request: NextRequest) {
  try {
    const settings = await sql`
      SELECT * FROM "public"."store_settings" 
      ORDER BY id ASC 
      LIMIT 1;
    `;

    if (settings.length === 0) {
      // Create initial settings if not present
      const initial = await sql`
        INSERT INTO "public"."store_settings" (
          store_name,
          whatsapp_number,
          qris_image_path,
          logo_image_path,
          promo_active,
          promo_tag,
          promo_badge,
          promo_title,
          promo_subtitle,
          promo_robux_amount,
          promo_original_label,
          promo_discount_price,
          promo_end_date,
          updated_at
        ) VALUES (
          'Zerly Gamers',
          '6285624595886',
          '/qris.jpeg',
          '/logo.png',
          true,
          'PROMO SPESIAL BULAN INI',
          'LIMITED STOCK',
          'ROBUX BULAN INI',
          'Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!',
          2200,
          '2.200 Robux',
          45000,
          '2026-10-01 06:59:00+07',
          NOW()
        ) RETURNING *;
      `;
      return NextResponse.json(
        { success: true, data: initial[0] },
        { status: 200, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: settings[0] },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// PATCH / POST: Update store settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      store_name,
      whatsapp_number,
      qris_image_path,
      logo_image_path,
      promo_active,
      promo_tag,
      promo_badge,
      promo_title,
      promo_subtitle,
      promo_robux_amount,
      promo_original_label,
      promo_discount_price,
      promo_end_date,
      admin_notes,
    } = body;

    const existing = await sql`SELECT id FROM "public"."store_settings" LIMIT 1;`;

    let updated;
    if (existing.length > 0) {
      updated = await sql`
        UPDATE "public"."store_settings"
        SET 
          store_name = COALESCE(${store_name || null}, store_name),
          whatsapp_number = COALESCE(${whatsapp_number || null}, whatsapp_number),
          qris_image_path = COALESCE(${qris_image_path || null}, qris_image_path),
          logo_image_path = COALESCE(${logo_image_path || null}, logo_image_path),
          promo_active = COALESCE(${promo_active !== undefined ? promo_active : null}, promo_active),
          promo_tag = COALESCE(${promo_tag || null}, promo_tag),
          promo_badge = COALESCE(${promo_badge || null}, promo_badge),
          promo_title = COALESCE(${promo_title || null}, promo_title),
          promo_subtitle = COALESCE(${promo_subtitle || null}, promo_subtitle),
          promo_robux_amount = COALESCE(${promo_robux_amount || null}, promo_robux_amount),
          promo_original_label = COALESCE(${promo_original_label || null}, promo_original_label),
          promo_discount_price = COALESCE(${promo_discount_price || null}, promo_discount_price),
          promo_end_date = COALESCE(${promo_end_date || null}, promo_end_date),
          admin_notes = COALESCE(${admin_notes !== undefined ? admin_notes : null}, admin_notes),
          updated_at = NOW()
        WHERE id = ${existing[0].id}
        RETURNING *;
      `;
    } else {
      updated = await sql`
        INSERT INTO "public"."store_settings" (
          store_name,
          whatsapp_number,
          qris_image_path,
          logo_image_path,
          promo_active,
          promo_robux_amount,
          promo_discount_price,
          updated_at
        ) VALUES (
          ${store_name || 'Zerly Gamers'},
          ${whatsapp_number || '6285624595886'},
          ${qris_image_path || '/qris.jpeg'},
          ${logo_image_path || '/logo.png'},
          ${promo_active !== undefined ? promo_active : true},
          ${promo_robux_amount || 2200},
          ${promo_discount_price || 45000},
          NOW()
        ) RETURNING *;
      `;
    }

    return NextResponse.json(
      { success: true, data: updated[0] },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update settings' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
