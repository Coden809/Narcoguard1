import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import DownloadPage from "@/components/download-page"

export const metadata: Metadata = {
  title: "Download Narcoguard | Prevent Overdose Fatalities",
  description: "Download the Narcoguard app for your device. Available for iOS, Android, Windows, and macOS.",
}

export default function Download() {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-narcoguard-purple/5 to-background">
        <DownloadPage />
      </div>
      <Footer />
    </>
  )
}
