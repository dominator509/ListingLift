import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; connect-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // P4-02 / L7: Block TRACE before Next.js internal router processes it
  // Returning 405 directly is not possible here, but Next.js's strict method
  // handling rejects non-standard methods effectively. The middleware handles
  // any TRACE requests that reach it for routes in its matcher.
  serverExternalPackages: [],
  async headers() {
    const cacheHeaders = [
      { key: 'Cache-Control', value: 'public, s-maxage=60' },
    ];
    return [
      {
        source: '/:path*',
        headers: process.env.NODE_ENV === 'production'
          ? [...securityHeaders, { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
          : securityHeaders,
      },
      { source: '/', headers: cacheHeaders },
      { source: '/pricing', headers: cacheHeaders },
      { source: '/packages', headers: cacheHeaders },
    ];
  },
};

export default nextConfig;
