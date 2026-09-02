import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch all products with dynamic badges (POPULER, PROMO, SULTAN)
export async function GET(request: NextRequest) {
  try {
    // 1. Fetch products
    const products = await sql`
      SELECT 
        id,
        name,
        robux,
        price,
        is_active,
        image_path,
        created_at,
        updated_at
      FROM "public"."products"
      ORDER BY robux ASC;
    `;

    // 2. Fetch promo settings
    const settings = await sql`
      SELECT promo_active, promo_robux_amount 
      FROM "public"."store_settings" 
      ORDER BY id ASC 
      LIMIT 1;
    `;
    const promoActive = settings.length > 0 ? settings[0].promo_active : false;
    const promoRobuxAmount = settings.length > 0 ? Number(settings[0].promo_robux_amount) : 2200;

    // 3. Fetch most popular package from orders
    const popularStats = await sql`
      SELECT robux, COUNT(id)::int as total_orders
      FROM "public"."orders"
      GROUP BY robux
      ORDER BY total_orders DESC
      LIMIT 1;
    `;
    const mostPopularRobux = popularStats.length > 0 ? Number(popularStats[0].robux) : null;
    const mostPopularCount = popularStats.length > 0 ? Number(popularStats[0].total_orders) : 0;

    // 4. Attach computed badge
    const productsWithBadges = products.map((p: any) => {
      let badge: 'POPULER' | 'PROMO' | 'SULTAN' | null = null;

      if (p.robux >= 10000) {
        badge = 'SULTAN';
      } else if (promoActive && p.robux === promoRobuxAmount) {
        badge = 'PROMO';
      } else if (mostPopularRobux && p.robux === mostPopularRobux && mostPopularCount > 0) {
        badge = 'POPULER';
      }

      return {
        ...p,
        badge,
      };
    });

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
    const { name, robux, price, is_active = true } = body;

    if (!robux || !price) {
      return NextResponse.json(
        { success: false, error: 'Nominal Robux dan Harga wajib diisi!' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const productName = name || `${Number(robux).toLocaleString('id-ID')} Robux`;

    const result = await sql`
      INSERT INTO "public"."products" (
        name,
        robux,
        price,
        is_active,
        created_at,
        updated_at
      ) VALUES (
        ${productName},
        ${robux},
        ${price},
        ${is_active},
        NOW(),
        NOW()
      )
      RETURNING *;
    `;

    return NextResponse.json(
      { success: true, data: result[0] },
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
    const { id, name, robux, price, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updated = await sql`
      UPDATE "public"."products"
      SET 
        name = COALESCE(${name || null}, name),
        robux = COALESCE(${robux || null}, robux),
        price = COALESCE(${price || null}, price),
        is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updated[0] },
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

    await sql`
      DELETE FROM "public"."products"
      WHERE id = ${id};
    `;

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
