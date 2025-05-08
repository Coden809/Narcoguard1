import { NextResponse } from "next/server"
import { generateDownloadToken } from "@/lib/auth"
import { getDownloadUrlForPlatform, getFallbackDownloadUrl } from "@/lib/file-handling"
import { logDownloadEvent } from "@/lib/analytics"
import { sendDownloadEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { platform, email } = await request.json()

    // Validate email and platform
    if (!email || !platform) {
      return NextResponse.json({ success: false, message: "Email and platform are required" }, { status: 400 })
    }

    // Validate platform
    const validPlatforms = ["ios", "android", "windows", "mac", "linux", "web", "desktop"]
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ success: false, message: "Invalid platform specified" }, { status: 400 })
    }

    // Generate secure download token that expires in 24 hours
    const downloadToken = generateDownloadToken(email, platform)

    // Get user agent for platform-specific downloads
    const userAgent = request.headers.get("user-agent") || ""

    // Get the appropriate download URL
    const downloadUrl = getDownloadUrlForPlatform(platform, userAgent)
    const fallbackUrl = getFallbackDownloadUrl(platform)

    // Add token to URL if not an external URL (like App Store)
    const finalDownloadUrl =
      downloadUrl.includes("http") && !downloadUrl.includes(process.env.NEXT_PUBLIC_APP_URL || "")
        ? downloadUrl
        : `${downloadUrl}?token=${downloadToken}`

    const finalFallbackUrl =
      fallbackUrl.includes("http") && !fallbackUrl.includes(process.env.NEXT_PUBLIC_APP_URL || "")
        ? fallbackUrl
        : `${fallbackUrl}?token=${downloadToken}`

    // Map platform to file name
    const platformMap: Record<string, { fileName: string; displayName: string }> = {
      android: { fileName: "narcoguard-latest.apk", displayName: "Android" },
      windows: { fileName: "narcoguard-setup.exe", displayName: "Windows" },
      mac: { fileName: "narcoguard.dmg", displayName: "macOS" },
      linux: { fileName: "narcoguard.AppImage", displayName: "Linux" },
      ios: { fileName: "", displayName: "iOS" },
      web: { fileName: "", displayName: "Web App" },
      desktop: { fileName: "", displayName: "Desktop" },
    }

    // Get platform-specific info
    const platformInfo = platformMap[platform] || { fileName: "narcoguard.zip", displayName: "Generic" }

    // Track download event in analytics
    await logDownloadEvent(platform, 0, "email", email, userAgent)

    // Send email with download link
    try {
      await sendDownloadEmail(email, finalDownloadUrl, platform, finalFallbackUrl)
      console.log(`Download email sent to ${email} for ${platform}`)
    } catch (error) {
      console.error("Failed to send download email:", error)
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Download link generated for ${platformInfo.displayName}`,
      downloadUrl: finalDownloadUrl,
      fallbackUrl: finalFallbackUrl,
      fileName: platformInfo.fileName,
      platform: platformInfo.displayName,
    })
  } catch (error) {
    console.error("Download request error:", error)
    return NextResponse.json({ success: false, message: "Failed to process download request" }, { status: 500 })
  }
}
