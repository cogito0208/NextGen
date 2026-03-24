import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

// Auth routes that authenticated users shouldn't access
const authRoutes = ['/login', '/register'];

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/settings', '/users', '/projects'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API auth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Get session
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    // Check if it's a protected route or API route
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isApiRoute = pathname.startsWith('/api') && !pathname.startsWith('/api/auth');

    if (isProtectedRoute || isApiRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
