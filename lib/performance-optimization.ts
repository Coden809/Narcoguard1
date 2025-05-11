/**
 * Performance optimization utilities for Narcoguard application
 * This module provides tools for improving application performance
 */

// Types for performance metrics
export interface PerformanceMetrics {
  // Page load metrics
  timeToFirstByte?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
  timeToInteractive?: number

  // Resource metrics
  resourceCount?: number
  resourceSize?: number
  resourceLoadTime?: number

  // JavaScript metrics
  jsHeapSize?: number
  jsHeapSizeLimit?: number
  jsHeapSizeUsed?: number

  // Custom metrics
  customMetrics?: Record<string, number>
}

// Performance optimization options
export interface PerformanceOptimizationOptions {
  enableImageOptimization?: boolean
  enableCodeSplitting?: boolean
  enableCaching?: boolean
  enablePrefetching?: boolean
  enableLazyLoading?: boolean
  enableResourceHints?: boolean
  enableCompression?: boolean
}

// Default optimization options
const defaultOptimizationOptions: PerformanceOptimizationOptions = {
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enableCaching: true,
  enablePrefetching: true,
  enableLazyLoading: true,
  enableResourceHints: true,
  enableCompression: true,
}

// Default options
const defaultOptions: PerformanceOptimizationOptions = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enableCaching: true,
  enablePrefetching: false,
  // monitorPerformance: true, // Removed as per updates
  // reportPerformanceMetrics: true, // Removed as per updates
  // optimizationLevel: "medium", // Removed as per updates
}

