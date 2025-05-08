"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Download, Apple, SmartphoneIcon as Android, Laptop, Globe } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [platform, setPlatform] = useState("ios")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDownloading(true)

    try {
      // Instead of directly downloading, redirect to the platform-specific download page
      router.push(`/download/${platform}?email=${encodeURIComponent(email)}`)
      onClose()
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error starting your download. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Download Narcoguard</h2>
              <p className="text-muted-foreground mb-6">
                Enter your email to receive the download link for the Narcoguard app.
              </p>

              <Tabs defaultValue="ios" value={platform} onValueChange={setPlatform}>
                <TabsList className="grid grid-cols-4 mb-6">
                  {[
                    { value: "ios", icon: Apple, label: "iOS" },
                    { value: "android", icon: Android, label: "Android" },
                    { value: "windows", icon: Laptop, label: "Desktop" },
                    { value: "web", icon: Globe, label: "Web" },
                  ].map((item) => (
                    <TabsTrigger key={item.value} value={item.value} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="ios">
                  <p className="mb-4">Download Narcoguard for iPhone and iPad devices running iOS 14 or later.</p>
                </TabsContent>
                <TabsContent value="android">
                  <p className="mb-4">Download Narcoguard for Android devices running Android 8.0 or later.</p>
                </TabsContent>
                <TabsContent value="windows">
                  <p className="mb-4">Download Narcoguard for Windows, macOS, and Linux operating systems.</p>
                </TabsContent>
                <TabsContent value="web">
                  <p className="mb-4">Access Narcoguard directly from your web browser, no installation required.</p>
                </TabsContent>
              </Tabs>

              <form onSubmit={handleDownload}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isDownloading}>
                    {isDownloading ? (
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
                        {platform === "web" ? (
                          <Globe className="mr-2 h-5 w-5" />
                        ) : (
                          <Download className="mr-2 h-5 w-5" />
                        )}
                        {platform === "web" ? "Launch Web App" : "Download Now"}
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-xs text-muted-foreground mt-6">
                By downloading, you agree to our Terms of Service and Privacy Policy. Standard message and data rates
                may apply.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
