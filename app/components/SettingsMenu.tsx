"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Watch } from "lucide-react"
import { motion } from "framer-motion"
import WearableDevices from "./WearableDevices"

type SettingsMenuProps = {}

const SettingsMenu: React.FC<SettingsMenuProps> = ({}) => {
  const [showDevices, setShowDevices] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Watch size={20} />
          <span>Connected Devices</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowDevices(true)}>
          Manage
        </Button>
      </div>
      {showDevices && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Manage Connected Devices</CardTitle>
              <CardDescription>Connect or disconnect your wearable devices</CardDescription>
            </CardHeader>
            <CardContent>
              <WearableDevices />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowDevices(false)}>Close</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <Switch id="push-notifications" />
        </div>
        <p className="text-sm text-muted-foreground">
          Receive push notifications for important updates and announcements.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch id="email-notifications" />
        </div>
        <p className="text-sm text-muted-foreground">
          Receive email notifications for important updates and announcements.
        </p>
      </div>
    </div>
  )
}

export default SettingsMenu
