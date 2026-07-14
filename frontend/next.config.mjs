/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

export default nextConfig;