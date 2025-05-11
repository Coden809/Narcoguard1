/**
 * Analytics service for Narcoguard application
 * This module provides comprehensive analytics tracking and reporting
 */

// Define analytics event types
export enum AnalyticsEventType {
  PAGE_VIEW = "page_view",
  FEATURE_USAGE = "feature_usage",
  ERROR = "error",
  EMERGENCY = "emergency",
  USER_ENGAGEMENT = "user_engagement",
  PERFORMANCE = "performance",
  DOWNLOAD = "download",
  REGISTRATION = "registration",
  LOGIN = "login",
  DONATION = "donation",
}

// Base analytics event interface
export interface AnalyticsEvent {
  eventType: AnalyticsEventType
  timestamp: Date
  userId?: string
  sessionId?: string
  properties?: Record<string, any>
}

// Specific event types
export interface PageViewEvent extends AnalyticsEvent {
  eventType: AnalyticsEventType.PAGE_VIEW
  properties: {
    path: string
    referrer?: string
    title?: string
    loadTime?: number
  }
}

export interface FeatureUsageEvent extends AnalyticsEvent {
  eventType: AnalyticsEventType.FEATURE_USAGE
  properties: {
    featureName: string
    action: string
    duration?: number
    successful?: boolean
  }
}

export interface ErrorEvent extends AnalyticsEvent {
  eventType: AnalyticsEventType.ERROR
  properties: {
    errorCode: string
    errorMessage: string
    errorStack?: string
    component?: string
    action?: string
  }
}

export interface EmergencyEvent extends AnalyticsEvent {
  eventType: AnalyticsEventType.EMERGENCY
  properties: {
    emergencyType: string
    status: string
    responseTime?: number
    location?: {
      latitude?: number
      longitude?: number
    }
  }
}

export interface PerformanceEvent extends AnalyticsEvent {
  eventType: AnalyticsEventType.PERFORMANCE
  properties: {
    metricName: string
    value: number
    component?: string
  }
}

// Analytics service class
export class AnalyticsService {
  private static instance: AnalyticsService
  private initialized = false
  private userId?: string
  private sessionId: string
  private eventQueue: AnalyticsEvent[] = []
  private flushInterval?: NodeJS.Timeout
  private isFlushingQueue = false
  private debugMode = false

