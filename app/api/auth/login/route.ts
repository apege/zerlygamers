import { NextRequest, NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createSessionToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, rememberMe } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan password wajib diisi!' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Username atau password admin salah!' },
        { status: 401 }
      );
    }

    const days = rememberMe ? 30 : 7;
    const token = createSessionToken(username, days);
    const maxAge = days * 24 * 60 * 60;

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login admin berhasil!',
        user: {
          username: username.trim(),
          role: 'admin',
        },
      },
      { status: 200 }
    );

    // Set HTTP-Only Secure Cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
