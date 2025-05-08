import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { verifyDownloadToken } from "@/lib/auth"
import { verifyDownloadFile } from "@/lib/file-handling"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Invalid request: Missing token" }, { status: 400 })
    }

    // Verify the token is valid
    try {
      const tokenData = await verifyDownloadToken(token)
      if (!tokenData || (tokenData.platform !== "windows" && tokenData.platform !== "desktop")) {
        return NextResponse.json({ error: "Invalid or expired download token" }, { status: 401 })
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ error: "Invalid or expired download token" }, { status: 401 })
    }

    // Path to the Windows installer
    const filePath =
      process.env.WINDOWS_INSTALLER_PATH || path.join(process.cwd(), "public", "downloads", "narcoguard-setup.exe")

    // Create a sample file if it doesn't exist (for development only)
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      const sampleContent = `This is a sample Windows installer file for Narcoguard.
Created at: ${new Date().toISOString()}
This would be the actual application binary in production.`

      fs.writeFileSync(filePath, sampleContent)
      console.log(`Created sample file at: ${filePath}`)
    }

    // Verify the file is valid
    if (!verifyDownloadFile(filePath)) {
      return NextResponse.json({ error: "Download file is invalid or corrupted" }, { status: 500 })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)
    const stats = fs.statSync(filePath)
    const fileSize = stats.size

    // Return the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="narcoguard-setup.exe"`,
        "Content-Length": fileSize.toString(),
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Windows download error:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
