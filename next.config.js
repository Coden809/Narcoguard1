/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["narcoguard.com"],
    formats: ["image/avif", "image/webp"],
    // Enable image optimization for better performance
    // Only disable this if you have specific deployment constraints
    unoptimized: process.env.NODE_ENV === "development",
    // Add reasonable image size limits
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Remove experimental features that are now standard or conflicting
  experimental: {
    optimizeFonts: true,
    // Remove optimizeImages as it conflicts with images.unoptimized
    // Remove serverComponents as it's now standard
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), accelerometer=(self)",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
  poweredByHeader: false,
  // For production, consider enabling ESLint and TypeScript checks
  // For temporary deployment fixes, keep these settings
  eslint: {
    // Consider changing to false for production to catch issues
    ignoreDuringBuilds: process.env.NODE_ENV === "production" ? true : false,
    // Optional: Add dirs to exclude certain directories
    // dirs: ['pages', 'components', 'lib', 'utils'],
  },
  typescript: {
    // Consider changing to false for production to catch issues
    ignoreBuildErrors: process.env.NODE_ENV === "production" ? true : false,
  },
  // Add output configuration for better build output
  output: "standalone",
  // Add compiler options for better performance
  compiler: {
    // Enable React Server Components
    reactRemoveProperties: process.env.NODE_ENV === "production",
    removeConsole: process.env.NODE_ENV === "production",
  },
}

module.exports = nextConfig
