"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Download,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Laptop,
  Apple,
  ComputerIcon as Windows,
  SmartphoneIcon as Android,
  Globe,
  Loader2,
  ExternalLink,
  Info
} from "lucide-react"
import { SmartWatchShowcase } from "@/components/smartwatch-showcase"
import { detectPlatform, PLATFORM_CONFIGS } from "@/lib/download-service"

interface DownloadPageProps {
  defaultPlatform?: string
}

interface ValidationResult {
  valid: boolean
  platform: string
  issues: string[]
  recommendations: string[]
  config?: {
    directDownload: boolean
    storeUrl?: string
    requirements: any
  }
}

export default function DownloadPage({ defaultPlatform }: DownloadPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [platform, setPlatform] = useState(defaultPlatform || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [userAgent, setUserAgent] = useState("")

  // Auto-detect platform on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent
      setUserAgent(ua)
      
      if (!platform) {
        const detected = detectPlatform(ua)
        setPlatform(detected)
      }
    }
  }, [platform])

  // Validate platform when it changes
  useEffect(() => {
    if (platform && userAgent) {
      validatePlatform(platform, userAgent)
    }
  }, [platform, userAgent])

  // Pre-fill email from URL params
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const validatePlatform = async (selectedPlatform: string, ua: string) => {
    setIsValidating(true)
    try {
      const response = await fetch('/api/download/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: selectedPlatform, userAgent: ua })
      })

      if (response.ok) {
        const result = await response.json()
        setValidation(result)
      }
    } catch (error) {
      console.error('Platform validation failed:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/download/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platform }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate download link")
      }

      setSuccess(`Download link sent to ${email}! Check your inbox for instructions.`)

      // If we have a direct download URL and it's not a store URL, trigger download
      if (data.data?.downloadUrl && !data.data.downloadUrl.includes('apps.apple.com') && !data.data.downloadUrl.includes('play.google.com')) {
        // Small delay to show success message
        setTimeout(() => {
          window.open(data.data.downloadUrl, '_blank')
        }, 1000)
      }

    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'android': return <Android className="h-5 w-5" />
      case 'ios': return <Apple className="h-5 w-5" />
      case 'windows': return <Windows className="h-5 w-5" />
      case 'mac': return <Apple className="h-5 w-5" />
      case 'linux': return <Laptop className="h-5 w-5" />
      case 'web': return <Globe className="h-5 w-5" />
      default: return <Smartphone className="h-5 w-5" />
    }
  }

  const getPlatformDescription = (platformName: string) => {
    const descriptions = {
      android: "For Android phones and tablets running Android 8.0 or higher",
      ios: "For iPhone and iPad running iOS 14 or higher",
      windows: "For Windows 10 and Windows 11 computers",
      mac: "For Mac computers running macOS 11 (Big Sur) or higher",
      linux: "For Linux distributions with AppImage support",
      web: "Works in any modern web browser - no installation required"
    }
    return descriptions[platformName as keyof typeof descriptions] || "Compatible with your device"
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
            <CardDescription>
              Enter your email to receive a download link for your preferred platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Platform Validation Alert */}
            {validation && !validation.valid && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Compatibility Issues Detected</AlertTitle>
                <AlertDescription>
                  <div className="mt-2">
                    <p className="font-medium">Issues:</p>
                    <ul className="list-disc list-inside ml-4">
                      {validation.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                    {validation.recommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium">Recommendations:</p>
                        <ul className="list-disc list-inside ml-4">
                          {validation.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Success/Error Messages */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
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
                  {isValidating && (
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Validating platform compatibility...
                    </div>
                  )}
                  
                  <Tabs defaultValue={platform} onValueChange={setPlatform} className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
                      {Object.entries(PLATFORM_CONFIGS).map(([key, config]) => (
                        <TabsTrigger key={key} value={key} className="flex items-center">
                          {getPlatformIcon(key)}
                          <span className="ml-2 hidden sm:inline">{config.displayName}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {Object.entries(PLATFORM_CONFIGS).map(([key, config]) => (
                      <TabsContent key={key} value={key} className="mt-4 space-y-4">
                        <div className="flex items-start p-4 bg-muted rounded-lg">
                          <div className="mr-4 mt-1">
                            {getPlatformIcon(key)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium flex items-center">
                              {config.displayName}
                              {validation?.valid === false && platform === key && (
                                <AlertCircle className="h-4 w-4 text-destructive ml-2" />
                              )}
                              {validation?.valid === true && platform === key && (
                                <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getPlatformDescription(key)}
                            </p>
                            
                            {/* Platform-specific information */}
                            {config.storeUrl && (
                              <div className="mt-2 flex items-center text-sm">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                <span>Available on official app store</span>
                              </div>
                            )}
                            
                            {config.requirements.minOsVersion && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                Requires {config.displayName} {config.requirements.minOsVersion}+
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Platform-specific instructions */}
                        {platform === key && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Installation Instructions</AlertTitle>
                            <AlertDescription>
                              <div className="mt-2 text-sm">
                                {key === 'ios' && (
                                  <ol className="list-decimal list-inside space-y-1">
                                    <li>Tap the download link to open the App Store</li>
                                    <li>Tap "Get" to download and install Narcoguard</li>
                                    <li>Open the app and complete setup</li>
                                    <li>Allow notifications and location access for emergency features</li>
                                  </ol>
                                )}
                                {key === 'android' && (
                                  <ol className="list-decimal list-inside space-y-1">
                                    <li>Download will start automatically or redirect to Play Store</li>
                                    <li>If downloading APK, allow installation from unknown sources</li>
                                    <li>Open the app and complete setup</li>
                                    <li>Allow notifications and location access for emergency features</li>
                                  </ol>
                                )}
                                {(key === 'windows' || key === 'mac' || key === 'linux') && (
                                  <ol className="list-decimal list-inside space-y-1">
                                    <li>Click the download link to download the installer</li>
                                    <li>Run the downloaded file and follow installation prompts</li>
                                    <li>Launch Narcoguard from your applications</li>
                                    <li>Complete the initial setup process</li>
                                  </ol>
                                )}
                                {key === 'web' && (
                                  <ol className="list-decimal list-inside space-y-1">
                                    <li>Click the link to open the web app</li>
                                    <li>For best experience, add to your home screen</li>
                                    <li>Complete the initial setup process</li>
                                    <li>Enable notifications for emergency alerts</li>
                                  </ol>
                                )}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (validation && !validation.valid)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      {platform === 'web' ? 'Launch Web App' : `Download for ${PLATFORM_CONFIGS[platform]?.displayName || 'Your Device'}`}
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

        {/* Help Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">
            If you're having trouble downloading or installing Narcoguard, please contact our support team.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" asChild>
              <a href="mailto:narcoguard607@gmail.com">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/resources">View Resources</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}