import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached, invalidateCache, withTimeout } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const edgeCacheHeaders = {
  'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
  'CDN-Cache-Control': 'public, s-maxage=30',
  'Cloudflare-CDN-Cache-Control': 'public, s-maxage=30',
};

const SETTINGS_CACHE_KEY = 'api_store_settings';

// GET: Fetch store settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reqNoCache =
      request.headers.get('cache-control')?.includes('no-cache') ||
      request.headers.get('pragma')?.includes('no-cache');
    const isAdmin = searchParams.get('admin') === 'true' || searchParams.has('t') || reqNoCache;

    if (!isAdmin) {
      const cached = getCached<any>(SETTINGS_CACHE_KEY, 30000);
      if (cached) {
        return NextResponse.json(
          { success: true, data: cached },
          { status: 200, headers: edgeCacheHeaders }
        );
      }
    }

    const { data: settings, error } = await withTimeout(
      supabaseAdmin
        .from('store_settings')
        .select(
          'id, store_name, whatsapp_number, qris_image_path, logo_image_path, banner_image_path, promo_active, promo_tag, promo_badge, promo_title, promo_subtitle, promo_robux_amount, promo_original_label, promo_discount_price, promo_end_date, admin_note'
        )
        .order('id', { ascending: true })
        .limit(1),
      8000
    );

    if (error) throw new Error(error.message);

    if (!settings || settings.length === 0) {
      const defaultSettings = {
        store_name: 'Zerly Gamers',
        whatsapp_number: '6281991541376',
        qris_image_path: '/qris.jpeg',
        logo_image_path: '/logo.png',
        banner_image_path: null,
        promo_active: true,
        promo_tag: 'PROMO SPESIAL BULAN INI',
        promo_badge: 'LIMITED STOCK',
        promo_title: 'ROBUX BULAN INI',
        promo_subtitle: 'Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!',
        promo_robux_amount: 2200,
        promo_original_label: '2.000 Robux',
        promo_discount_price: 45000,
        promo_end_date: '2026-09-30T23:59:59.000Z',
        admin_note: null,
      };

      const { data: initial, error: initErr } = await supabaseAdmin
        .from('store_settings')
        .insert([defaultSettings])
        .select();

      if (initErr) throw new Error(initErr.message);

      const initialItem = initial && initial.length > 0 ? initial[0] : defaultSettings;
      const initialData = { ...initialItem, admin_notes: initialItem?.admin_note ?? null };

      setCached(SETTINGS_CACHE_KEY, initialData);
      return NextResponse.json(
        { success: true, data: initialData },
        { status: 200, headers: isAdmin ? noCacheHeaders : edgeCacheHeaders }
      );
    }

    const currentItem: Record<string, any> = settings[0];
    const settingsData = { ...currentItem, admin_notes: currentItem?.admin_note ?? null };

    setCached(SETTINGS_CACHE_KEY, settingsData);
    return NextResponse.json(
      { success: true, data: settingsData },
      { status: 200, headers: isAdmin ? noCacheHeaders : edgeCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// PATCH: Update store settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      store_name,
      whatsapp_number,
      qris_image_path,
      logo_image_path,
      banner_image_path,
      promo_active,
      promo_tag,
      promo_badge,
      promo_title,
      promo_subtitle,
      promo_robux_amount,
      promo_original_label,
      promo_discount_price,
      promo_end_date,
      admin_note,
      admin_notes,
    } = body;

    // 1. Get existing row id
    const { data: existing } = await withTimeout(
      supabaseAdmin.from('store_settings').select('id').limit(1),
      8000
    );

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (store_name !== undefined) payload.store_name = store_name;

    // Normalize WhatsApp number (0812 / +62812 / 812 -> 62812...)
    if (whatsapp_number !== undefined) {
      let clean = String(whatsapp_number).replace(/[^0-9]/g, '');
      if (clean.startsWith('0')) clean = '62' + clean.slice(1);
      else if (clean.startsWith('8')) clean = '62' + clean;
      payload.whatsapp_number = clean || whatsapp_number;
    }

    if (qris_image_path !== undefined) payload.qris_image_path = qris_image_path;
    if (logo_image_path !== undefined) payload.logo_image_path = logo_image_path;
    if (banner_image_path !== undefined) payload.banner_image_path = banner_image_path;
    if (promo_active !== undefined) payload.promo_active = Boolean(promo_active);
    if (promo_tag !== undefined) payload.promo_tag = promo_tag;
    if (promo_badge !== undefined) payload.promo_badge = promo_badge;
    if (promo_title !== undefined) payload.promo_title = promo_title;
    if (promo_subtitle !== undefined) payload.promo_subtitle = promo_subtitle;
    if (promo_robux_amount !== undefined) payload.promo_robux_amount = Number(promo_robux_amount);
    if (promo_original_label !== undefined) payload.promo_original_label = promo_original_label;
    if (promo_discount_price !== undefined) payload.promo_discount_price = Number(promo_discount_price);
    if (promo_end_date !== undefined) payload.promo_end_date = promo_end_date;
    if (admin_note !== undefined) payload.admin_note = admin_note;
    if (admin_notes !== undefined) payload.admin_note = admin_notes;

    // 2. Upsert
    let rowId: number | null = existing && existing.length > 0 ? existing[0].id : null;

    if (rowId !== null) {
      const { error } = await withTimeout(
        supabaseAdmin.from('store_settings').update(payload).eq('id', rowId),
        10000
      );
      if (error) {
        console.error('Supabase update settings error:', error);
        throw new Error(error.message);
      }
    } else {
      const { data: inserted, error } = await withTimeout(
        supabaseAdmin.from('store_settings').insert([payload]).select('id'),
        10000
      );
      if (error) {
        console.error('Supabase insert settings error:', error);
        throw new Error(error.message);
      }
      rowId = inserted && inserted.length > 0 ? inserted[0].id : null;
    }

    // 3. Always SELECT full row from DB after update to return confirmed data
    const { data: freshRow, error: fetchErr } = await withTimeout(
      supabaseAdmin.from('store_settings').select('*').eq('id', rowId ?? 1).limit(1),
      8000
    );
    if (fetchErr) throw new Error(fetchErr.message);

    const result: Record<string, any> = freshRow && freshRow.length > 0 ? freshRow[0] : { ...payload };
    const updatedData = { ...result, admin_notes: result?.admin_note ?? null };

    invalidateCache(SETTINGS_CACHE_KEY);
    setCached(SETTINGS_CACHE_KEY, updatedData);
    invalidateCache('api_products_list');

    return NextResponse.json(
      { success: true, data: updatedData },
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
