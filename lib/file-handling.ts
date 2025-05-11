import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function streamFile(filePath: string, contentType: string, filename: string): Promise<NextResponse> {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    const stats = fs.statSync(filePath)
    const fileSize = stats.size

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileSize.toString(),
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("File streaming error:", error)
    return NextResponse.json({ error: "Failed to stream file" }, { status: 500 })
  }
}

export function verifyDownloadFile(filePath: string): boolean {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Download file not found: ${filePath}`)
      return false
    }

    // Check if the file is readable
    fs.accessSync(filePath, fs.constants.R_OK)

    // Check if the file is not a directory
    const stats = fs.statSync(filePath)
    if (!stats.isFile()) {
      console.warn(`Download path is not a file: ${filePath}`)
      return false
    }

    // Add more checks as needed (e.g., file size, checksum)

    return true
  } catch (error) {
    console.error("Download file verification error:", error)
    return false
  }
}

export function getDownloadUrlForPlatform(platform: string, userAgent: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://narcoguard.com"

  switch (platform) {
    case "ios":
      return "https://apps.apple.com/us/app/narcoguard/id1234567890"
    case "android":
      return `${baseUrl}/api/download/files/android`
    case "windows":
      return `${baseUrl}/api/download/files/windows`
    case "mac":
      return `${baseUrl}/api/download/files/mac`
    case "linux":
      return `${baseUrl}/api/download/files/linux`
    case "web":
      return `${baseUrl}/app`
    case "desktop":
      if (userAgent.includes("Win")) {
        return `${baseUrl}/api/download/files/windows`
      } else if (userAgent.includes("Mac")) {
        return `${baseUrl}/api/download/files/mac`
      } else if (userAgent.includes("Linux")) {
        return `${baseUrl}/api/download/files/linux`
      } else {
        return `${baseUrl}/api/download/files/generic`
      }
    default:
      return `${baseUrl}/api/download/files/generic`
  }
}

export function getFallbackDownloadUrl(platform: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://narcoguard.com"

  switch (platform) {
    case "ios":
      return "https://apps.apple.com/us/app/narcoguard/id1234567890"
    case "android":
      return "https://play.google.com/store/apps/details?id=com.narcoguard"
    case "windows":
    case "mac":
    case "linux":
    case "desktop":
      return `${baseUrl}/api/download/files/generic`
    case "web":
      return `${baseUrl}/app`
    default:
      return `${baseUrl}/api/download/files/generic`
  }
}

export async function ensureDownloadFiles(): Promise<void> {
  const downloadsDir = path.join(process.cwd(), "public", "downloads")

  // Create downloads directory if it doesn't exist
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true })
    console.log(`Created directory: ${downloadsDir}`)
  }

  const files = [
    "narcoguard-latest.apk",
    "narcoguard-setup.exe",
    "narcoguard.dmg",
    "narcoguard.AppImage",
    "narcoguard.zip",
  ]

  for (const file of files) {
    const filePath = path.join(downloadsDir, file)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `Sample ${file} file`)
      console.log(`Created sample file: ${filePath}`)
    }
  }
}
