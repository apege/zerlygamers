import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCached, setCached, invalidateCache } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const PRODUCTS_CACHE_KEY = 'api_products_list';

// GET: Fetch all products with dynamic badges (POPULER, PROMO, SULTAN)
export async function GET() {
  try {
    // Check in-memory cache first (instant response)
    const cached = getCached<any[]>(PRODUCTS_CACHE_KEY);
    if (cached) {
      return NextResponse.json(
        { success: true, data: cached },
        { status: 200, headers: noCacheHeaders }
      );
    }

    // 1. Fetch products
    const { data: products, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('robux', { ascending: true });

    if (prodErr) {
      throw new Error(prodErr.message);
    }

    // 2. Fetch promo settings
    const { data: settings } = await supabaseAdmin
      .from('store_settings')
      .select('promo_active, promo_robux_amount')
      .limit(1);

    const promoActive = settings && settings.length > 0 ? settings[0].promo_active : false;
    const promoRobuxAmount = settings && settings.length > 0 ? Number(settings[0].promo_robux_amount) : 2200;

    // 3. Attach computed badge
    const productsWithBadges = (products || []).map((p: any) => {
      let badge: 'POPULER' | 'PROMO' | 'SULTAN' | null = null;

      if (p.robux >= 10000) {
        badge = 'SULTAN';
      } else if (promoActive && p.robux === promoRobuxAmount) {
        badge = 'PROMO';
      } else if (p.robux === 240) {
        badge = 'POPULER';
      }

      return {
        ...p,
        badge,
      };
    });

    setCached(PRODUCTS_CACHE_KEY, productsWithBadges);

    return NextResponse.json(
      { success: true, data: productsWithBadges },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// POST: Add new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, robux, price, is_active = true, image_path = null } = body;

    if (!robux || !price) {
      return NextResponse.json(
        { success: false, error: 'Nominal Robux dan Harga wajib diisi!' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const productName = name || `${Number(robux).toLocaleString('id-ID')} Robux`;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name: productName,
          robux: Number(robux),
          price: Number(price),
          is_active: Boolean(is_active),
          image_path,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    invalidateCache(PRODUCTS_CACHE_KEY);

    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 201, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add product' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// PATCH: Edit product or toggle active status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, robux, price, is_active, image_path } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (name !== undefined) updateData.name = name;
    if (robux !== undefined) updateData.robux = Number(robux);
    if (price !== undefined) updateData.price = Number(price);
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);
    if (image_path !== undefined) updateData.image_path = image_path;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    invalidateCache(PRODUCTS_CACHE_KEY);

    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', Number(id));

    if (error) {
      throw new Error(error.message);
    }

    invalidateCache(PRODUCTS_CACHE_KEY);

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