// Performance optimization class
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private options: PerformanceOptimizationOptions
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []
  private reportingInterval: NodeJS.Timeout | null = null
  private initialized = false

  // Singleton pattern
  private constructor(options: PerformanceOptimizationOptions = {}) {
    this.options = { ...defaultOptions, ...options }
  }

  public static getInstance(options?: PerformanceOptimizationOptions): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer(options)
    } else if (options) {
      PerformanceOptimizer.instance.updateOptions(options)
    }
    return PerformanceOptimizer.instance
  }

  // Update options
  public updateOptions(options: Partial<PerformanceOptimizationOptions>): void {
    this.options = { ...this.options, ...options }

    // Re-initialize if already initialized
    if (this.initialized) {
      this.cleanup()
      this.initialize()
    }
  }

  // Initialize performance optimization
  public initialize(): void {
    if (typeof window === "undefined" || this.initialized) return

    this.initialized = true

    // Set up performance monitoring
    // if (this.options.monitorPerformance) { // Removed as per updates
    //   this.setupPerformanceMonitoring() // Removed as per updates
    // } // Removed as per updates

    // Apply optimizations
    this.applyOptimizations()

    // Set up periodic reporting
    // if (this.options.reportPerformanceMetrics) { // Removed as per updates
    //   this.setupPeriodicReporting() // Removed as per updates
    // } // Removed as per updates
  }

  // Clean up resources
  public cleanup(): void {
    // Disconnect all observers
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []

    // Clear reporting interval
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval)
      this.reportingInterval = null
    }

    this.initialized = false
  }

  // Get current performance metrics
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Manually report metrics
  public async reportMetrics(): Promise<void> {
    // if (!this.options.reportPerformanceMetrics) return // Removed as per updates

    try {
      await this.sendMetricsToAnalytics(this.metrics)
    } catch (error) {
      console.error("Failed to report performance metrics:", error)
    }
  }

  // Set up performance monitoring
  private setupPerformanceMonitoring(): void {
    if (typeof window === "undefined" || !window.performance) return

    // Monitor page load metrics
    this.monitorPageLoadMetrics()

    // Monitor resource metrics
    this.monitorResourceMetrics()

    // Monitor memory usage
    this.monitorMemoryUsage()

    // Monitor network requests
    this.monitorNetworkRequests()

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals()
  }

  // Monitor page load metrics
  private monitorPageLoadMetrics(): void {
    if (typeof window === "undefined" || !window.performance || !window.performance.timing) return

    // Calculate basic timing metrics after the page loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        const timing = performance.timing

        this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart
        this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart

        // Report initial metrics
        this.reportMetrics()
      }, 0)
    })
  }

  // Monitor resource metrics
  private monitorResourceMetrics(): void {
    if (typeof window === "undefined" || !window.performance || !window.performance.getEntriesByType) return

    // Get resource entries after the page loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType("resource")

        this.metrics.resourceCount = resources.length
        this.metrics.resourceSize = 0
        this.metrics.resourceLoadTime = 0

        resources.forEach((resource: any) => {
          if (resource.transferSize) {
            this.metrics.resourceSize! += resource.transferSize
          }

          this.metrics.resourceLoadTime! += resource.duration
        })
      }, 0)
    })
  }

  // Monitor memory usage
  private monitorMemoryUsage(): void {
    if (typeof window === "undefined" || !(performance as any).memory) return

    // Check memory usage periodically
    const checkMemory = () => {
      const memory = (performance as any).memory

      this.metrics.jsHeapSize = memory.usedJSHeapSize
      this.metrics.memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    }

    // Check immediately and then periodically
    checkMemory()
    setInterval(checkMemory, 30000) // Every 30 seconds
  }

  // Monitor network requests
  private monitorNetworkRequests(): void {
    if (typeof window === "undefined") return

    // Use a performance observer to monitor network requests
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        this.metrics.networkRequests = (this.metrics.networkRequests || 0) + entries.length
        this.metrics.networkTransferSize = 0
        this.metrics.networkDuration = 0

        entries.forEach((entry: any) => {
          if (entry.transferSize) {
            this.metrics.networkTransferSize! += entry.transferSize
          }

          this.metrics.networkDuration! += entry.duration
        })
      })

      observer.observe({ entryTypes: ["resource"] })
      this.observers.push(observer)
    } catch (error) {
      console.error("Failed to observe network requests:", error)
    }
  }

  // Monitor Core Web Vitals
  private monitorCoreWebVitals(): void {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any

        this.metrics.largestContentfulPaint = lastEntry.startTime
      })

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
      this.observers.push(lcpObserver)
    } catch (error) {
      console.error("Failed to observe LCP:", error)
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstEntry = entries[0] as any

        this.metrics.firstInputDelay = firstEntry.processingStart - firstEntry.startTime
      })

      fidObserver.observe({ type: "first-input", buffered: true })
      this.observers.push(fidObserver)
    } catch (error) {
      console.error("Failed to observe FID:", error)
    }

    // Cumulative Layout Shift
    try {
      let cumulativeLayoutShift = 0

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value
          }
        }

        this.metrics.cumulativeLayoutShift = cumulativeLayoutShift
      })

      clsObserver.observe({ type: "layout-shift", buffered: true })
      this.observers.push(clsObserver)
    } catch (error) {
      console.error("Failed to observe CLS:", error)
    }
  }

  // Apply performance optimizations
  private applyOptimizations(): void {
    if (typeof window === "undefined") return

    // Apply lazy loading for images and iframes
    if (this.options.enableLazyLoading) {
      this.applyLazyLoading()
    }

    // Apply image optimization
    if (this.options.enableImageOptimization) {
      this.applyImageOptimization()
    }

    // Apply caching strategies
    if (this.options.enableCaching) {
      this.applyCachingStrategies()
    }

    // Apply prefetching
    if (this.options.enablePrefetching) {
      this.applyPrefetching()
    }
  }

  // Apply lazy loading
  private applyLazyLoading(): void {
    // Find all images and iframes without loading attribute
    const elements = document.querySelectorAll("img:not([loading]), iframe:not([loading])")

    // Add loading="lazy" attribute
    elements.forEach((element) => {
      element.setAttribute("loading", "lazy")
    })
  }

  // Apply image optimization
  private applyImageOptimization(): void {
    // Find all images
    const images = document.querySelectorAll("img")

    // Add srcset and sizes attributes for responsive images
    images.forEach((image) => {
      // Skip images that already have srcset
      if (image.hasAttribute("srcset")) return

      // Skip SVG images
      if (image.src && image.src.endsWith(".svg")) return

      // Get image dimensions
      const width = image.width
      const height = image.height

      // Skip images without dimensions
      if (!width || !height) return

      // Create srcset attribute
      const src = image.src
      if (!src) return

      // Parse URL to add width parameter
      try {
        const url = new URL(src)

        // Only proceed if it's our own domain or known image service
        if (url.hostname === window.location.hostname || url.hostname.includes("imageservice")) {
          const srcset = [
            `${src} 1x`,
            `${this.addWidthToUrl(src, width * 2)} 2x`,
            `${this.addWidthToUrl(src, width * 3)} 3x`,
          ].join(", ")

          image.setAttribute("srcset", srcset)
        }
      } catch (error) {
        // Invalid URL, skip this image
      }
    })
  }

  // Add width parameter to URL
  private addWidthToUrl(url: string, width: number): string {
    try {
      const parsedUrl = new URL(url)
      parsedUrl.searchParams.set("w", Math.round(width).toString())
      return parsedUrl.toString()
    } catch (error) {
      return url
    }
  }

  // Apply caching strategies
  private applyCachingStrategies(): void {
    // This would typically be handled by a service worker
    // For now, we'll just check if a service worker is registered
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration) {
          console.log("No service worker registered. Caching strategies not applied.")
        }
      })
    }
  }

  // Apply prefetching
  private applyPrefetching(): void {
    // Find all links in the viewport
    const links = document.querySelectorAll("a")

    // Create an intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement
            const href = link.href

            // Skip if already prefetched or if it's an external link
            if (
              !href ||
              link.hasAttribute("data-prefetched") ||
              (href.startsWith("http") && !href.includes(window.location.hostname))
            ) {
              return
            }

            // Create prefetch link
            const prefetch = document.createElement("link")
            prefetch.rel = "prefetch"
            prefetch.href = href
            document.head.appendChild(prefetch)

            // Mark as prefetched
            link.setAttribute("data-prefetched", "true")

            // Stop observing this link
            observer.unobserve(link)
          }
        })
      },
      {
        rootMargin: "200px", // Start prefetching when link is within 200px of viewport
      },
    )

    // Observe all links
    links.forEach((link) => {
      observer.observe(link)
    })
  }

  // Set up periodic reporting
  private setupPeriodicReporting(): void {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval)
    }

    // Report metrics every 5 minutes
    this.reportingInterval = setInterval(
      () => {
        this.reportMetrics()
      },
      5 * 60 * 1000,
    )

    // Also report metrics when the page is about to unload
    window.addEventListener("beforeunload", () => {
      this.reportMetrics()
    })
  }

  // Send metrics to analytics
  private async sendMetricsToAnalytics(metrics: PerformanceMetrics): Promise<void> {
    if (typeof window === "undefined") return

    try {
      // Use sendBeacon for non-blocking requests when available
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          metrics,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        })

        const success = navigator.sendBeacon("/api/metrics", data)

        if (!success) {
          // Fallback to fetch if sendBeacon fails
          throw new Error("sendBeacon failed")
        }
      } else {
        // Use fetch as fallback
        await fetch("/api/metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metrics,
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
          }),
          // Use keepalive for beforeunload events
          keepalive: true,
        })
      }
    } catch (error) {
      console.error("Failed to send performance metrics:", error)
    }
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance()

