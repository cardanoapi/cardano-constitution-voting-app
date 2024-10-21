import { NextRequest, NextResponse } from 'next/server';

// unsafe-inline required for style-src due to Next/Image inline style
// https://github.com/vercel/next.js/issues/45184

export function middleware(request: NextRequest): NextResponse<unknown> {
  const isProd = process.env.NODE_ENV === 'production';
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
  default-src 'self';
  base-uri 'self';
  child-src 'self';
  connect-src 'self';
  font-src 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self';
  img-src 'self';
  object-src 'none';
  script-src 
    'self' 
    ${isProd ? '' : "'unsafe-eval'"}  
    https://va.vercel-scripts.com/v1/script.debug.js;
  script-src-attr 'none';
  style-src 'self' ${isProd ? '' : "'unsafe-inline'"};
  upgrade-insecure-requests; 
  worker-src 'self';
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

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
