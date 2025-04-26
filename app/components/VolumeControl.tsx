"use client"

import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"

export default function VolumeControl({ volume, setVolume }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Adjust Volume</h2>
      <p className="mb-4">Let's make sure you can hear me loud and clear. Adjust the volume to your liking.</p>
      <Slider
        value={[volume]}
        onValueChange={(value) => setVolume(value[0])}
        max={100}
        step={1}
        className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
      />
      <p className="mt-2">Current volume: {volume}%</p>
    </motion.div>
  )
}
