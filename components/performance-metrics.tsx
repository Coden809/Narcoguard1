"use client"

import { useEffect } from "react"

export default function PerformanceMetrics() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return

    // Report Web Vitals
    const reportWebVitals = async (metric) => {
      const { name, value, id } = metric

      // Log to console in development
      console.log(`Web Vital: ${name}`, value)

      // In production, send to analytics
      try {
        await fetch("/api/metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, value, id }),
        })
      } catch (error) {
        console.error("Failed to report web vital:", error)
      }
    }

    // Register performance observer
    if ("PerformanceObserver" in window) {
      // Core Web Vitals
      const coreWebVitalsObserver = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          // @ts-ignore - LCP, FID, and CLS are not in the PerformanceEntry type
          const metric = { name: entry.name, value: entry.value, id: entry.id }
          reportWebVitals(metric)
        })
      })

      coreWebVitalsObserver.observe({ type: "largest-contentful-paint", buffered: true })
      coreWebVitalsObserver.observe({ type: "first-input", buffered: true })
      coreWebVitalsObserver.observe({ type: "layout-shift", buffered: true })

      // Navigation timing
      const navigationObserver = new PerformanceObserver((entryList) => {
        const navigationEntry = entryList.getEntriesByType("navigation")[0]
        if (navigationEntry) {
          // @ts-ignore - navigationEntry properties
          const loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime
          reportWebVitals({ name: "page-load", value: loadTime, id: "nav-timing" })
        }
      })

      navigationObserver.observe({ type: "navigation", buffered: true })
    }
  }, [])

  return null
}
