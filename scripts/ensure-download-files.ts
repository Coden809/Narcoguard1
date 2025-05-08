import { ensureDownloadFiles } from "../lib/file-handling"

// Run the function to ensure all download files exist
ensureDownloadFiles()
  .then(() => {
    console.log("Download files setup complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error setting up download files:", error)
    process.exit(1)
  })
