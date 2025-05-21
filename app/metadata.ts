import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Narcoguard - Overdose Prevention App",
    template: "%s | Narcoguard",
  },
  description:
    "Narcoguard helps prevent drug overdoses by monitoring vital signs and alerting emergency contacts when needed.",
  manifest: "/manifest.json",
  applicationName: "Narcoguard",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Narcoguard",
  },
  formatDetection: {
    telephone: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1F2937" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  generator: "v0.dev",
}
