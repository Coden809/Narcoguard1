"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Download,
  AlertCircle,
  Smartphone,
  Laptop,
  Apple,
  ComputerIcon as Windows,
  SmartphoneIcon as Android,
} from "lucide-react"
import { SmartWatchShowcase } from "@/components/smartwatch-showcase"

interface DownloadPageProps {
  defaultPlatform?: string
}

export default function DownloadPage({ defaultPlatform = "desktop" }: DownloadPageProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [platform, setPlatform] = useState(defaultPlatform)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/download/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, platform }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate download link")
      }

      setSuccess(`Download link sent to ${email}. Check your inbox!`)

      // If we have a direct download URL, redirect to it
      if (data.downloadUrl && !data.downloadUrl.includes("apps.apple.com")) {
        window.location.href = data.downloadUrl
      }
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Download Narcoguard</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Get the app that could save your life or help you save someone else's
        </p>

        {/* Smartwatch Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon: Narcoguard 2 Smartwatch</h2>
          <SmartWatchShowcase className="bg-muted/20 rounded-xl" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Download Narcoguard</CardTitle>
            <CardDescription>Enter your email to receive a download link for your preferred platform</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                <Download className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll send you a download link and installation instructions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Choose Your Platform</Label>
                  <Tabs defaultValue={platform} onValueChange={setPlatform} className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                      <TabsTrigger value="android" className="flex items-center">
                        <Android className="h-4 w-4 mr-2" /> Android
                      </TabsTrigger>
                      <TabsTrigger value="ios" className="flex items-center">
                        <Apple className="h-4 w-4 mr-2" /> iOS
                      </TabsTrigger>
                      <TabsTrigger value="windows" className="flex items-center">
                        <Windows className="h-4 w-4 mr-2" /> Windows
                      </TabsTrigger>
                      <TabsTrigger value="mac" className="flex items-center">
                        <Apple className="h-4 w-4 mr-2" /> macOS
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="android" className="mt-4 space-y-4">
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <Smartphone className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">Android App</h3>
                          <p className="text-sm text-muted-foreground">
                            For Android phones and tablets running Android 8.0 or higher
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ios" className="mt-4 space-y-4">
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <Smartphone className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">iOS App</h3>
                          <p className="text-sm text-muted-foreground">For iPhone and iPad running iOS 14 or higher</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="windows" className="mt-4 space-y-4">
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <Laptop className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">Windows App</h3>
                          <p className="text-sm text-muted-foreground">For Windows 10 and Windows 11 computers</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mac" className="mt-4 space-y-4">
                      <div className="flex items-center p-4 bg-muted rounded-lg">
                        <Laptop className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">macOS App</h3>
                          <p className="text-sm text-muted-foreground">
                            For Mac computers running macOS 11 (Big Sur) or higher
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" /> Download Narcoguard
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-sm text-muted-foreground">
              By downloading, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">
            If you're having trouble downloading or installing Narcoguard, please contact our support team.
          </p>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <a href="mailto:narcoguard607@gmail.com">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
