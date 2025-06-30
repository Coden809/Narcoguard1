import { notFound } from "next/navigation"
import type { Metadata } from "next"
import DownloadPage from "@/components/download-page"

type Props = {
  params: Promise<{ platform: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params

  const platformNames = {
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
    web: "Web App",
  }

  const platformName = platformNames[platform as keyof typeof platformNames] || "Download"

  return {
    title: `Download Narcoguard for ${platformName}`,
    description: `Download the Narcoguard app for ${platformName} and join our mission to prevent overdose deaths.`,
  }
}

export default async function PlatformDownloadPage({ params }: Props) {
  const { platform } = await params

  // Validate platform
  const validPlatforms = ["ios", "android", "windows", "mac", "linux", "web"]
  if (!validPlatforms.includes(platform)) {
    notFound()
  }

  return <DownloadPage platform={platform} />
}