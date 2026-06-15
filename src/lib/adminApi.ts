import { NextRequest, NextResponse } from 'next/server';
import { hasValidAdminSession } from '@/lib/adminSession';

export async function requireAdminApiSession(request: NextRequest) {
  if (await hasValidAdminSession(request)) return null;

  return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}
