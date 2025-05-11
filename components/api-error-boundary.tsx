"use client"

import React from "react"
import ErrorBoundary from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react"

interface ApiErrorBoundaryProps {
  children: React.ReactNode
  apiName: string
  className?: string
  retryAction?: () => Promise<void>
}

export function ApiErrorBoundary({ children, apiName, className, retryAction }: ApiErrorBoundaryProps) {
  const [key, setKey] = React.useState(0)
  const [isOnline, setIsOnline] = React.useState(true)
  const [isRetrying, setIsRetrying] = React.useState(false)

  React.useEffect(() => {
    // Check if we're online
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleReset = async () => {
    if (retryAction) {
      setIsRetrying(true)
      try {
        await retryAction()
      } catch (error) {
        console.error("Retry action failed:", error)
      } finally {
        setIsRetrying(false)
      }
    }

    setKey((prevKey) => prevKey + 1)
  }

  const fallback = (
    <div className={`p-4 rounded-lg border border-destructive/20 bg-destructive/5 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center p-4 space-y-3">
        {isOnline ? (
          <AlertTriangle className="h-8 w-8 text-destructive" />
        ) : (
          <WifiOff className="h-8 w-8 text-destructive" />
        )}

        <h3 className="text-base font-medium">{isOnline ? `Error connecting to ${apiName}` : "You're offline"}</h3>

        <p className="text-sm text-muted-foreground">
          {isOnline
            ? `We couldn't connect to the ${apiName} service. This might be a temporary issue.`
            : "Please check your internet connection and try again."}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isRetrying}
          className="flex items-center gap-1"
        >
          {isRetrying ? (
            <>
              <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1" />
              <span>Retrying...</span>
            </>
          ) : (
            <>
              {isOnline ? <RefreshCw className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
              <span>Try Again</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary key={key} fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}
