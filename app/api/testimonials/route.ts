import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

const edgeCacheHeaders = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

// GET: Fetch all testimonials or check token existence
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (token) {
      const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');
      const { data: existing, error } = await supabaseAdmin
        .from('testimonials')
        .select('*')
        .ilike('order_code', `%${cleanToken}%`)
        .limit(1);

      if (error) throw new Error(error.message);

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { success: true, has_reviewed: true, data: existing[0] },
          { status: 200, headers: noCacheHeaders }
        );
      } else {
        return NextResponse.json(
          { success: true, has_reviewed: false },
          { status: 200, headers: noCacheHeaders }
        );
      }
    }

    const { data: testimonials, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: testimonials || [] },
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

// POST: Add new testimonial (1 review per token)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, rating = 5, order_code = '2.200 Robux', token, status = 'approved' } = body;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'Username and comment are required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const cleanUsername = name.startsWith('@') ? name : `@${name.trim()}`;
    const tokenToCheck = token ? token.replace(/[^a-zA-Z0-9]/g, '') : '';

    // Check duplicate review by token if provided
    if (tokenToCheck) {
      const { data: existing } = await supabaseAdmin
        .from('testimonials')
        .select('id')
        .ilike('order_code', `%${tokenToCheck}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Kamu sudah pernah memberikan ulasan untuk pesanan ini! Setiap pesanan hanya dapat diulas 1 kali.',
          },
          { status: 409, headers: noCacheHeaders }
        );
      }
    }

    const savedOrderCode = tokenToCheck ? `${order_code} • #${tokenToCheck}` : order_code;

    const { data: result, error } = await supabaseAdmin
      .from('testimonials')
      .insert([
        {
          name: cleanUsername,
          message,
          rating: Number(rating),
          order_code: savedOrderCode,
          status,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

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

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (admin_reply !== undefined) updateData.admin_reply = admin_reply;
    if (message !== undefined) updateData.message = message;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (order_code !== undefined) updateData.order_code = order_code;

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: data[0] },
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

    const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', Number(id));

    if (error) throw new Error(error.message);

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
