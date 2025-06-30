"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, Activity, AlertTriangle, Bell, Bluetooth, Wifi, Battery } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface HealthMonitorProps {
  userId: string
}

interface VitalSigns {
  heartRate: number
  oxygenLevel: number
  bloodPressure: { systolic: number; diastolic: number }
  temperature: number
  timestamp: Date
}

interface DeviceStatus {
  connected: boolean
  battery: number
  signalStrength: number
  lastSync: Date
}

export default function HealthMonitor({ userId }: HealthMonitorProps) {
  // State management
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null)
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    connected: false,
    battery: 0,
    signalStrength: 0,
    lastSync: new Date()
  })
  const [status, setStatus] = useState<"normal" | "warning" | "danger" | "inactive">("inactive")
  const [countdown, setCountdown] = useState<number | null>(null)
  const [alertHistory, setAlertHistory] = useState<Array<{ timestamp: Date; type: string; resolved: boolean }>>([])

  // Refs for cleanup
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null)
  const emergencyTimeout = useRef<NodeJS.Timeout | null>(null)
  const countdownInterval = useRef<NodeJS.Timeout | null>(null)

  // Simulate device connection
  useEffect(() => {
    if (isMonitoring) {
      // Simulate device connection
      setDeviceStatus({
        connected: true,
        battery: Math.floor(Math.random() * 30) + 70, // 70-100%
        signalStrength: Math.floor(Math.random() * 30) + 70, // 70-100%
        lastSync: new Date()
      })

      // Start vital signs monitoring
      monitoringInterval.current = setInterval(() => {
        generateVitalSigns()
      }, 2000) // Update every 2 seconds

      return () => {
        if (monitoringInterval.current) {
          clearInterval(monitoringInterval.current)
        }
      }
    } else {
      // Reset state when monitoring stops
      setDeviceStatus(prev => ({ ...prev, connected: false }))
      setVitalSigns(null)
      setStatus("inactive")
      clearEmergencyState()
    }
  }, [isMonitoring])

  // Generate simulated vital signs
  const generateVitalSigns = () => {
    // Use mock data if available (for testing)
    if (typeof window !== 'undefined' && (window as any).mockVitalSigns) {
      const mockData = (window as any).mockVitalSigns
      const newVitalSigns: VitalSigns = {
        heartRate: mockData.heartRate || Math.floor(Math.random() * 40) + 60,
        oxygenLevel: mockData.oxygenLevel || Math.floor(Math.random() * 5) + 95,
        bloodPressure: mockData.bloodPressure || {
          systolic: Math.floor(Math.random() * 40) + 110,
          diastolic: Math.floor(Math.random() * 20) + 70
        },
        temperature: mockData.temperature || (Math.random() * 2 + 97.5),
        timestamp: new Date()
      }
      setVitalSigns(newVitalSigns)
      analyzeVitalSigns(newVitalSigns)
      return
    }

    // Normal simulation
    const baseHeartRate = 75
    const baseOxygenLevel = 98
    const variation = Math.random() * 0.2 - 0.1 // ±10% variation

    const newVitalSigns: VitalSigns = {
      heartRate: Math.floor(baseHeartRate + (baseHeartRate * variation)),
      oxygenLevel: Math.floor(baseOxygenLevel + (baseOxygenLevel * variation * 0.1)),
      bloodPressure: {
        systolic: Math.floor(120 + (Math.random() * 20 - 10)),
        diastolic: Math.floor(80 + (Math.random() * 10 - 5))
      },
      temperature: Number((98.6 + (Math.random() * 1 - 0.5)).toFixed(1)),
      timestamp: new Date()
    }

    setVitalSigns(newVitalSigns)
    analyzeVitalSigns(newVitalSigns)
  }

  // Analyze vital signs for abnormalities
  const analyzeVitalSigns = (vitals: VitalSigns) => {
    const { heartRate, oxygenLevel, bloodPressure, temperature } = vitals

    // Define thresholds
    const criticalThresholds = {
      heartRate: { min: 50, max: 120 },
      oxygenLevel: { min: 90 },
      bloodPressure: { systolic: { max: 160 }, diastolic: { max: 100 } },
      temperature: { min: 96, max: 101 }
    }

    const warningThresholds = {
      heartRate: { min: 55, max: 100 },
      oxygenLevel: { min: 94 },
      bloodPressure: { systolic: { max: 140 }, diastolic: { max: 90 } },
      temperature: { min: 97, max: 99.5 }
    }

    // Check for critical conditions
    const isCritical = 
      heartRate < criticalThresholds.heartRate.min ||
      heartRate > criticalThresholds.heartRate.max ||
      oxygenLevel < criticalThresholds.oxygenLevel.min ||
      bloodPressure.systolic > criticalThresholds.bloodPressure.systolic.max ||
      bloodPressure.diastolic > criticalThresholds.bloodPressure.diastolic.max ||
      temperature < criticalThresholds.temperature.min ||
      temperature > criticalThresholds.temperature.max

    // Check for warning conditions
    const isWarning = !isCritical && (
      heartRate < warningThresholds.heartRate.min ||
      heartRate > warningThresholds.heartRate.max ||
      oxygenLevel < warningThresholds.oxygenLevel.min ||
      bloodPressure.systolic > warningThresholds.bloodPressure.systolic.max ||
      bloodPressure.diastolic > warningThresholds.bloodPressure.diastolic.max ||
      temperature < warningThresholds.temperature.min ||
      temperature > warningThresholds.temperature.max
    )

    if (isCritical) {
      setStatus("danger")
      startEmergencyCountdown()
    } else if (isWarning) {
      setStatus("warning")
      clearEmergencyState()
    } else {
      setStatus("normal")
      clearEmergencyState()
    }
  }

  // Start emergency countdown
  const startEmergencyCountdown = () => {
    if (countdown !== null) return // Already counting down

    setCountdown(15) // 15 second countdown

    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev !== null && prev > 0) {
          return prev - 1
        } else {
          // Countdown reached zero
          if (countdownInterval.current) {
            clearInterval(countdownInterval.current)
            countdownInterval.current = null
          }
          triggerEmergency()
          return null
        }
      })
    }, 1000)
  }

  // Clear emergency state
  const clearEmergencyState = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current)
      countdownInterval.current = null
    }
    if (emergencyTimeout.current) {
      clearTimeout(emergencyTimeout.current)
      emergencyTimeout.current = null
    }
    setCountdown(null)
  }

  // Cancel emergency
  const cancelEmergency = () => {
    clearEmergencyState()
    setAlertHistory(prev => [...prev, {
      timestamp: new Date(),
      type: 'emergency_cancelled',
      resolved: true
    }])

    toast({
      title: "Emergency canceled",
      description: "You've canceled the emergency alert. Monitor your condition carefully.",
    })
  }

  // Trigger emergency alert
  const triggerEmergency = async () => {
    try {
      const response = await fetch("/api/emergency/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          emergencyType: "vital_signs_critical",
          location: await getCurrentLocation(),
          vitalSigns,
          timestamp: new Date().toISOString(),
        }),
      })

      setAlertHistory(prev => [...prev, {
        timestamp: new Date(),
        type: 'emergency_triggered',
        resolved: false
      }])

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
      toast({
        title: "Emergency alert triggered",
        description: "Warning: Unable to reach server. Please call emergency services.",
        variant: "destructive",
      })
    }
  }

  // Get current location
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 })
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => {
          resolve({ latitude: 0, longitude: 0 })
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    })
  }

  // Toggle monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  return (
    <Card className="w-full" data-testid="health-monitor">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Health Monitor</span>
          <div className="flex items-center space-x-2">
            {/* Device status indicators */}
            <div className="flex items-center space-x-1">
              <Bluetooth 
                className={`h-4 w-4 ${deviceStatus.connected ? 'text-blue-500' : 'text-gray-400'}`}
                data-testid="bluetooth-status"
              />
              <Wifi 
                className={`h-4 w-4 ${deviceStatus.signalStrength > 50 ? 'text-green-500' : 'text-yellow-500'}`}
                data-testid="wifi-status"
              />
              <Battery 
                className={`h-4 w-4 ${deviceStatus.battery > 20 ? 'text-green-500' : 'text-red-500'}`}
                data-testid="battery-status"
              />
              <span className="text-xs text-muted-foreground">{deviceStatus.battery}%</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Monitoring Control */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" data-testid="monitoring-status">
              Status: {isMonitoring ? "Active" : "Inactive"}
            </p>
            {deviceStatus.connected && (
              <p className="text-xs text-muted-foreground">
                Last sync: {deviceStatus.lastSync.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            onClick={toggleMonitoring} 
            variant={isMonitoring ? "destructive" : "default"}
            data-testid={isMonitoring ? "stop-monitoring" : "start-monitoring"}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
        </div>

        {/* Vital Signs Display */}
        {vitalSigns && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2" data-testid="heart-rate">
              <div className="flex items-center space-x-2">
                <Heart className={`h-5 w-5 ${
                  status === "danger" ? "text-red-500 animate-pulse" : 
                  status === "warning" ? "text-amber-500" : "text-green-500"
                }`} />
                <span className="text-sm font-medium">Heart Rate</span>
              </div>
              <p className="text-2xl font-bold">{vitalSigns.heartRate} BPM</p>
            </div>

            <div className="space-y-2" data-testid="oxygen-level">
              <div className="flex items-center space-x-2">
                <Activity className={`h-5 w-5 ${
                  status === "danger" ? "text-red-500 animate-pulse" : 
                  status === "warning" ? "text-amber-500" : "text-green-500"
                }`} />
                <span className="text-sm font-medium">Oxygen Level</span>
              </div>
              <p className="text-2xl font-bold">{vitalSigns.oxygenLevel}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Blood Pressure</span>
              </div>
              <p className="text-lg font-bold">
                {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <p className="text-lg font-bold">{vitalSigns.temperature}°F</p>
            </div>
          </div>
        )}

        {/* Emergency Alert */}
        {status === "danger" && countdown !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 border border-red-500 bg-red-100 dark:bg-red-900/20 rounded-md"
            data-testid="emergency-alert"
          >
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              <span className="font-bold text-red-500" data-testid="emergency-countdown">
                Emergency will be triggered in {countdown} seconds
              </span>
            </div>
            <p className="text-sm mb-3">
              Critical vital signs detected. If this is not an emergency, press cancel.
            </p>
            <Button 
              onClick={cancelEmergency} 
              className="w-full" 
              variant="outline"
              data-testid="cancel-emergency"
            >
              I'm OK - Cancel Emergency
            </Button>
          </motion.div>
        )}

        {/* Warning Alert */}
        {status === "warning" && (
          <div className="p-4 border border-amber-500 bg-amber-100 dark:bg-amber-900/20 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Bell className="text-amber-500 h-5 w-5" />
              <span className="font-bold text-amber-500">Warning: Abnormal vital signs detected</span>
            </div>
            <p className="text-sm">
              Your vital signs are outside normal ranges. Please check your condition.
            </p>
          </div>
        )}

        {/* Recent Alerts */}
        {alertHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Alerts</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {alertHistory.slice(-3).map((alert, index) => (
                <div key={index} className="text-xs p-2 bg-muted rounded flex justify-between">
                  <span>{alert.type.replace('_', ' ')}</span>
                  <span>{alert.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}