"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Activity, Thermometer, Droplet, Menu, Settings, User, Bell, HelpCircle, LogOut } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("./components/Map"), { ssr: false })

const getThemeColors = (theme: string) => {
  switch (theme) {
    case "light":
      return { primary: "#F59E0B", secondary: "#EF4444", background: "#F3F4F6" }
    case "dark":
      return { primary: "#6366F1", secondary: "#EC4899", background: "#1F2937" }
    default:
      return { primary: "#3B82F6", secondary: "#10B981", background: "#F3F4F6" }
  }
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [heartRate, setHeartRate] = useState(75)
  const [oxygenLevel, setOxygenLevel] = useState(98)
  const [temperature, setTemperature] = useState(98.6)
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 })
  const [heroMode, setHeroMode] = useState(false)

  const colors = getThemeColors(theme)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setHeartRate((prev) => Math.max(60, Math.min(100, prev + Math.floor(Math.random() * 5) - 2)))
      setOxygenLevel((prev) => Math.max(95, Math.min(100, prev + Math.floor(Math.random() * 2) - 1)))
      setTemperature((prev) => Math.max(97, Math.min(99, prev + (Math.random() * 0.4 - 0.2))))
      setBloodPressure((prev) => ({
        systolic: Math.max(100, Math.min(140, prev.systolic + Math.floor(Math.random() * 5) - 2)),
        diastolic: Math.max(60, Math.min(90, prev.diastolic + Math.floor(Math.random() * 3) - 1)),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const data = [
    { name: "5m ago", heartRate: 72, oxygenLevel: 98 },
    { name: "4m ago", heartRate: 75, oxygenLevel: 99 },
    { name: "3m ago", heartRate: 73, oxygenLevel: 98 },
    { name: "2m ago", heartRate: 77, oxygenLevel: 97 },
    { name: "1m ago", heartRate: 76, oxygenLevel: 98 },
    { name: "Now", heartRate: heartRate, oxygenLevel: oxygenLevel },
  ]

  return (
    <div className={`min-h-screen bg-${colors.background} text-foreground`}>
      <nav className="bg-background border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Narcoguard Dashboard</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{heartRate} BPM</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Oxygen Level</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{oxygenLevel}%</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{temperature.toFixed(1)}°F</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bloodPressure.systolic}/{bloodPressure.diastolic}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke={colors.primary} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="oxygenLevel" stroke={colors.secondary} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Hero Mode</span>
              <Button variant={heroMode ? "default" : "outline"} onClick={() => setHeroMode(!heroMode)}>
                {heroMode ? "Enabled" : "Disabled"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {heroMode ? (
              <div className="h-[400px] relative">
                <Map />
                <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-md">
                  <p className="text-sm font-medium">Nearby Heroes: 3</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-muted">
                <p className="text-muted-foreground">Enable Hero Mode to see nearby users</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
