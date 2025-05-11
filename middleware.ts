import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Security headers map
const securityHeaders = {
  // HSTS (HTTP Strict Transport Security) header
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // X-Content-Type-Options header to prevent MIME sniffing
  "X-Content-Type-Options": "nosniff",
  // X-Frame-Options header to prevent clickjacking
  "X-Frame-Options": "SAMEORIGIN",
  // X-XSS-Protection header to enable the browser's XSS filter
  "X-XSS-Protection": "1; mode=block",
  // Referrer-Policy header to control how much referrer information is included
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Permissions-Policy header to control browser features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  // Content-Security-Policy header to help prevent XSS attacks
  "Content-Security-Policy": `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://apis.google.com https://openai.com https://ai.googleapis.com;
    frame-src 'self';
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s+/g, " ")
    .trim(),
}

// Cache TTL constants in seconds
const CACHE_NONE = 0
const CACHE_SHORT = 60 // 1 minute
const CACHE_MEDIUM = 60 * 60 // 1 hour
const CACHE_LONG = 60 * 60 * 24 // 1 day
const CACHE_VERY_LONG = 60 * 60 * 24 * 30 // 30 days

// Configure cache based on path patterns
function getCacheTTL(path: string): number {
  // Static assets get longest cache
  if (/\.(jpe?g|png|gif|svg|webp|css|js|woff2?|ttf|otf|eot)$/i.test(path)) {
    return CACHE_VERY_LONG
  }

  // API routes don't get cached
  if (path.startsWith("/api/")) {
    return CACHE_NONE
  }

  // Dynamic routes don't get cached
  if (path.includes("[") || path.includes("(")) {
    return CACHE_NONE
  }

  // Dashboard and user-specific routes don't get cached
  if (path.startsWith("/dashboard") || path.startsWith("/app")) {
    return CACHE_NONE
  }

  // Static pages get medium cache
  return CACHE_MEDIUM
}

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Clone the response
  const response = NextResponse.next()

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply caching headers based on the path
  const cacheTTL = getCacheTTL(path)

  if (cacheTTL > 0) {
    response.headers.set(
      "Cache-Control",
      `public, max-age=${cacheTTL}, s-maxage=${cacheTTL}, stale-while-revalidate=${cacheTTL * 0.5}`,
    )
  } else {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
  }

  // Return the modified response
  return response
}

// Only run middleware on these paths
export const config = {
  matcher: [
    // Match all pathnames except for static files
    "/((?!_next/static|favicon.ico|robots.txt).*)",
  ],
}
