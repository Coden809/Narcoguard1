export interface RateLimiterOptions {
  interval: number
  limit: number
  uniqueTokenPerInterval: number
}

interface RateLimiterResponse {
  limit: number
  remaining: number
  reset: number
}

export function rateLimit(options: RateLimiterOptions) {
  const { interval, limit, uniqueTokenPerInterval } = options
  const tokenCache = new Map<string, number[]>()

  // Clean up function to prevent memory leaks
  const cleanup = () => {
    const now = Date.now()
    for (const [key, timestamps] of tokenCache.entries()) {
      const validTimestamps = timestamps.filter((timestamp) => now - timestamp < interval)
      if (validTimestamps.length === 0) {
        tokenCache.delete(key)
      } else {
        tokenCache.set(key, validTimestamps)
      }
    }
  }

  // Set up interval cleanup
  setInterval(cleanup, interval)

  return {
    check: (tokenLimit: number = limit, token = "global"): Promise<RateLimiterResponse> => {
      const now = Date.now()
      const timestamps = tokenCache.get(token) || []
      const validTimestamps = timestamps.filter((timestamp) => now - timestamp < interval)

      // Add current request timestamp
      validTimestamps.push(now)
      tokenCache.set(token, validTimestamps)

      const remainingTokens = Math.max(0, tokenLimit - validTimestamps.length)
      const resetTime = now + interval

      // Check if rate limit is exceeded
      if (validTimestamps.length > tokenLimit) {
        return Promise.reject(new Error("Rate limit exceeded"))
      }

      return Promise.resolve({
        limit: tokenLimit,
        remaining: remainingTokens,
        reset: resetTime,
      })
    },
  }
}