  // Singleton pattern
  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // Initialize the analytics service
  public initialize(
    options: {
      userId?: string
      debug?: boolean
      flushIntervalMs?: number
    } = {},
  ): void {
    if (this.initialized) return

    this.userId = options.userId
    this.debugMode = options.debug || false

    // Set up automatic queue flushing
    const flushIntervalMs = options.flushIntervalMs || 30000 // Default: 30 seconds
    this.flushInterval = setInterval(() => this.flushQueue(), flushIntervalMs)

    // Set up event listeners
    if (typeof window !== "undefined") {
      // Track page views
      this.trackPageView()

      // Track page visibility changes
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          // Flush queue when page becomes hidden
          this.flushQueue()
        } else {
          // Track page view when page becomes visible again
          this.trackPageView()
        }
      })

      // Flush queue before page unload
      window.addEventListener("beforeunload", () => {
        this.flushQueue(true) // Synchronous flush
      })

      // Track performance metrics
      this.trackPerformanceMetrics()
    }

    this.initialized = true
    this.debug("Analytics service initialized")
  }

  // Set user ID
  public setUserId(userId: string): void {
    this.userId = userId
    this.debug(`User ID set: ${userId}`)
  }

  // Clear user ID (e.g., on logout)
  public clearUserId(): void {
    this.userId = undefined
    this.debug("User ID cleared")
  }

  // Track a generic event
  public trackEvent(event: Omit<AnalyticsEvent, "timestamp" | "sessionId">): void {
    if (!this.initialized) {
      this.initialize()
    }

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: event.userId || this.userId,
    }

    this.eventQueue.push(fullEvent)
    this.debug(`Event tracked: ${event.eventType}`, event.properties)

    // Flush queue if it gets too large
    if (this.eventQueue.length >= 20) {
      this.flushQueue()
    }
  }

  // Track page view
  public trackPageView(properties?: Partial<PageViewEvent["properties"]>): void {
    if (typeof window === "undefined") return

    const path = window.location.pathname + window.location.search
    const referrer = document.referrer
    const title = document.title

    this.trackEvent({
      eventType: AnalyticsEventType.PAGE_VIEW,
      properties: {
        path,
        referrer,
        title,
        ...properties,
      },
    })
  }

  // Track feature usage
  public trackFeatureUsage(
    featureName: string,
    action: string,
    properties?: Partial<Omit<FeatureUsageEvent["properties"], "featureName" | "action">>,
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.FEATURE_USAGE,
      properties: {
        featureName,
        action,
        ...properties,
      },
    })
  }

  // Track error
  public trackError(
    errorCode: string,
    errorMessage: string,
    properties?: Partial<Omit<ErrorEvent["properties"], "errorCode" | "errorMessage">>,
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.ERROR,
      properties: {
        errorCode,
        errorMessage,
        ...properties,
      },
    })
  }

  // Track emergency
  public trackEmergency(
    emergencyType: string,
    status: string,
    properties?: Partial<Omit<EmergencyEvent["properties"], "emergencyType" | "status">>,
  ): void {
    this.trackEvent({
      eventType: AnalyticsEventType.EMERGENCY,
      properties: {
        emergencyType,
        status,
        ...properties,
      },
    })
  }

  // Track performance metric
  public trackPerformanceMetric(metricName: string, value: number, component?: string): void {
    this.trackEvent({
      eventType: AnalyticsEventType.PERFORMANCE,
      properties: {
        metricName,
        value,
        component,
      },
    })
  }

  // Flush the event queue
  public async flushQueue(synchronous = false): Promise<void> {
    if (this.eventQueue.length === 0 || this.isFlushingQueue) return

    this.isFlushingQueue = true
    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      this.debug(`Flushing ${events.length} events`)

      if (typeof window === "undefined") {
        // Server-side analytics
        // In a real implementation, this would use a server-side analytics client
        this.debug("Server-side analytics not implemented")
        return
      }

      // Use sendBeacon for non-blocking requests when available
      if (!synchronous && navigator.sendBeacon) {
        const success = navigator.sendBeacon("/api/analytics/batch", JSON.stringify({ events }))

        if (!success) {
          // Fallback to fetch if sendBeacon fails
          throw new Error("sendBeacon failed")
        }
      } else {
        // Use fetch for synchronous requests or when sendBeacon is not available
        await fetch("/api/analytics/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events }),
          // Use keepalive for beforeunload events
          keepalive: synchronous,
        })
      }
    } catch (error) {
      // If sending fails, add events back to the queue
      this.eventQueue = [...events, ...this.eventQueue]
      this.debug("Failed to send analytics events", error)
    } finally {
      this.isFlushingQueue = false
    }
  }

  // Clean up resources
  public dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }

    // Flush any remaining events
    this.flushQueue(true)

    this.initialized = false
    this.debug("Analytics service disposed")
  }

  // Generate a unique session ID
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Track performance metrics
  private trackPerformanceMetrics(): void {
    if (typeof window === "undefined" || !window.performance) return

    // Track navigation timing
    if (performance.timing) {
      const timing = performance.timing

      // Wait for the page to load completely
      window.addEventListener("load", () => {
        // Calculate timing metrics
        setTimeout(() => {
          const loadTime = timing.loadEventEnd - timing.navigationStart
          const dnsTime = timing.domainLookupEnd - timing.domainLookupStart
          const tcpTime = timing.connectEnd - timing.connectStart
          const ttfb = timing.responseStart - timing.requestStart
          const domTime = timing.domComplete - timing.domLoading

          // Track page load time
          this.trackPerformanceMetric("page_load_time", loadTime)
          this.trackPerformanceMetric("dns_time", dnsTime)
          this.trackPerformanceMetric("tcp_time", tcpTime)
          this.trackPerformanceMetric("ttfb", ttfb)
          this.trackPerformanceMetric("dom_time", domTime)
        }, 0)
      })
    }

    // Track resource timing
    if (performance.getEntriesByType) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const resources = performance.getEntriesByType("resource")

          // Calculate total resource size and time
          let totalSize = 0
          let totalTime = 0

          resources.forEach((resource: any) => {
            if (resource.transferSize) {
              totalSize += resource.transferSize
            }

            totalTime += resource.duration
          })

          this.trackPerformanceMetric("resource_count", resources.length)
          this.trackPerformanceMetric("resource_size", totalSize)
          this.trackPerformanceMetric("resource_time", totalTime)
        }, 0)
      })
    }

    // Track Core Web Vitals if available
    if ("PerformanceObserver" in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1] as any

          this.trackPerformanceMetric("largest_contentful_paint", lastEntry.startTime)
        })

        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const firstEntry = entries[0] as any

          this.trackPerformanceMetric("first_input_delay", firstEntry.processingStart - firstEntry.startTime)
        })

        fidObserver.observe({ type: "first-input", buffered: true })

        // Cumulative Layout Shift
        let cumulativeLayoutShift = 0

        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShift += entry.value
            }
          }

          this.trackPerformanceMetric("cumulative_layout_shift", cumulativeLayoutShift)
        })

        clsObserver.observe({ type: "layout-shift", buffered: true })
      } catch (error) {
        this.debug("Error setting up performance observers", error)
      }
    }
  }

  // Debug logging
  private debug(message: string, data?: any): void {
    if (!this.debugMode) return

    if (data) {
      console.log(`[Analytics] ${message}`, data)
    } else {
      console.log(`[Analytics] ${message}`)
    }
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance()
