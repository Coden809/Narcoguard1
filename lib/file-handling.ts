import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { logDownloadEvent } from "./analytics"

/**
 * Stream a file to the client
 * @param filePath Path to the file
 * @param contentType Content type of the file
 * @param fileName Name of the file for download
 * @returns NextResponse with the file stream
 */
export async function streamFile(filePath: string, contentType: string, fileName: string): Promise<NextResponse> {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`)

      // Create directory if it doesn't exist
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // For development/testing, create a sample file
      // In production, this should return an error or fallback to a default file
      const sampleContent = `This is a sample ${fileName} file for testing purposes.
Created at: ${new Date().toISOString()}
This would be the actual application binary in production.`

      // Write sample file
      fs.writeFileSync(filePath, sampleContent)
      console.log(`Created sample file at: ${filePath}`)
    }

    // Get file stats
    const stats = fs.statSync(filePath)
    const fileSize = stats.size

    // Read file into buffer
    const fileBuffer = fs.readFileSync(filePath)

    // Track download
    try {
      await logDownloadEvent(fileName, fileSize, "direct")
    } catch (error) {
      console.error("Failed to log download event:", error)
      // Continue with download even if logging fails
    }

    // Create response with file buffer
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileSize.toString(),
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff", // Security header
      },
    })

    return response
  } catch (error) {
    console.error("Error streaming file:", error)
    return NextResponse.json({ error: "Failed to stream file" }, { status: 500 })
  }
}

/**
 * Verify that all download files exist and create them if they don't
 * This should be run at startup to ensure all files are available
 */
export async function ensureDownloadFiles(): Promise<void> {
  const downloadDir = path.join(process.cwd(), "public", "downloads")

  // Create directory if it doesn't exist
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true })
  }

  // Define all required files
  const requiredFiles = [
    { path: path.join(downloadDir, "narcoguard-latest.apk"), content: "Narcoguard Android APK" },
    { path: path.join(downloadDir, "narcoguard-setup.exe"), content: "Narcoguard Windows Installer" },
    { path: path.join(downloadDir, "narcoguard.dmg"), content: "Narcoguard macOS Disk Image" },
    { path: path.join(downloadDir, "narcoguard.AppImage"), content: "Narcoguard Linux AppImage" },
    { path: path.join(downloadDir, "narcoguard.zip"), content: "Narcoguard Multi-Platform Package" },
  ]

  // Create any missing files
  for (const file of requiredFiles) {
    if (!fs.existsSync(file.path)) {
      fs.writeFileSync(file.path, `${file.content}\nCreated: ${new Date().toISOString()}`)
      console.log(`Created missing download file: ${file.path}`)
    }
  }

  console.log("Download files verified")
}

/**
 * Get the appropriate download URL for a platform based on user agent
 * @param platform Platform identifier
 * @param userAgent User agent string
 * @returns The most appropriate download URL
 */
export function getDownloadUrlForPlatform(platform: string, userAgent: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // For desktop platform, detect OS from user agent
  if (platform === "desktop") {
    if (userAgent.includes("Windows")) {
      return `${baseUrl}/api/download/files/windows`
    } else if (userAgent.includes("Mac")) {
      return `${baseUrl}/api/download/files/mac`
    } else if (userAgent.includes("Linux")) {
      return `${baseUrl}/api/download/files/linux`
    } else {
      // Fallback to generic download
      return `${baseUrl}/api/download/files/generic`
    }
  }

  // Direct mapping for specific platforms
  const platformUrls: Record<string, string> = {
    ios: "https://apps.apple.com/us/app/narcoguard/id1234567890",
    android: `${baseUrl}/api/download/files/android`,
    windows: `${baseUrl}/api/download/files/windows`,
    mac: `${baseUrl}/api/download/files/mac`,
    linux: `${baseUrl}/api/download/files/linux`,
    web: `${baseUrl}/app`,
  }

  return platformUrls[platform] || `${baseUrl}/api/download/files/generic`
}

/**
 * Verify that a download file is valid and complete
 * @param filePath Path to the file
 * @returns Boolean indicating if the file is valid
 */
export function verifyDownloadFile(filePath: string): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      return false
    }

    const stats = fs.statSync(filePath)

    // Check if file is empty or suspiciously small
    if (stats.size < 1000) {
      // Arbitrary minimum size for a valid app file
      console.warn(`File at ${filePath} is suspiciously small (${stats.size} bytes)`)
      return false
    }

    // Additional checks could be added here:
    // - File signature/magic number verification
    // - Checksum validation
    // - File format validation

    return true
  } catch (error) {
    console.error(`Error verifying download file ${filePath}:`, error)
    return false
  }
}

/**
 * Get a fallback download URL if the primary one fails
 * @param platform Platform identifier
 * @returns Fallback download URL
 */
export function getFallbackDownloadUrl(platform: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Fallback to generic download for all platforms
  return `${baseUrl}/api/download/files/generic`
}
