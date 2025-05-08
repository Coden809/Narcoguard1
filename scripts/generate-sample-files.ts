/**
 * This script generates sample download files for testing purposes.
 * In a real application, these would be actual application binaries.
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(process.cwd(), "public", "downloads")
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true })
}

// Generate a sample text file with platform info
function generateSampleFile(platform: string, extension: string) {
  const content = `
Narcoguard Sample ${platform} Application
========================================

This is a sample file representing the Narcoguard application for ${platform}.
In a real application, this would be an actual executable file.

Version: 1.2.0
Build Date: ${new Date().toISOString()}
Platform: ${platform}

Features:
- Real-time vital sign monitoring
- Automatic overdose detection
- Emergency contact notification
- GPS location sharing
- Integration with medical records
- Hero Network community response
- Naloxone locator
- CPR and naloxone administration tutorials

Installation Instructions:
1. Double-click the file to begin installation
2. Follow the on-screen prompts
3. Launch Narcoguard after installation completes

For support, contact support@narcoguard.com
`

  const filePath = path.join(downloadsDir, `narcoguard${extension}`)
  fs.writeFileSync(filePath, content)
  console.log(`Generated sample file for ${platform}: ${filePath}`)
}

// Generate sample files for each platform
generateSampleFile("Android", "-latest.apk")
generateSampleFile("Windows", "-setup.exe")
generateSampleFile("macOS", ".dmg")
generateSampleFile("Linux", ".AppImage")

// Generate a ZIP file containing all platforms
try {
  // Create a temporary directory for ZIP contents
  const tempDir = path.join(downloadsDir, "temp")
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Copy all files to the temp directory
  fs.copyFileSync(path.join(downloadsDir, "narcoguard-latest.apk"), path.join(tempDir, "narcoguard-latest.apk"))
  fs.copyFileSync(path.join(downloadsDir, "narcoguard-setup.exe"), path.join(tempDir, "narcoguard-setup.exe"))
  fs.copyFileSync(path.join(downloadsDir, "narcoguard.dmg"), path.join(tempDir, "narcoguard.dmg"))
  fs.copyFileSync(path.join(downloadsDir, "narcoguard.AppImage"), path.join(tempDir, "narcoguard.AppImage"))

  // Create a README file
  fs.writeFileSync(
    path.join(tempDir, "README.txt"),
    `
Narcoguard Multi-Platform Package
================================

This package contains Narcoguard applications for multiple platforms:

- narcoguard-latest.apk: Android application
- narcoguard-setup.exe: Windows installer
- narcoguard.dmg: macOS disk image
- narcoguard.AppImage: Linux AppImage

Choose the appropriate file for your operating system.

For support, contact support@narcoguard.com
`,
  )

  // Create ZIP file
  const zipPath = path.join(downloadsDir, "narcoguard.zip")

  // Use different zip commands based on platform
  if (process.platform === "win32") {
    // Windows
    execSync(`powershell Compress-Archive -Path "${tempDir}\\*" -DestinationPath "${zipPath}" -Force`)
  } else {
    // Unix-like systems (Linux, macOS)
    execSync(`cd "${tempDir}" && zip -r "${zipPath}" .`)
  }

  console.log(`Generated ZIP file: ${zipPath}`)

  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true })
} catch (error) {
  console.error("Error creating ZIP file:", error)
}

console.log("Sample files generation complete!")
