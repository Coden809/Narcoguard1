"use client"

import type React from "react"
import ErrorBoundary from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

interface RootErrorBoundaryProps {
  children: React.ReactNode
}

export function RootErrorBoundary({ children }: RootErrorBoundaryProps) {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const fallback = (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full p-6 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-base text-destructive/80 mb-6">
            We're sorry, but we encountered an unexpected error. Please try refreshing the page or return to the home
            page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={handleReload} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Page</span>
            </Button>
            <Button variant="default" onClick={handleGoHome} className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Go to Home</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}
