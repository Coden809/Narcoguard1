import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { EmergencyFAB } from "@/components/emergency-fab"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata in the layout to include the new branding
export const metadata = {
  title: {
    default: "Narcoguard - Overdose Prevention App",
    template: "%s | Narcoguard",
  },
  description:
    "Narcoguard helps prevent drug overdoses by monitoring vital signs and alerting emergency contacts when needed.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
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
    maximumScale: 1,
    userScalable: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "ocean", "forest", "sunset", "custom"]}
        >
          {children}
          <EmergencyFAB />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
