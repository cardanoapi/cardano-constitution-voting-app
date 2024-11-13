import { NextRequest, NextResponse } from 'next/server';

// unsafe-inline required for style-src due to Next/Image inline style
// https://github.com/vercel/next.js/issues/45184

export function middleware(request: NextRequest): Response {
  const isProd = process.env.NODE_ENV === 'production';
  const cspHeader = `
  default-src 'self';
  base-uri 'self';
  child-src 'self';
  connect-src 'self';
  font-src 
    'self'
    https://fonts.gstatic.com/;
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://vercel.live/;
  img-src 'self';
  object-src 'none';
  script-src 
    'self' 
    ${isProd ? '' : "'unsafe-eval'"}  
    https://va.vercel-scripts.com/v1/script.debug.js 
    https://vercel.live/_next-live/feedback/;
  script-src-attr 'none';
  style-src 
    'self' 
    'unsafe-inline'
    https://fonts.gstatic.com/;
  upgrade-insecure-requests; 
  worker-src 'self';
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);

  // Need to exclude NextAuth paths from X-Custom-Header Check
  const excludedPaths = ['/api/auth'];

  if (
    request.nextUrl.pathname.startsWith('/api') &&
    !excludedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    (!requestHeaders.has('X-Custom-Header') ||
      requestHeaders.get('X-Custom-Header') !== 'intersect')
  ) {
    return Response.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );

  return response;
}
