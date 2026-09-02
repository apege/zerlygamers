import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch all testimonials
export async function GET(request: NextRequest) {
  try {
    const testimonials = await sql`
      SELECT 
        id,
        user_id,
        name as username,
        message as comment,
        rating,
        image_path,
        status,
        order_code as item_package,
        admin_reply,
        created_at,
        updated_at
      FROM "public"."testimonials"
      ORDER BY created_at DESC;
    `;

    return NextResponse.json(
      { success: true, data: testimonials },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch testimonials' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// POST: Add new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, rating = 5, order_code = '2.200 Robux', status = 'approved' } = body;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'Username and comment are required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const cleanUsername = name.startsWith('@') ? name : `@${name.trim()}`;

    const result = await sql`
      INSERT INTO "public"."testimonials" (
        name,
        message,
        rating,
        order_code,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${cleanUsername},
        ${message},
        ${rating},
        ${order_code},
        ${status},
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
    console.error('Error adding testimonial:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add testimonial' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// PATCH: Update status, admin reply, or message
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, admin_reply, message, rating, order_code } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updated = await sql`
      UPDATE "public"."testimonials"
      SET 
        status = COALESCE(${status || null}, status),
        admin_reply = COALESCE(${admin_reply !== undefined ? JSON.stringify(admin_reply) : null}::jsonb, admin_reply),
        message = COALESCE(${message || null}, message),
        rating = COALESCE(${rating || null}, rating),
        order_code = COALESCE(${order_code || null}, order_code),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updated[0] },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update testimonial' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Delete a testimonial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    await sql`
      DELETE FROM "public"."testimonials"
      WHERE id = ${id};
    `;

    return NextResponse.json(
      { success: true, message: 'Testimonial deleted successfully' },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete testimonial' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
