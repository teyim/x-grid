import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionCookie, getAdminPassword } from '@/lib/adminSession';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return NextResponse.json(
      { ok: false, error: 'Admin dashboard password is not configured.' },
      { status: 500 }
    );
  }

  let payload: { password?: string; next?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (payload.password !== configuredPassword) {
    return NextResponse.json({ ok: false, error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    next: normalizeNextPath(payload.next),
  });
  const cookie = await createAdminSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}

function normalizeNextPath(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/admin')) return '/admin';
  if (value.startsWith('/admin/login')) return '/admin';
  return value;
}