// Helper function to initialize performance optimization
export function initializePerformanceOptimization(options?: PerformanceOptimizationOptions): void {
  performanceOptimizer.updateOptions(options || {})
  performanceOptimizer.initialize()
}

// Helper function to track a custom metric
export function trackCustomMetric(name: string, value: number): void {
  const metrics = performanceOptimizer.getMetrics()

  if (!metrics.customMetrics) {
    metrics.customMetrics = {}
  }

  metrics.customMetrics[name] = value
}

// Helper function to optimize images on demand
export function optimizeImage(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "webp" | "jpeg" | "png" | "avif"
  } = {},
): string {
  if (!url) return url

  try {
    const parsedUrl = new URL(url)

    // Only optimize images from our domain or known image services
    if (parsedUrl.hostname !== window.location.hostname && !parsedUrl.hostname.includes("imageservice")) {
      return url
    }

    if (options.width) {
      parsedUrl.searchParams.set("w", options.width.toString())
    }

    if (options.height) {
      parsedUrl.searchParams.set("h", options.height.toString())
    }

    if (options.quality) {
      parsedUrl.searchParams.set("q", options.quality.toString())
    }

    if (options.format) {
      parsedUrl.searchParams.set("fm", options.format)
    }

    return parsedUrl.toString()
  } catch (error) {
    return url
  }
}

