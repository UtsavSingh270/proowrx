/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
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

      {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/mhvjskc1/**",
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
};

export default nextConfig;
