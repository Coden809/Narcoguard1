"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // This is where you would typically send analytics data
      // For example, using Google Analytics, Plausible, or a custom solution
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

      // Example of how you might track page views
      console.log(`Page view: ${url}`)

      // You could call your analytics service here
      // Example: sendAnalytics({ type: 'pageview', url })
    }
  }, [pathname, searchParams])

  return null
}
