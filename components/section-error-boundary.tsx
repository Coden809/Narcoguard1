"use client"

import React from "react"
import ErrorBoundary from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface SectionErrorBoundaryProps {
  children: React.ReactNode
  name: string
  className?: string
}

export function SectionErrorBoundary({ children, name, className }: SectionErrorBoundaryProps) {
  const [key, setKey] = React.useState(0)

  const handleReset = () => {
    setKey((prevKey) => prevKey + 1)
  }

  const fallback = (
    <div className={`p-4 rounded-lg border border-destructive/20 bg-destructive/5 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center p-4 space-y-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h3 className="text-base font-medium">Error in {name}</h3>
        <p className="text-sm text-muted-foreground">This section encountered an error and couldn't be displayed.</p>
        <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          <span>Reload Section</span>
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
