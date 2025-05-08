"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Apple, SmartphoneIcon as Android, Laptop, Globe } from "lucide-react"
import Link from "next/link"
import DownloadModal from "@/components/download-modal"

export default function DownloadSection() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("ios")

  const handleDownloadClick = (platform: string) => {
    setSelectedPlatform(platform)
    setIsDownloadModalOpen(true)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Download Narcoguard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get Narcoguard on your preferred device and join our mission to prevent overdose deaths.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Tabs defaultValue="ios" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="ios" onClick={() => setSelectedPlatform("ios")}>
                <Apple className="mr-2 h-4 w-4" />
                iOS
              </TabsTrigger>
              <TabsTrigger value="android" onClick={() => setSelectedPlatform("android")}>
                <Android className="mr-2 h-4 w-4" />
                Android
              </TabsTrigger>
              <TabsTrigger value="desktop" onClick={() => setSelectedPlatform("windows")}>
                <Laptop className="mr-2 h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="web" onClick={() => setSelectedPlatform("web")}>
                <Globe className="mr-2 h-4 w-4" />
                Web
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ios" className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=600&width=300"
                  alt="Narcoguard iOS App"
                  className="mx-auto h-auto max-h-96 rounded-xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Narcoguard for iOS</h3>
                <p className="mb-4 text-muted-foreground">
                  Get the full Narcoguard experience on your iPhone or iPad. Connect with Apple Health, Apple Watch, and
                  other compatible devices for comprehensive monitoring.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Compatible with iOS 14.0 and later
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Apple Watch integration
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Background monitoring
                  </li>
                </ul>
                <Button onClick={() => handleDownloadClick("ios")}>
                  <Apple className="mr-2 h-5 w-5" />
                  Download for iOS
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="android" className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=600&width=300"
                  alt="Narcoguard Android App"
                  className="mx-auto h-auto max-h-96 rounded-xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Narcoguard for Android</h3>
                <p className="mb-4 text-muted-foreground">
                  The Android version of Narcoguard offers seamless integration with Google Fit and a wide range of
                  wearable devices for comprehensive health monitoring.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Compatible with Android 8.0 and later
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Google Fit integration
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Works with most Bluetooth wearables
                  </li>
                </ul>
                <Button onClick={() => handleDownloadClick("android")}>
                  <Android className="mr-2 h-5 w-5" />
                  Download for Android
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="desktop" className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Narcoguard Desktop App"
                  className="mx-auto h-auto max-h-80 rounded-xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Narcoguard for Desktop</h3>
                <p className="mb-4 text-muted-foreground">
                  Our desktop application provides advanced monitoring capabilities and is perfect for healthcare
                  providers and family members who want to keep track of loved ones.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Available for Windows, macOS, and Linux
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Multi-user monitoring dashboard
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Advanced analytics and reporting
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleDownloadClick("windows")}>
                    <Laptop className="mr-2 h-5 w-5" />
                    Windows
                  </Button>
                  <Button onClick={() => handleDownloadClick("mac")} variant="outline">
                    <Apple className="mr-2 h-5 w-5" />
                    macOS
                  </Button>
                  <Button onClick={() => handleDownloadClick("linux")} variant="outline">
                    <Laptop className="mr-2 h-5 w-5" />
                    Linux
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="web" className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Narcoguard Web App"
                  className="mx-auto h-auto max-h-80 rounded-xl shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Narcoguard Web App</h3>
                <p className="mb-4 text-muted-foreground">
                  Access Narcoguard directly from your browser with no installation required. Perfect for quick access
                  on any device.
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Works on any modern browser
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    No installation required
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Progressive Web App capabilities
                  </li>
                </ul>
                <Button onClick={() => handleDownloadClick("web")}>
                  <Globe className="mr-2 h-5 w-5" />
                  Launch Web App
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Want to see all download options?</p>
            <Button variant="outline" asChild>
              <Link href="/download">View All Download Options</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </section>
  )
}
