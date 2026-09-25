/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['express'],
  outputFileTracingIncludes: { '/uploads/*': ['./server/uploads/**/*'], '/api/*': ['./server/uploads/**/*'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },

      // Local backend (legacy uploads)
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },

      // Production website
      {
        protocol: "https",
        hostname: "proowrx.com",
      },

      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },


      // Google Storage
      {
        protocol: "https",
        hostname: "commondatastorage.googleapis.com",
      },

      // Google-hosted images used by existing blog posts
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },

      // LinkedIn profile images used by team members
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },

      // Country flags displayed in the footer
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://proowrx.com https://commondatastorage.googleapis.com https://encrypted-tbn0.gstatic.com https://media.licdn.com https://flagcdn.com http://localhost:5000",
      "media-src 'self' blob: https://res.cloudinary.com",
      "connect-src 'self'",
      "frame-src https://calendly.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
      "worker-src 'self' blob:",
      process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests' : '',
    ].filter(Boolean).join('; ');

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: contentSecurityPolicy },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
      { key: 'X-Accel-Buffering', value: 'no' },
    ];

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
