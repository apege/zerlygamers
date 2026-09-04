import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch all blacklists
export async function GET() {
  try {
    const { data: blacklists, error } = await supabaseAdmin
      .from('blacklists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: blacklists || [] },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error fetching blacklists:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blacklists' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// POST: Add new username to blacklist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roblox_username, reason, roblox_user_id, phone } = body;

    if (!roblox_username) {
      return NextResponse.json(
        { success: false, error: 'Username Roblox wajib diisi!' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const cleanUsername = roblox_username.startsWith('@')
      ? roblox_username
      : `@${roblox_username.trim()}`;

    const { data, error } = await supabaseAdmin
      .from('blacklists')
      .upsert(
        {
          roblox_username: cleanUsername,
          reason: reason || 'Indikasi penipuan atau penyalahgunaan',
          roblox_user_id: roblox_user_id || null,
          phone: phone || null,
        },
        { onConflict: 'roblox_username' }
      )
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 201, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error adding blacklist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add blacklist' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Remove username from blacklist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const username = searchParams.get('username');

    if (!id && !username) {
      return NextResponse.json(
        { success: false, error: 'ID or username is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    let query = supabaseAdmin.from('blacklists').delete();
    if (id) {
      query = query.eq('id', id);
    } else if (username) {
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;
      query = query.ilike('roblox_username', cleanUsername);
    }

    const { error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true, message: 'Blacklist removed successfully' },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error('Error removing blacklist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove blacklist' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
