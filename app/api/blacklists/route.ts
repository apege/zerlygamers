import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Fetch all blacklists
export async function GET(request: NextRequest) {
  try {
    const blacklists = await sql`
      SELECT 
        id,
        roblox_username,
        reason,
        created_at,
        roblox_user_id,
        phone
      FROM "public"."blacklists"
      ORDER BY created_at DESC;
    `;

    return NextResponse.json(
      { success: true, data: blacklists },
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

    const result = await sql`
      INSERT INTO "public"."blacklists" (
        roblox_username,
        reason,
        roblox_user_id,
        phone,
        created_at
      ) VALUES (
        ${cleanUsername},
        ${reason || 'Indikasi penipuan atau penyalahgunaan'},
        ${roblox_user_id || null},
        ${phone || null},
        NOW()
      )
      ON CONFLICT (roblox_username) DO UPDATE
      SET 
        reason = EXCLUDED.reason,
        phone = COALESCE(EXCLUDED.phone, blacklists.phone),
        roblox_user_id = COALESCE(EXCLUDED.roblox_user_id, blacklists.roblox_user_id)
      RETURNING *;
    `;

    return NextResponse.json(
      { success: true, data: result[0] },
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

    if (id) {
      await sql`DELETE FROM "public"."blacklists" WHERE id = ${id};`;
    } else if (username) {
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;
      await sql`DELETE FROM "public"."blacklists" WHERE LOWER(roblox_username) = LOWER(${cleanUsername});`;
    }

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
