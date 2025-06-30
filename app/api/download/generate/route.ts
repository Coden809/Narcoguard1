import { NextResponse } from "next/server"
import { 
  processDownloadRequest, 
  detectPlatform, 
  type DownloadRequest 
} from "@/lib/download-service"
import { logDownloadEvent } from "@/lib/analytics"
import { sendDownloadEmail } from "@/lib/email"
import { rateLimit } from "@/lib/rate-limit"

// Rate limiter - 10 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
  limit: 10,
})

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous"

  try {
    // Apply rate limiting
    await limiter.check(10, ip)

    // Parse request body
    const body = await request.json()
    const { email, platform: requestedPlatform } = body

    // Get user agent and detect platform if not specified
    const userAgent = request.headers.get("user-agent") || ""
    const detectedPlatform = detectPlatform(userAgent)
    const platform = requestedPlatform || detectedPlatform

    // Create download request
    const downloadRequest: DownloadRequest = {
      email,
      platform,
      userAgent,
      deviceInfo: {
        os: detectedPlatform,
        browser: getBrowserFromUserAgent(userAgent),
        version: getVersionFromUserAgent(userAgent),
        mobile: isMobileDevice(userAgent)
      }
    }

    // Process the download request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://narcoguard.com"
    const response = await processDownloadRequest(downloadRequest, baseUrl)

    if (!response.success) {
      return NextResponse.json({
        success: false,
        message: response.error || "Failed to generate download link"
      }, { status: 400 })
    }

    // Log download event
    try {
      await logDownloadEvent(
        platform,
        0, // File size unknown at this point
        response.downloadUrl.includes('app.') ? 'store' : 'direct',
        email,
        userAgent
      )
    } catch (error) {
      console.error("Failed to log download event:", error)
      // Continue even if logging fails
    }

    // Send download email
    try {
      await sendDownloadEmail(
        email,
        response.downloadUrl,
        platform,
        response.fallbackUrl,
        response.instructions
      )
    } catch (error) {
      console.error("Failed to send download email:", error)
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Download link generated for ${response.platform}`,
      data: {
        downloadUrl: response.downloadUrl,
        fallbackUrl: response.fallbackUrl,
        fileName: response.fileName,
        platform: response.platform,
        expiresAt: response.expiresAt.toISOString(),
        instructions: response.instructions
      }
    })

  } catch (error) {
    console.error("Download generation error:", error)

    // Handle rate limiting
    if (error.message === "Rate limit exceeded") {
      return NextResponse.json({
        success: false,
        message: "Too many download requests. Please try again later."
      }, { status: 429 })
    }

    return NextResponse.json({
      success: false,
      message: "Failed to process download request"
    }, { status: 500 })
  }
}

// Helper functions
function getBrowserFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('chrome') && !ua.includes('edge')) return 'chrome'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari'
  if (ua.includes('edge')) return 'edge'
  if (ua.includes('opera')) return 'opera'
  
  return 'unknown'
}

function getVersionFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  // Extract version numbers (simplified)
  const chromeMatch = ua.match(/chrome\/(\d+)/)
  if (chromeMatch) return chromeMatch[1]
  
  const firefoxMatch = ua.match(/firefox\/(\d+)/)
  if (firefoxMatch) return firefoxMatch[1]
  
  const safariMatch = ua.match(/version\/(\d+)/)
  if (safariMatch) return safariMatch[1]
  
  return 'unknown'
}

function isMobileDevice(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
}