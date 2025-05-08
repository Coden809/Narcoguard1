const fs = require("fs")
const path = require("path")

// Define the download directories
const downloadDirs = [path.join(process.cwd(), "public", "downloads")]

// Define the sample files to create
const sampleFiles = [
  {
    path: path.join(process.cwd(), "public", "downloads", "narcoguard-latest.apk"),
    content: "Narcoguard Android APK Sample File\nCreated: " + new Date().toISOString(),
  },
  {
    path: path.join(process.cwd(), "public", "downloads", "narcoguard-setup.exe"),
    content: "Narcoguard Windows Installer Sample File\nCreated: " + new Date().toISOString(),
  },
  {
    path: path.join(process.cwd(), "public", "downloads", "narcoguard.dmg"),
    content: "Narcoguard macOS Disk Image Sample File\nCreated: " + new Date().toISOString(),
  },
  {
    path: path.join(process.cwd(), "public", "downloads", "narcoguard.AppImage"),
    content: "Narcoguard Linux AppImage Sample File\nCreated: " + new Date().toISOString(),
  },
  {
    path: path.join(process.cwd(), "public", "downloads", "narcoguard.zip"),
    content: "Narcoguard Multi-Platform Package Sample File\nCreated: " + new Date().toISOString(),
  },
]

// Create directories if they don't exist
downloadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`)
    fs.mkdirSync(dir, { recursive: true })
  } else {
    console.log(`Directory already exists: ${dir}`)
  }
})

// Create sample files if they don't exist
sampleFiles.forEach((file) => {
  if (!fs.existsSync(file.path)) {
    console.log(`Creating sample file: ${file.path}`)
    fs.writeFileSync(file.path, file.content)
  } else {
    console.log(`Sample file already exists: ${file.path}`)
  }
})

console.log("Download directories and sample files have been created successfully.")
