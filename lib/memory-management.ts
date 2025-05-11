/**
 * Memory management utilities for the Narcoguard application
 */

// Types for memory usage monitoring
interface MemoryStats {
  totalJSHeapSize?: number
  usedJSHeapSize?: number
  jsHeapSizeLimit?: number
  usagePercentage?: number
  timestamp: number
}

// Options for memory monitoring
interface MemoryMonitorOptions {
  warningThreshold?: number // Percentage (0-100)
  criticalThreshold?: number // Percentage (0-100)
  samplingInterval?: number // Milliseconds
  maxHistorySize?: number // Number of samples to keep
  onWarning?: (stats: MemoryStats) => void
  onCritical?: (stats: MemoryStats) => void
  onImprovement?: (stats: MemoryStats) => void
}

// Global memory history
const memoryHistory: MemoryStats[] = []
let isWarningState = false

/**
 * Get current memory usage statistics
 * @returns Memory stats object or null if not available
 */
export function getMemoryStats(): MemoryStats | null {
  if (typeof window === "undefined" || !(performance as any).memory) {
    return null
  }

  try {
    const memory = (performance as any).memory

    return {
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("Error getting memory stats:", error)
    return null
  }
}

/**
 * Start monitoring memory usage
 * @param options Configuration options
 * @returns Function to stop monitoring
 */
export function startMemoryMonitoring(options: MemoryMonitorOptions = {}): () => void {
  const {
    warningThreshold = 80, // 80% memory usage is concerning
    criticalThreshold = 90, // 90% memory usage is critical
    samplingInterval = 10000, // Check every 10 seconds
    maxHistorySize = 60, // Keep 10 minutes of history at 10s intervals
    onWarning,
    onCritical,
    onImprovement,
  } = options

  let intervalId: ReturnType<typeof setInterval> | null = null

  // Don't run in SSR
  if (typeof window === "undefined") {
    return () => {}
  }

  // Check if memory API is available
  if (!(performance as any).memory) {
    console.warn("Memory API not available - monitoring disabled")
    return () => {}
  }

  const checkMemory = () => {
    const stats = getMemoryStats()
    if (!stats) return

    // Add to history
    memoryHistory.push(stats)

    // Trim history if needed
    if (memoryHistory.length > maxHistorySize) {
      memoryHistory.shift()
    }

    // Check thresholds
    if (stats.usagePercentage && stats.usagePercentage > criticalThreshold) {
      console.warn(`Critical memory usage: ${stats.usagePercentage.toFixed(1)}%`)
      isWarningState = true
      onCritical?.(stats)

      // Force garbage collection if possible (Safari)
      if (typeof window.gc === "function") {
        try {
          window.gc()
        } catch (e) {
          console.error("Failed to force garbage collection", e)
        }
      }

      // Attempt to free memory by clearing non-essential caches
      try {
        // Clear any image caches
        const images = document.querySelectorAll("img[data-src]")
        images.forEach((img) => {
          // Remove from cache if not in viewport
          if (!isElementInViewport(img)) {
            ;(img as HTMLImageElement).src =
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // 1px transparent gif
          }
        })

        // Clear console in development
        if (process.env.NODE_ENV !== "production") {
          console.clear()
        }
      } catch (e) {
        console.error("Error attempting to free memory", e)
      }
    } else if (stats.usagePercentage && stats.usagePercentage > warningThreshold) {
      console.warn(`High memory usage: ${stats.usagePercentage.toFixed(1)}%`)
      isWarningState = true
      onWarning?.(stats)
    } else if (isWarningState && stats.usagePercentage && stats.usagePercentage < warningThreshold - 10) {
      // Memory usage has improved significantly
      console.log(`Memory usage improved: ${stats.usagePercentage.toFixed(1)}%`)
      isWarningState = false
      onImprovement?.(stats)
    }
  }

  // Run an initial check
  checkMemory()

  // Set up interval
  intervalId = setInterval(checkMemory, samplingInterval)

  // Return function to stop monitoring
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  }
}

/**
 * Get memory usage trend (increasing, decreasing, stable)
 * @param samples Number of samples to consider for trend
 * @returns Trend info or null if not enough data
 */
export function getMemoryTrend(samples = 5): {
  trend: "increasing" | "decreasing" | "stable"
  percentage: number
} | null {
  if (memoryHistory.length < samples) {
    return null
  }

  const recentSamples = memoryHistory.slice(-samples)
  const firstUsage = recentSamples[0].usagePercentage
  const lastUsage = recentSamples[recentSamples.length - 1].usagePercentage

  if (!firstUsage || !lastUsage) {
    return null
  }

  const difference = lastUsage - firstUsage
  const percentageChange = (difference / firstUsage) * 100

  if (Math.abs(percentageChange) < 5) {
    return { trend: "stable", percentage: percentageChange }
  }

  return {
    trend: difference > 0 ? "increasing" : "decreasing",
    percentage: Math.abs(percentageChange),
  }
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
