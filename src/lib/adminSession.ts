import { NextRequest, NextResponse } from 'next/server';

export const adminSessionCookieName = 'xgrid_admin_session';

const sessionTtlMs = 1000 * 60 * 60 * 12;

type AdminSessionPayload = {
  exp: number;
};

export async function createAdminSessionCookie() {
  const expiresAt = Date.now() + sessionTtlMs;
  const payload = encodeBase64Url(JSON.stringify({ exp: expiresAt } satisfies AdminSessionPayload));
  const signature = await signValue(payload);

  return {
    name: adminSessionCookieName,
    value: `${payload}.${signature}`,
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(sessionTtlMs / 1000),
    },
  };
}

export async function hasValidAdminSession(request: NextRequest) {
  return hasValidAdminSessionCookie(request.cookies.get(adminSessionCookieName)?.value);
}

export async function hasValidAdminSessionCookie(cookie: string | undefined) {
  if (!cookie) return false;

  const [payload, signature] = cookie.split('.');
  if (!payload || !signature) return false;

  const expectedSignature = await signValue(payload);
  if (!expectedSignature) return false;

  if (!timingSafeEqual(signature, expectedSignature)) return false;

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as Partial<AdminSessionPayload>;
    return typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminSessionCookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function getAdminPassword() {
  return process.env.ADMIN_DASHBOARD_PASSWORD || null;
}

async function signValue(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!secret) return '';

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return encodeBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

function encodeBase64Url(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string) {
  const padded = `${value}${'='.repeat((4 - (value.length % 4)) % 4)}`;
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}
