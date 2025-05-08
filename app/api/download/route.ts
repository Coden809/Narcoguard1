import { NextResponse } from "next/server"
import { sendDownloadEmail } from "@/lib/email"
import { generateDownloadToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, platform } = await request.json()

    // Validate email and platform
    if (!email || !platform) {
      return NextResponse.json({ success: false, message: "Email and platform are required" }, { status: 400 })
    }

    // Generate secure download token that expires in 24 hours
    const downloadToken = await generateDownloadToken(email, platform)

    // Build secure, direct download URLs for each platform
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://narcoguard.com"

    // Each platform has its own download path
    const downloadLinks = {
      ios: `${baseUrl}/api/downloads/ios?token=${downloadToken}`,
      android: `${baseUrl}/api/downloads/android?token=${downloadToken}`,
      desktop: {
        windows: `${baseUrl}/api/downloads/desktop/windows?token=${downloadToken}`,
        mac: `${baseUrl}/api/downloads/desktop/mac?token=${downloadToken}`,
        linux: `${baseUrl}/api/downloads/desktop/linux?token=${downloadToken}`,
      },
      web: `${baseUrl}/app?token=${downloadToken}`,
    }

    // Create appropriate download URL based on platform
    let downloadUrl = ""

    if (platform === "ios") {
      downloadUrl = downloadLinks.ios
    } else if (platform === "android") {
      downloadUrl = downloadLinks.android
    } else if (platform === "desktop") {
      // Detect OS or provide options in download page
      const userAgent = request.headers.get("user-agent") || ""
      if (userAgent.includes("Win")) {
        downloadUrl = downloadLinks.desktop.windows
      } else if (userAgent.includes("Mac")) {
        downloadUrl = downloadLinks.desktop.mac
      } else if (userAgent.includes("Linux")) {
        downloadUrl = downloadLinks.desktop.linux
      } else {
        // Fallback to a page where user can select their OS
        downloadUrl = `${baseUrl}/downloads/desktop?token=${downloadToken}`
      }
    } else if (platform === "web") {
      downloadUrl = downloadLinks.web
    } else {
      return NextResponse.json({ success: false, message: "Invalid platform" }, { status: 400 })
    }

    // Track download event in analytics
    await recordDownloadAttempt({
      email,
      platform,
      timestamp: new Date(),
      userAgent: request.headers.get("user-agent"),
    })

    // Send email with download link
    await sendDownloadEmail(email, downloadUrl, platform)

    return NextResponse.json({
      success: true,
      message: `Download link sent to ${email} for ${platform} platform`,
      downloadUrl,
    })
  } catch (error) {
    console.error("Download request error:", error)
    return NextResponse.json({ success: false, message: "Failed to process download request" }, { status: 500 })
  }
}

// Record analytics for downloads
async function recordDownloadAttempt(data) {
  try {
    // In a real implementation, this would store data in a database
    console.log("Download attempt recorded:", data)
  } catch (error) {
    console.error("Failed to record download attempt:", error)
  }
}
