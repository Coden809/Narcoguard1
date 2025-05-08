"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-8">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>

      <h1 className="text-3xl font-bold mb-4">You're offline</h1>

      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        It looks like you've lost your internet connection. Narcoguard can still provide emergency guidance in offline
        mode, but some features may be limited.
      </p>

      <div className="grid gap-4">
        <Button onClick={() => window.location.reload()} className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>

        <Link href="/" passHref>
          <Button variant="outline" className="flex items-center">
            Go to home page
          </Button>
        </Link>
      </div>

      <div className="mt-12 p-4 bg-muted rounded-lg max-w-md">
        <h2 className="text-lg font-semibold mb-2">Offline Emergency Resources</h2>
        <p className="text-sm text-muted-foreground">
          Basic emergency guidance is available offline. If you're experiencing an emergency, call 911 immediately.
        </p>
      </div>
    </div>
  )
}
