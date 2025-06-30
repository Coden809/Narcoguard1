import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import EmergencyFAB from "@/components/EmergencyFAB"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import Script from "next/script"
import { getBrowserCompatibilityScript } from "@/lib/browser-compatibility"
import AccessibilityControls from "@/components/accessibility-controls"
import { RootErrorBoundary } from "@/components/root-error-boundary"
import { initializeAccessibility } from "@/lib/accessibility"

const inter = Inter({ subsets: ["latin"], display: "swap" })

// Minimal metadata without favicon references
export const metadata = {
  title: {
    default: "Narcoguard - Overdose Prevention App",
    template: "%s | Narcoguard",
  },
  description:
    "Narcoguard helps prevent drug overdoses by monitoring vital signs and alerting emergency contacts when needed.",
  applicationName: "Narcoguard",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Explicit favicon links */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Meta tags */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="application-name" content="Narcoguard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Narcoguard" />
        <meta name="format-detection" content="telephone=yes" />

        {/* Add preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Add browser compatibility script with enhanced version */}
        <Script id="browser-compatibility" strategy="beforeInteractive">
          {getBrowserCompatibilityScript()}
        </Script>

        {/* Initialize accessibility features */}
        <Script id="accessibility-init" strategy="afterInteractive">
          {`
            (function() {
              // Initialize accessibility features
              ${initializeAccessibility.toString()}
              
              // Execute
              if (typeof window !== 'undefined') {
                window.addEventListener('DOMContentLoaded', function() {
                  initializeAccessibility();
                });
              }
            })();
          `}
        </Script>

        {/* Optimize performance monitoring script */}
        <Script id="performance-monitoring" strategy="afterInteractive">
          {`
            // Initialize performance monitoring with batching
            if (typeof window !== 'undefined' && window.performance) {
              // Create performance data batch for more efficient reporting
              let perfEntries = [];
              let reportingTimeout = null;
              
              const batchReportMetrics = () => {
                if (perfEntries.length === 0) return;
                
                const batchData = {
                  entries: perfEntries.slice(0, 50), // Limit batch size
                  url: window.location.pathname,
                  timestamp: Date.now()
                };
                
                // Use sendBeacon for non-blocking reporting when available
                if (navigator.sendBeacon) {
                  navigator.sendBeacon('/api/metrics/batch', JSON.stringify(batchData));
                } else {
                  fetch('/api/metrics/batch', {
                    method: 'POST',
                    body: JSON.stringify(batchData),
                    keepalive: true
                  }).catch(e => console.error('Failed to report metrics:', e));
                }
                
                // Clear the batch
                perfEntries = [];
              };
              
              // Set up batched reporting
              const scheduleBatchReport = () => {
                if (reportingTimeout) clearTimeout(reportingTimeout);
                reportingTimeout = setTimeout(batchReportMetrics, 5000); // Report every 5 seconds
              };
              
              // Create performance observer
              if (typeof PerformanceObserver !== 'undefined') {
                try {
                  // Create performance observer for core web vitals
                  const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    
                    // Add to batch and schedule reporting
                    if (entries.length > 0) {
                      perfEntries.push(...entries.map(entry => ({
                        type: entry.entryType,
                        name: entry.name,
                        duration: entry.duration || 0,
                        startTime: entry.startTime || 0,
                        id: entry.id || undefined
                      })));
                      
                      scheduleBatchReport();
                    }
                  });
                  
                  // Observe different types of performance entries
                  observer.observe({ 
                    entryTypes: ['resource', 'navigation', 'longtask', 'paint', 'layout-shift', 'largest-contentful-paint', 'first-input'] 
                  });
                  
                  // Report before page unload
                  window.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') {
                      batchReportMetrics();
                    }
                  });
                  
                  window.addEventListener('pagehide', batchReportMetrics);
                  
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

        <RootErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={["light", "dark", "ocean", "forest", "sunset", "sky", "cosmic", "electric", "coffee", "custom"]}
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
        </RootErrorBoundary>
      </body>
    </html>
  )
}