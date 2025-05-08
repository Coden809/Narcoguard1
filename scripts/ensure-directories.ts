import fs from "fs"
import path from "path"

// Create necessary directories for downloads
const directories = ["public/downloads"]

directories.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`Created directory: ${fullPath}`)
  } else {
    console.log(`Directory already exists: ${fullPath}`)
  }
})

// Create sample files for testing
const sampleFiles = [
  { path: "public/downloads/narcoguard-latest.apk", content: "Sample Android APK file" },
  { path: "public/downloads/narcoguard-setup.exe", content: "Sample Windows installer file" },
  { path: "public/downloads/narcoguard.dmg", content: "Sample macOS DMG file" },
  { path: "public/downloads/narcoguard.AppImage", content: "Sample Linux AppImage file" },
  { path: "public/downloads/narcoguard.zip", content: "Sample ZIP file containing all platforms" },
]

sampleFiles.forEach((file) => {
  const fullPath = path.join(process.cwd(), file.path)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.content)
    console.log(`Created sample file: ${fullPath}`)
  } else {
    console.log(`Sample file already exists: ${fullPath}`)
  }
})

console.log("Directory and file setup complete!")
