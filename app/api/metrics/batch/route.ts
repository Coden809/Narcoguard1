import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

// Set up rate limiter - 20 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  limit: 20, // 20 requests per interval per IP
})

export async function POST(request: Request) {
  // Rate limiting based on IP
  const ip = request.headers.get("x-forwarded-for") || "anonymous"

  try {
    // Check rate limit
    await limiter.check(20, ip)

    // Parse request body
    const body = await request.json()

    if (!body || !Array.isArray(body.entries)) {
      return NextResponse.json({ error: "Invalid metrics data format" }, { status: 400 })
    }

    // Process metrics data
    // In a real implementation, this would store the data in a database
    // or send it to an analytics service
    console.log(`Received batch of ${body.entries.length} metrics from ${ip}`)

    // For development, just log a sample of the data
    if (process.env.NODE_ENV === "development") {
      console.log("Sample metrics:", body.entries.slice(0, 3))
    }

    // In production, you would typically:
    // 1. Validate the data
    // 2. Filter out irrelevant metrics
    // 3. Store in a time-series database or send to analytics
    // 4. Set up alerts for poor performance

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing metrics batch:", error)

    // Handle rate limiting errors
    if (error.message === "Rate limit exceeded") {
      return NextResponse.json(
        { error: "Too many metrics requests" },
        { status: 429, headers: { "Retry-After": "60" } },
      )
    }

    return NextResponse.json({ error: "Failed to process metrics" }, { status: 500 })
  }
}
