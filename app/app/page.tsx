"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function WebAppPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setInstallPrompt(e)
    })

    // Listen for the appinstalled event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    })

    // Verify token if present
    if (token) {
      // For demo purposes, we'll just set isValid to true
      setIsValid(true)
      setIsVerifying(false)
    } else {
      // No token, but we'll still show the web app
      setIsVerifying(false)
      setIsValid(true)
    }
  }, [searchParams])

  const handleInstall = () => {
    if (installPrompt) {
      // Show the install prompt
      installPrompt.prompt()

      // Wait for the user to respond to the prompt
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt")
        } else {
          console.log("User dismissed the install prompt")
        }
        // Clear the saved prompt
        setInstallPrompt(null)
      })
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Narcoguard Web App</CardTitle>
            <CardDescription>Please wait while we verify your access...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>Your access token is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To access the Narcoguard Web App, please request a new download link from the main website.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Web App Header */}
      <Navbar />

      {/* Web App Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Welcome to Narcoguard Web App
              </CardTitle>
              <CardDescription>You now have access to the full Narcoguard experience in your browser.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Narcoguard Web App provides all the features of our native applications, right in your browser. No
                installation required, though we recommend installing it as a Progressive Web App for the best
                experience.
              </p>

              {!isInstalled && installPrompt && (
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-500">
                  <AlertTitle className="text-blue-700 dark:text-blue-300">Install for better experience</AlertTitle>
                  <AlertDescription>
                    Install Narcoguard as an app on your device for faster access and offline capabilities.
                    <Button
                      onClick={handleInstall}
                      variant="outline"
                      className="mt-2 border-blue-500 text-blue-700 dark:text-blue-300"
                    >
                      Install Now
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {isInstalled && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500">
                  <AlertTitle className="text-green-700 dark:text-green-300">App Installed</AlertTitle>
                  <AlertDescription>
                    Narcoguard is installed on your device. You can now access it from your home screen or app drawer.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Continue to Dashboard
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Real-time vital sign monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Automatic overdose detection
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Emergency contact notification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    GPS location sharing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Hero Network community response
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Set up your emergency contacts</li>
                  <li>Connect your wearable devices</li>
                  <li>Configure your notification preferences</li>
                  <li>Complete the naloxone tutorial</li>
                  <li>Activate Hero Mode if desired</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Web App Footer */}
      <Footer />
    </div>
  )
}
