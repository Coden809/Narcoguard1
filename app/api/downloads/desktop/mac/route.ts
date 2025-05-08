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
    if (!tokenData || tokenData.platform !== "desktop") {
      return NextResponse.json({ error: "Invalid or expired download token" }, { status: 401 })
    }

    // Path to the macOS DMG file stored securely on the server
    const filePath = process.env.MAC_DMG_PATH || "./public/downloads/narcoguard.dmg"

    // Stream the file to the client
    return streamFile(filePath, "application/x-apple-diskimage", "narcoguard.dmg")
  } catch (error) {
    console.error("macOS download error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
