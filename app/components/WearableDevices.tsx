"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Watch, Smartphone, BellRingIcon as Ring, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const devices = [
  { name: "Fitbit", icon: Watch, connected: false },
  { name: "Apple Watch", icon: Watch, connected: false },
  { name: "Samsung Galaxy Watch", icon: Watch, connected: false },
  { name: "Google Pixel Watch", icon: Watch, connected: false },
  { name: "Oura Ring", icon: Ring, connected: false },
  { name: "Smartphone", icon: Smartphone, connected: true },
]

const WearableDevices = () => {
  const [connectedDevices, setConnectedDevices] = useState(devices)

  const toggleConnection = (index: number) => {
    const updatedDevices = [...connectedDevices]
    updatedDevices[index].connected = !updatedDevices[index].connected
    setConnectedDevices(updatedDevices)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connectedDevices.map((device, index) => (
        <motion.div
          key={device.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <device.icon className="w-6 h-6" />
                <span>{device.name}</span>
              </CardTitle>
              <CardDescription>{device.connected ? "Connected and syncing data" : "Not connected"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {device.connected
                  ? "This device is currently connected and syncing health data with Narcoguard."
                  : "Connect this device to sync health data with Narcoguard."}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => toggleConnection(index)}
                variant={device.connected ? "destructive" : "default"}
                className="w-full"
              >
                {device.connected ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default WearableDevices
