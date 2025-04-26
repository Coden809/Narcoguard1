"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GlassesIcon as Goggles, Play, Pause, RotateCcw } from "lucide-react"

export default function VRTraining() {
  const [isTraining, setIsTraining] = useState(false)

  const startTraining = () => {
    setIsTraining(true)
    // In a real application, this would initiate the VR training session
  }

  const pauseTraining = () => {
    setIsTraining(false)
    // In a real application, this would pause the VR training session
  }

  const resetTraining = () => {
    setIsTraining(false)
    // In a real application, this would reset the VR training session
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Goggles className="mr-2" />
            VR Training Simulator
          </CardTitle>
          <CardDescription>
            Experience realistic overdose scenarios and practice your response in virtual reality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our VR training simulator provides a safe environment to practice administering naloxone and performing CPR
            in various emergency scenarios.
          </p>
          <div className="flex justify-center">
            <motion.div
              animate={isTraining ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: isTraining ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              <Goggles size={64} />
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={startTraining} disabled={isTraining}>
            <Play className="mr-2" /> Start Training
          </Button>
          <Button onClick={pauseTraining} disabled={!isTraining}>
            <Pause className="mr-2" /> Pause
          </Button>
          <Button onClick={resetTraining}>
            <RotateCcw className="mr-2" /> Reset
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
