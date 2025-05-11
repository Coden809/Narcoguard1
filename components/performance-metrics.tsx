"use client"

import { useEffect } from "react"
import { reportPerformanceMetrics } from "@/lib/performance-monitoring"

export default function PerformanceMetrics() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return

    // Set up Core Web Vitals reporting
    const setupWebVitalsReporting = async () => {
      try {
        const { onCLS, onFID, onLCP } = await import("web-vitals")

        const reportWebVital = ({ name, value, id }) => {
          // Log to console in development
          if (process.env.NODE_ENV === "development") {
            console.log(`Web Vital: ${name}`, value)
          }

          // Send to analytics endpoint
          reportPerformanceMetrics(
            {
              name,
              value,
              id,
              path: window.location.pathname,
            },
            "/api/metrics",
          )
        }

        // Register metrics
        onCLS(reportWebVital)
        onFID(reportWebVital)
        onLCP(reportWebVital)
      } catch (error) {
        console.error("Failed to load web-vitals:", error)
      }
    }

    setupWebVitalsReporting()

    // Register performance observer for additional metrics
    if ("PerformanceObserver" in window) {
      try {
        // Resource timing
        const resourceObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          // Only report significant resources (e.g., large images, scripts, etc.)
          const significantEntries = entries
            .filter(
              (entry) =>
                entry.duration > 100 || // Long loading resources
                entry.initiatorType === "script" ||
                entry.initiatorType === "css",
            )
            .slice(0, 5) // Limit to 5 entries per batch

          if (significantEntries.length > 0) {
            reportPerformanceMetrics({
              type: "resource-timing",
              resources: significantEntries.map((entry) => ({
                name: entry.name.split("/").pop(),
                duration: entry.duration,
                size: entry.transferSize || 0,
                type: entry.initiatorType,
              })),
            })
          }
        })

        resourceObserver.observe({ type: "resource", buffered: true })

        return () => {
          resourceObserver.disconnect()
        }
      } catch (error) {
        console.error("Performance observer error:", error)
      }
    }
  }, [])

  return null
}
