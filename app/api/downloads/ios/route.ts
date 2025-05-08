import { NextResponse } from "next/server"
import { verifyDownloadToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Verify the token is valid
    const tokenData = await verifyDownloadToken(token)
    if (!tokenData || tokenData.platform !== "ios") {
      return NextResponse.json({ error: "Invalid or expired download token" }, { status: 401 })
    }

    // For iOS, we need to redirect to the App Store
    // In a real implementation, you could also have enterprise distribution
    return NextResponse.redirect("https://apps.apple.com/us/app/narcoguard/id1234567890")
  } catch (error) {
    console.error("iOS download error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
