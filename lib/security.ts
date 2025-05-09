/**
 * Security utilities for Narcoguard application
 */

// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(html: string): string {
  // Simple sanitization - in production, use a library like DOMPurify
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Generate a secure random token
export function generateSecureToken(length = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Validate input against regex patterns
export function validateInput(input: string, pattern: RegExp): boolean {
  return pattern.test(input)
}

// Common validation patterns
export const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

// Content Security Policy helper
export function generateCSP(): string {
  const policies = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://analytics.narcoguard.com"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https://images.narcoguard.com", "https://secure.gravatar.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": ["'self'", "https://api.narcoguard.com"],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  }

  return Object.entries(policies)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ")
}

// Prevent clickjacking
export function setSecurityHeaders(headers: Headers): Headers {
  headers.set("X-Frame-Options", "DENY")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)")
  headers.set("X-XSS-Protection", "1; mode=block")

  // Only in production
  if (process.env.NODE_ENV === "production") {
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  }

  return headers
}