// Initialize performance monitoring
export function initializePerformanceMonitoring(): void {
  if (typeof window === "undefined") return

  // Track web vitals
  trackWebVitals()

  // Track resource timing
  trackResourceTiming()

  // Track memory usage
  trackMemoryUsage()

  // Track long tasks
  trackLongTasks()
}

// Track Web Vitals
function trackWebVitals(): void {
  if (typeof window === "undefined") return

  // Use web-vitals library to track core metrics
  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  })
}

// Send metrics to analytics
function sendToAnalytics(metric: { name: string; value: number }): void {
  // In a real implementation, this would send metrics to an analytics service
  console.log(`[Performance] ${metric.name}: ${metric.value}`)

  // Example implementation for sending to a backend API
  if (typeof window !== "undefined" && process.env.ANALYTICS_API_URL) {
    const body = {
      metricName: metric.name,
      metricValue: metric.value,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      applicationId: process.env.ANALYTICS_APP_ID || "narcoguard",
      environment: process.env.NODE_ENV || "development",
    }

    // Use sendBeacon for non-blocking requests when available
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${process.env.ANALYTICS_API_URL}/metrics`, JSON.stringify(body))
    } else {
      fetch(`${process.env.ANALYTICS_API_URL}/metrics`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ANALYTICS_API_KEY || ""}`,
        },
        keepalive: true,
      }).catch((error) => console.error("Failed to send metrics:", error))
    }
  }
}

// Track resource timing
function trackResourceTiming(): void {
  if (typeof window === "undefined" || !window.performance || !window.performance.getEntriesByType) return

  // Get resource timing entries
  const resources = window.performance.getEntriesByType("resource")

  // Calculate metrics
  let totalSize = 0
  let totalTime = 0

  resources.forEach((resource: any) => {
    if (resource.transferSize) {
      totalSize += resource.transferSize
    }

    totalTime += resource.duration
  })

  // Send metrics
  sendToAnalytics({
    name: "resource-count",
    value: resources.length,
  })

  sendToAnalytics({
    name: "resource-size",
    value: totalSize,
  })

  sendToAnalytics({
    name: "resource-time",
    value: totalTime,
  })
}

// Track memory usage
function trackMemoryUsage(): void {
  if (typeof window === "undefined" || !(performance as any).memory) return

  const memory = (performance as any).memory

  sendToAnalytics({
    name: "js-heap-size",
    value: memory.totalJSHeapSize,
  })

  sendToAnalytics({
    name: "js-heap-size-used",
    value: memory.usedJSHeapSize,
  })

  sendToAnalytics({
    name: "js-heap-size-limit",
    value: memory.jsHeapSizeLimit,
  })
}

// Track long tasks
function trackLongTasks(): void {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        sendToAnalytics({
          name: "long-task",
          value: entry.duration,
        })
      })
    })

    observer.observe({ entryTypes: ["longtask"] })
  } catch (error) {
    console.error("Error tracking long tasks:", error)
  }
}

