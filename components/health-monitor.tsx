"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, Activity, AlertTriangle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface HealthMonitorProps {
  userId: string
}

export default function HealthMonitor({ userId }: HealthMonitorProps) {
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [oxygenLevel, setOxygenLevel] = useState<number | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [status, setStatus] = useState<"normal" | "warning" | "danger" | "inactive">("inactive")
  const [countdown, setCountdown] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const emergencyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate connecting to a wearable device or sensor
  useEffect(() => {
    if (isMonitoring) {
      // Start simulated monitoring
      const interval = setInterval(() => {
        // Simulate data from sensors (in a real app, this would come from actual devices)
        const newHeartRate = Math.floor(Math.random() * 30) + 60 // 60-90 bpm range
        const newOxygenLevel = Math.floor(Math.random() * 5) + 95 // 95-99% range

        setHeartRate(newHeartRate)
        setOxygenLevel(newOxygenLevel)

        // Check for dangerous vital signs
        if (newHeartRate < 50 || newHeartRate > 120 || newOxygenLevel < 90) {
          setStatus("danger")
          startEmergencyCountdown()
        } else if (newHeartRate < 55 || newHeartRate > 100 || newOxygenLevel < 94) {
          setStatus("warning")
        } else {
          setStatus("normal")
        }
      }, 2000)

      return () => clearInterval(interval)
    } else {
      setStatus("inactive")
      setHeartRate(null)
      setOxygenLevel(null)

      // Clear any pending emergency countdowns
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current)
        emergencyTimeoutRef.current = null
      }

      setCountdown(null)
    }
  }, [isMonitoring])

  // Start emergency countdown and trigger emergency if not canceled
  const startEmergencyCountdown = () => {
    if (countdown === null) {
      setCountdown(15) // 15 second countdown

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1
          } else {
            // Countdown reached zero
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }

            // Trigger emergency
            triggerEmergency()
            return null
          }
        })
      }, 1000)
    }
  }

  // Cancel the emergency countdown
  const cancelEmergency = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (emergencyTimeoutRef.current) {
      clearTimeout(emergencyTimeoutRef.current)
      emergencyTimeoutRef.current = null
    }

    setCountdown(null)

    toast({
      title: "Emergency canceled",
      description: "You've canceled the emergency alert. Monitor your condition carefully.",
    })
  }

  // Trigger emergency alert and notification to contacts
  const triggerEmergency = async () => {
    try {
      // Send emergency alert to server
      const response = await fetch("/api/emergency/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          location: await getCurrentLocation(),
          vitalSigns: {
            heartRate,
            oxygenLevel,
          },
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Emergency services alerted",
          description: "Your emergency contacts and nearby help have been notified.",
          variant: "destructive",
        })
      } else {
        throw new Error("Failed to trigger emergency")
      }
    } catch (error) {
      console.error("Error triggering emergency:", error)

      // Fallback to local notification if server request fails
      toast({
        title: "Emergency alert triggered",
        description: "Warning: Unable to reach server. Please call emergency services.",
        variant: "destructive",
      })
    }
  }

  // Get current location for emergency services
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 }) // Default if geolocation not supported
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          resolve({ latitude: 0, longitude: 0 }) // Default on error
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      )
    })
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Health Monitor</h3>
        <Button onClick={() => setIsMonitoring(!isMonitoring)} variant={isMonitoring ? "destructive" : "default"}>
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Heart
            className={`h-5 w-5 ${status === "danger" ? "text-red-500 animate-pulse" : status === "warning" ? "text-amber-500" : "text-muted-foreground"}`}
          />
          <span>Heart Rate:</span>
          <span className="font-bold">{heartRate ? `${heartRate} BPM` : "Not monitoring"}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Activity
            className={`h-5 w-5 ${status === "danger" ? "text-red-500 animate-pulse" : status === "warning" ? "text-amber-500" : "text-muted-foreground"}`}
          />
          <span>Oxygen Level:</span>
          <span className="font-bold">{oxygenLevel ? `${oxygenLevel}%` : "Not monitoring"}</span>
        </div>
      </div>

      {status === "danger" && countdown !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 border border-red-500 bg-red-100 dark:bg-red-900/20 rounded-md"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-500 h-5 w-5" />
            <span className="font-bold text-red-500">Emergency will be triggered in {countdown} seconds</span>
          </div>
          <p className="text-sm mt-1">Abnormal vital signs detected. If this is not an emergency, press cancel.</p>
          <Button onClick={cancelEmergency} className="mt-2 w-full" variant="outline">
            I'm OK - Cancel Emergency
          </Button>
        </motion.div>
      )}

      {status === "warning" && (
        <div className="mt-4 p-4 border border-amber-500 bg-amber-100 dark:bg-amber-900/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Bell className="text-amber-500 h-5 w-5" />
            <span className="font-bold text-amber-500">Warning: Abnormal vital signs detected</span>
          </div>
          <p className="text-sm mt-1">Your vital signs are outside normal ranges. Please check your condition.</p>
        </div>
      )}
    </div>
  )
}
