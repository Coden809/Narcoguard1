/**
 * Performance monitoring utilities for Narcoguard application
 */

// Web Vitals
type WebVitalMetric = {
  id: string
  name: string
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
}

// Performance observer
export function setupPerformanceObserver(callback: (entries: PerformanceEntry[]) => void): void {
  if (typeof PerformanceObserver === "undefined") return

  try {
    // Create performance observer
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries())
    })

    // Observe different types of performance entries
    observer.observe({ entryTypes: ["resource", "navigation", "longtask", "paint", "layout-shift"] })

    return () => {
      observer.disconnect()
    }
  } catch (error) {
    console.error("Error setting up performance observer:", error)
  }
}

// Track Core Web Vitals
export function trackWebVitals(onPerfEntry: (metric: WebVitalMetric) => void): void {
  if (typeof window !== "undefined" && onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        const rating = metric.value <= 0.1 ? "good" : metric.value <= 0.25 ? "needs-improvement" : "poor"
        onPerfEntry({ ...metric, name: "CLS", rating, delta: metric.delta })
      })
      getFID((metric) => {
        const rating = metric.value <= 100 ? "good" : metric.value <= 300 ? "needs-improvement" : "poor"
        onPerfEntry({ ...metric, name: "FID", rating, delta: metric.delta })
      })
      getFCP((metric) => {
        const rating = metric.value <= 1800 ? "good" : metric.value <= 3000 ? "needs-improvement" : "poor"
        onPerfEntry({ ...metric, name: "FCP", rating, delta: metric.delta })
      })
      getLCP((metric) => {
        const rating = metric.value <= 2500 ? "good" : metric.value <= 4000 ? "needs-improvement" : "poor"
        onPerfEntry({ ...metric, name: "LCP", rating, delta: metric.delta })
      })
      getTTFB((metric) => {
        const rating = metric.value <= 800 ? "good" : metric.value <= 1800 ? "needs-improvement" : "poor"
        onPerfEntry({ ...metric, name: "TTFB", rating, delta: metric.delta })
      })
    })
  }
}

// Track resource loading performance
export function trackResourcePerformance(): Record<string, number> {
  if (typeof window === "undefined" || !window.performance || !window.performance.getEntriesByType) {
    return {}
  }

  const resources = window.performance.getEntriesByType("resource")
  const performanceMetrics: Record<string, number> = {
    totalResources: resources.length,
    totalResourceSize: 0,
    totalResourceTime: 0,
    slowestResource: 0,
    largestResource: 0,
  }

  resources.forEach((resource) => {
    const resourceTime = resource.responseEnd - resource.startTime
    performanceMetrics.totalResourceTime += resourceTime

    if (resourceTime > performanceMetrics.slowestResource) {
      performanceMetrics.slowestResource = resourceTime
    }

    // Check if transferSize is available
    if ("transferSize" in resource) {
      const resourceSize = (resource as any).transferSize || 0
      performanceMetrics.totalResourceSize += resourceSize

      if (resourceSize > performanceMetrics.largestResource) {
        performanceMetrics.largestResource = resourceSize
      }
    }
  })

  return performanceMetrics
}

// Memory usage monitoring
export function trackMemoryUsage(): Record<string, number> | null {
  if (typeof window === "undefined" || !(performance as any).memory) {
    return null
  }

  const memory = (performance as any).memory
  return {
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}

// Track long tasks
export function trackLongTasks(threshold = 50): void {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return
  }

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > threshold) {
          console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`, entry)
        }
      })
    })

    observer.observe({ entryTypes: ["longtask"] })

    return () => {
      observer.disconnect()
    }
  } catch (error) {
    console.error("Error tracking long tasks:", error)
  }
}

// Send performance metrics to analytics
export async function reportPerformanceMetrics(metrics: Record<string, any>, endpoint = "/api/metrics"): Promise<void> {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: Date.now(),
        metrics,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    })
  } catch (error) {
    console.error("Error reporting performance metrics:", error)
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
  if (typeof window === "undefined") return

  // Track web vitals
  trackWebVitals((metric) => {
    console.log(`Web Vital: ${metric.name} - ${metric.value} (${metric.rating})`)
    reportPerformanceMetrics({ webVitals: { [metric.name]: metric } })
  })

  // Track long tasks
  trackLongTasks()

  // Track resource performance periodically
  setInterval(() => {
    const resourceMetrics = trackResourcePerformance()
    const memoryMetrics = trackMemoryUsage()

    reportPerformanceMetrics({
      resources: resourceMetrics,
      memory: memoryMetrics,
    })
  }, 60000) // Every minute
}
