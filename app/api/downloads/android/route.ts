import { NextResponse } from "next/server"
import { verifyDownloadToken } from "@/lib/auth"
import { streamFile } from "@/lib/file-handling"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Verify the token is valid
    const tokenData = await verifyDownloadToken(token)
    if (!tokenData || tokenData.platform !== "android") {
      return NextResponse.json({ error: "Invalid or expired download token" }, { status: 401 })
    }

    // For direct APK download (for users who want to sideload)
    // Path to the APK file stored securely on the server
    const filePath = process.env.ANDROID_APK_PATH || "./public/downloads/narcoguard.apk"

    // Stream the file to the client
    return streamFile(filePath, "application/vnd.android.package-archive", "narcoguard.apk")

    // Alternative: Redirect to Google Play Store
    // return NextResponse.redirect('https://play.google.com/store/apps/details?id=com.narcoguard')
  } catch (error) {
    console.error("Android download error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