// Get current performance metrics
export function getCurrentPerformanceMetrics(): PerformanceMetrics {
  if (typeof window === "undefined") return {}

  const metrics: PerformanceMetrics = {}

  // Navigation timing
  if (performance.timing) {
    const timing = performance.timing

    metrics.timeToFirstByte = timing.responseStart - timing.requestStart
    metrics.timeToInteractive = timing.domInteractive - timing.navigationStart
  }

  // Resource timing
  if (performance.getEntriesByType) {
    const resources = performance.getEntriesByType("resource")

    metrics.resourceCount = resources.length

    let totalSize = 0
    let totalTime = 0

    resources.forEach((resource: any) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize
      }

      totalTime += resource.duration
    })

    metrics.resourceSize = totalSize
    metrics.resourceLoadTime = totalTime
  }

  // Memory usage
  if ((performance as any).memory) {
    const memory = (performance as any).memory

    metrics.jsHeapSize = memory.totalJSHeapSize
    metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit
    metrics.jsHeapSizeUsed = memory.usedJSHeapSize
  }

  return metrics
}

// Apply performance optimizations
export function applyPerformanceOptimizations(
  options: PerformanceOptimizationOptions = defaultOptimizationOptions,
): void {
  const mergedOptions = { ...defaultOptimizationOptions, ...options }

  if (typeof window === "undefined") return

  // Image optimization
  if (mergedOptions.enableImageOptimization) {
    optimizeImages()
  }

  // Resource hints
  if (mergedOptions.enableResourceHints) {
    addResourceHints()
  }

  // Lazy loading
  if (mergedOptions.enableLazyLoading) {
    enableLazyLoading()
  }
}

// Optimize images
function optimizeImages(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return

  // Add loading="lazy" to images
  const images = document.querySelectorAll("img:not([loading])")
  images.forEach((img) => {
    img.setAttribute("loading", "lazy")
  })

  // Add decoding="async" to images
  const imagesWithoutDecoding = document.querySelectorAll("img:not([decoding])")
  imagesWithoutDecoding.forEach((img) => {
    img.setAttribute("decoding", "async")
  })
}

// Add resource hints
function addResourceHints(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return

  // Add preconnect for common domains
  const domains = ["https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"]

  domains.forEach((domain) => {
    if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = domain
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    }
  })
}

// Enable lazy loading
function enableLazyLoading(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return

  // Use Intersection Observer to lazy load elements
  if ("IntersectionObserver" in window) {
    const lazyElements = document.querySelectorAll("[data-lazy]")

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target

          // Handle different element types
          if (element.tagName === "IMG") {
            const img = element as HTMLImageElement
            const src = img.getAttribute("data-src")
            if (src) {
              img.src = src
              img.removeAttribute("data-src")
              img.removeAttribute("data-lazy")
            }
          } else if (element.tagName === "IFRAME") {
            const iframe = element as HTMLIFrameElement
            const src = iframe.getAttribute("data-src")
            if (src) {
              iframe.src = src
              iframe.removeAttribute("data-src")
              iframe.removeAttribute("data-lazy")
            }
          } else {
            // For other elements, load their content
            const content = element.getAttribute("data-content")
            if (content) {
              element.innerHTML = content
              element.removeAttribute("data-content")
              element.removeAttribute("data-lazy")
            }
          }

          observer.unobserve(element)
        }
      })
    })

    lazyElements.forEach((element) => {
      observer.observe(element)
    })
  }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Memoize function for performance optimization
export function memoize<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>()

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)

    return result
  }
}

// Optimize rendering with requestAnimationFrame
export function optimizeRendering<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>): void => {
    requestAnimationFrame(() => {
      func(...args)
    })
  }
}

// Batch DOM updates for performance
export function batchDOMUpdates<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>): void => {
    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(() => {
      // Use a document fragment to batch DOM operations
      const fragment = document.createDocumentFragment()

      // Call the original function with the fragment
      func(...args, fragment)

      // Append the fragment to the DOM (single reflow/repaint)
      document.body.appendChild(fragment)
    })
  }
}
