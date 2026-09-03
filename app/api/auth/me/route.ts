import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          username: session.username,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
