"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import HealthMonitor from "@/components/health-monitor"
import AIGuide from "@/components/ai-guide"
import Navbar from "@/components/navbar"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Map, Bell, Users, Settings, ArrowUpRight, ChevronDown } from "lucide-react"

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [showAIGuide, setShowAIGuide] = useState(false)

  // Mock data for vitals chart
  const vitalsData = [
    { time: "08:00", heartRate: 72, oxygenLevel: 98 },
    { time: "09:00", heartRate: 75, oxygenLevel: 99 },
    { time: "10:00", heartRate: 78, oxygenLevel: 98 },
    { time: "11:00", heartRate: 80, oxygenLevel: 97 },
    { time: "12:00", heartRate: 79, oxygenLevel: 98 },
    { time: "13:00", heartRate: 77, oxygenLevel: 99 },
    { time: "14:00", heartRate: 76, oxygenLevel: 98 },
  ]

  // Mock data for nearby heroes
  const nearbyHeroes = [
    { id: "hero1", name: "John D.", distance: 0.5, isAvailable: true },
    { id: "hero2", name: "Maria S.", distance: 1.2, isAvailable: true },
    { id: "hero3", name: "Alex W.", distance: 1.8, isAvailable: false },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getDarkMode = () =>
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Your health statistics and community updates.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vital Signs Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Vital Signs Trend</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
                    <span className="text-sm">Heart Rate (BPM)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-secondary mr-1"></span>
                    <span className="text-sm">Oxygen Level (%)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vitalsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getDarkMode() ? "#8b5cf6" : "#a855f7"} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={getDarkMode() ? "#8b5cf6" : "#a855f7"} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getDarkMode() ? "#ec4899" : "#ec4899"} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={getDarkMode() ? "#ec4899" : "#ec4899"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" orientation="left" domain={[50, 100]} />
                      <YAxis yAxisId="right" orientation="right" domain={[90, 100]} />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="heartRate"
                        stroke={getDarkMode() ? "#8b5cf6" : "#a855f7"}
                        fillOpacity={1}
                        fill="url(#heartRateGradient)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="oxygenLevel"
                        stroke={getDarkMode() ? "#ec4899" : "#ec4899"}
                        fillOpacity={1}
                        fill="url(#oxygenGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Health Monitor */}
            <HealthMonitor userId="user123" />

            {/* Nearby Heroes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Nearby Heroes
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyHeroes.map((hero) => (
                    <div key={hero.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${hero.isAvailable ? "bg-green-500" : "bg-gray-400"}`}
                        ></div>
                        <div>
                          <p className="font-medium">{hero.name}</p>
                          <p className="text-sm text-muted-foreground">{hero.distance} miles away</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button className="flex flex-col items-center justify-center h-24 px-4">
                  <Map className="mb-2 h-6 w-6" />
                  <span>Find Naloxone</span>
                </Button>
                <Button className="flex flex-col items-center justify-center h-24 px-4">
                  <Bell className="mb-2 h-6 w-6" />
                  <span>Emergency Contacts</span>
                </Button>
                <Button className="flex flex-col items-center justify-center h-24 px-4">
                  <Heart className="mb-2 h-6 w-6" />
                  <span>Training</span>
                </Button>
                <Button className="flex flex-col items-center justify-center h-24 px-4">
                  <Settings className="mb-2 h-6 w-6" />
                  <span>Settings</span>
                </Button>
              </CardContent>
            </Card>

            {/* AI Guide */}
            <div>
              <motion.div
                initial={{ height: 50 }}
                animate={{ height: showAIGuide ? "auto" : 50 }}
                className="overflow-hidden"
              >
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                  onClick={() => setShowAIGuide(!showAIGuide)}
                >
                  <span>Guardian AI Guide</span>
                  <ChevronDown className={`transition-transform ${showAIGuide ? "rotate-180" : ""}`} />
                </Button>

                <div className="mt-4">
                  <AIGuide />
                </div>
              </motion.div>
            </div>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Naloxone Administration Guide", link: "/guides/naloxone" },
                  { title: "Overdose Recognition Signs", link: "/guides/overdose-signs" },
                  { title: "CPR Tutorial Video", link: "/guides/cpr-tutorial" },
                  { title: "Emergency Response Protocol", link: "/guides/emergency-protocol" },
                ].map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.link}
                    className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                  >
                    <span>{resource.title}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
