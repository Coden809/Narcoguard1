import jwt from "jsonwebtoken"

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || "narcoguard-secret-key"

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "1h"
const REFRESH_TOKEN_EXPIRY = "7d"
const DOWNLOAD_TOKEN_EXPIRY = "24h"

/**
 * Generate a JWT access token
 * @param userId User ID
 * @param email User email
 * @returns JWT access token
 */
export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign(
    {
      sub: userId,
      email,
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  )
}

/**
 * Generate a JWT refresh token
 * @param userId User ID
 * @returns JWT refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    {
      sub: userId,
      type: "refresh",
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  )
}

/**
 * Generate a JWT download token
 * @param email User email
 * @param platform Download platform
 * @returns JWT download token
 */
export function generateDownloadToken(email: string, platform: string): string {
  return jwt.sign(
    {
      email,
      platform,
      type: "download",
    },
    JWT_SECRET,
    { expiresIn: DOWNLOAD_TOKEN_EXPIRY },
  )
}

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

/**
 * Verify a JWT download token
 * @param token JWT download token
 * @returns Decoded token payload or null if invalid
 */
export function verifyDownloadToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded && (decoded as any).type === "download") {
      return decoded
    }
    return null
  } catch (error) {
    console.error("Download token verification error:", error)
    return null
  }
}

/**
 * Hash a password (placeholder - use a proper password hashing library in production)
 * @param password Plain text password
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  // In a real application, use a proper password hashing library like bcrypt
  // This is just a placeholder
  return `hashed_${password}`
}

/**
 * Verify a password against a hash (placeholder - use a proper password verification in production)
 * @param password Plain text password
 * @param hash Hashed password
 * @returns Whether the password matches the hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  // In a real application, use a proper password verification
  // This is just a placeholder
  return hash === `hashed_${password}`
}
