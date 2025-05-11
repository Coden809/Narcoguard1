/**
 * Security utilities for Narcoguard application
 * This module provides tools for securing the application and protecting user data
 */

import { randomBytes, scrypt, timingSafeEqual } from "crypto"
import { AppError, ErrorSeverity, ErrorCategory } from "./error-handling"

// Security configuration
export interface SecurityConfig {
  csrfEnabled: boolean
  csrfTokenName: string
  csrfTokenExpiry: number
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSpecial: boolean
  rateLimitRequests: number
  rateLimitWindow: number
  jwtSecret: string
  jwtExpiry: number
  encryptionKey: string
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  csrfEnabled: true,
  csrfTokenName: "narcoguard-csrf-token",
  csrfTokenExpiry: 3600, // 1 hour
  passwordMinLength: 12,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecial: true,
  rateLimitRequests: 100,
  rateLimitWindow: 60 * 1000, // 1 minute
  jwtSecret: process.env.JWT_SECRET || "narcoguard-default-jwt-secret",
  jwtExpiry: 24 * 60 * 60, // 24 hours
  encryptionKey: process.env.ENCRYPTION_KEY || "narcoguard-default-encryption-key",
}

// Rate limiter class
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  // Check if a key has exceeded the rate limit
  public check(key: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get existing requests for this key
    const keyRequests = this.requests.get(key) || []

    // Filter out requests outside the current window
    const recentRequests = keyRequests.filter((timestamp) => timestamp > windowStart)

    // Update the requests for this key
    this.requests.set(key, recentRequests)

    // Check if the number of recent requests exceeds the limit
    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    // Add the current request
    recentRequests.push(now)
    this.requests.set(key, recentRequests)

    return true
  }

  // Reset rate limit for a key
  public reset(key: string): void {
    this.requests.delete(key)
  }
}

// CSRF token manager
export class CSRFTokenManager {
  private readonly tokenName: string
  private readonly tokenExpiry: number

  constructor(tokenName: string, tokenExpiry: number) {
    this.tokenName = tokenName
    this.tokenExpiry = tokenExpiry
  }

  // Generate a new CSRF token
  public generateToken(): string {
    const token = randomBytes(32).toString("hex")

    if (typeof window !== "undefined") {
      // Store the token in a cookie
      document.cookie = `${this.tokenName}=${token}; path=/; max-age=${this.tokenExpiry}; SameSite=Strict; Secure`
    }

    return token
  }

  // Validate a CSRF token
  public validateToken(token: string): boolean {
    if (typeof window === "undefined") return false

    // Get the token from the cookie
    const cookies = document.cookie.split(";")
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${this.tokenName}=`))

    if (!tokenCookie) return false

    const storedToken = tokenCookie.split("=")[1].trim()

    // Compare the tokens using a timing-safe comparison
    return timingSafeEqual(Buffer.from(token), Buffer.from(storedToken))
  }
}

// Password utilities
export class PasswordUtils {
  private readonly minLength: number
  private readonly requireUppercase: boolean
  private readonly requireLowercase: boolean
  private readonly requireNumbers: boolean
  private readonly requireSpecial: boolean

  constructor(config: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecial: boolean
  }) {
    this.minLength = config.minLength
    this.requireUppercase = config.requireUppercase
    this.requireLowercase = config.requireLowercase
    this.requireNumbers = config.requireNumbers
    this.requireSpecial = config.requireSpecial
  }

  // Validate password strength
  public validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check length
    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters long`)
    }

    // Check for uppercase letters
    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    // Check for lowercase letters
    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    // Check for numbers
    if (this.requireNumbers && !/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    // Check for special characters
    if (this.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // Hash a password
  public async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Generate a random salt
      const salt = randomBytes(16).toString("hex")

      // Hash the password with the salt
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err)

        // Combine the salt and hash
        resolve(`${salt}:${derivedKey.toString("hex")}`)
      })
    })
  }

  // Verify a password against a hash
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Extract the salt from the hash
      const [salt, key] = hash.split(":")

      // Hash the password with the same salt
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err)

        // Compare the hashes
        resolve(key === derivedKey.toString("hex"))
      })
    })
  }
}

// Encryption utilities
export class EncryptionUtils {
  private readonly encryptionKey: string

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey
  }

  // Encrypt data
  public encrypt(data: string): string {
    try {
      // In a real implementation, this would use a proper encryption algorithm
      // For now, we'll use a simple XOR encryption for demonstration
      const key = this.encryptionKey
      let result = ""

      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode)
      }

      // Convert to base64 for safe storage
      return Buffer.from(result).toString("base64")
    } catch (error) {
      throw new AppError({
        message: "Failed to encrypt data",
        code: "ERR_ENCRYPTION",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.INTERNAL,
        cause: error as Error,
      })
    }
  }

  // Decrypt data
  public decrypt(encryptedData: string): string {
    try {
      // Convert from base64
      const data = Buffer.from(encryptedData, "base64").toString()
      const key = this.encryptionKey
      let result = ""

      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode)
      }

      return result
    } catch (error) {
      throw new AppError({
        message: "Failed to decrypt data",
        code: "ERR_DECRYPTION",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.INTERNAL,
        cause: error as Error,
      })
    }
  }
}

// Sanitize HTML to prevent XSS attacks
export function sanitizeHtml(html: string): string {
  // Simple sanitization - in production, use a library like DOMPurify
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Generate a secure random token
export function generateSecureToken(length = 32): string {
  return randomBytes(length).toString("hex")
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

// Create security utilities
export function createSecurityUtils(config: Partial<SecurityConfig> = {}): {
  rateLimiter: RateLimiter
  csrfTokenManager: CSRFTokenManager
  passwordUtils: PasswordUtils
  encryptionUtils: EncryptionUtils
} {
  const mergedConfig = { ...defaultSecurityConfig, ...config }

  return {
    rateLimiter: new RateLimiter(mergedConfig.rateLimitRequests, mergedConfig.rateLimitWindow),
    csrfTokenManager: new CSRFTokenManager(mergedConfig.csrfTokenName, mergedConfig.csrfTokenExpiry),
    passwordUtils: new PasswordUtils({
      minLength: mergedConfig.passwordMinLength,
      requireUppercase: mergedConfig.passwordRequireUppercase,
      requireLowercase: mergedConfig.passwordRequireLowercase,
      requireNumbers: mergedConfig.passwordRequireNumbers,
      requireSpecial: mergedConfig.passwordRequireSpecial,
    }),
    encryptionUtils: new EncryptionUtils(mergedConfig.encryptionKey),
  }
}
