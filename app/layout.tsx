import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import EmergencyFAB from "@/components/EmergencyFAB"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import Script from "next/script"
import { applyPolyfills, provideFallbacks } from "@/lib/browser-compatibility"
import AccessibilityControls from "@/components/accessibility-controls"

const inter = Inter({ subsets: ["latin"], display: "swap" })

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
    maximumScale: 5,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Add preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Add browser compatibility script */}
        <Script id="browser-compatibility" strategy="beforeInteractive">
          {`
            (function() {
              // Apply polyfills
              ${applyPolyfills.toString()}
              // Provide fallbacks
              ${provideFallbacks.toString()}
              
              // Execute
              applyPolyfills();
              provideFallbacks();
            })();
          `}
        </Script>

        {/* Performance monitoring */}
        <Script id="performance-monitoring" strategy="afterInteractive">
          {`
            // Initialize performance monitoring
            if (typeof window !== 'undefined') {
              // Create performance observer
              if (typeof PerformanceObserver !== 'undefined') {
                try {
                  // Create performance observer for core web vitals
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                      // Report to analytics
                      if (entry.entryType === 'largest-contentful-paint' ||
                          entry.entryType === 'first-input' ||
                          entry.entryType === 'layout-shift') {
                        console.log('Performance metric:', entry.entryType, entry);
                      }
                    });
                  });
                  
                  // Observe different types of performance entries
                  observer.observe({ 
                    entryTypes: ['resource', 'navigation', 'longtask', 'paint', 'layout-shift', 'largest-contentful-paint', 'first-input'] 
                  });
                } catch (e) {
                  console.error('Performance observer error:', e);
                }
              }
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "ocean", "forest", "sunset", "custom"]}
          disableTransitionOnChange={false}
        >
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <main id="main-content">{children}</main>
            <EmergencyFAB />
            <AccessibilityControls />
          </Suspense>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
