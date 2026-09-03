import crypto from 'crypto';

const ADMIN_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'zerlygamers_super_secret_admin_session_key_2026';

export const ADMIN_COOKIE_NAME = 'zerly_admin_session';

export interface AdminSessionPayload {
  username: string;
  role: string;
  exp: number; // Unix timestamp in seconds
}

/**
 * Creates an HMAC SHA-256 signed session token
 */
export function createSessionToken(username: string, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const payload: AdminSessionPayload = {
    username,
    role: 'admin',
    exp,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes the HMAC SHA-256 session token
 */
export function verifySessionToken(token: string | undefined | null): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload: AdminSessionPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates admin credentials against environment variables
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  const envUser = (process.env.ADMIN_USERNAME || 'admin_zerlygamers').trim();
  const envPass = (process.env.ADMIN_PASSWORD || '@ZerlyGamers2026').trim();

  return (
    username.trim().toLowerCase() === envUser.toLowerCase() &&
    password.trim() === envPass
  );
}
