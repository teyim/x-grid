import { NextRequest, NextResponse } from 'next/server';
import { hasValidAdminSession } from '@/lib/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    if (await hasValidAdminSession(request)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  if (pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    if (await hasValidAdminSession(request)) return NextResponse.next();

    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (pathname.startsWith('/admin')) {
    if (await hasValidAdminSession(request)) return NextResponse.next();

    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
