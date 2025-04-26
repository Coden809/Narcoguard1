"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function NaloxoneSetup() {
  const [location, setLocation] = useState("")

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Naloxone Setup</h2>
      <p className="mb-4">
        Naloxone is a life-saver, literally! Let's make sure you know where it is at all times. Remember, in an
        emergency, nobody has time for hide-and-seek.
      </p>
      <Label htmlFor="naloxone-location">Where do you keep your naloxone?</Label>
      <Input
        id="naloxone-location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., Back pocket, bedside drawer"
        className="mb-4"
      />
      <Button className="w-full">Find Free Naloxone Near Me</Button>
      <p className="mt-4">
        Don't have naloxone yet? No worries! Click the button above to find free naloxone sources near you.
      </p>
    </motion.div>
  )
}
