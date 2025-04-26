"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic } from "lucide-react"

export default function MyChartIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleConnect = () => {
    if (username && password) {
      setIsConnected(true)
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // In a real app, this would trigger speech recognition
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold mb-4 text-gradient bg-gradient-to-r from-purple-400 to-pink-600">
        MyChart Integration
      </h2>
      <p className="mb-4 text-white">
        Connect Narcoguard to your MyChart account from Epic Systems. This integration will help us provide better care
        and keep your medical team informed in case of emergencies.
      </p>
      {!isConnected ? (
        <motion.div
          className="space-y-4 bg-white/10 p-6 rounded-lg backdrop-blur-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <Label htmlFor="username" className="text-white">
              MyChart Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-white/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">
              MyChart Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-white/20 text-white"
            />
          </div>
          <Button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Connect to MyChart
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4 bg-white/10 p-6 rounded-lg backdrop-blur-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-green-400 font-bold">Successfully connected to MyChart!</p>
          <Button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-300">
            View Medical Records
          </Button>
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300">
            Schedule Appointment
          </Button>
          <Button className="w-full bg-gradient-to-r from-pink-400 to-red-500 hover:from-pink-500 hover:to-red-600 transition-all duration-300">
            Request Prescription Refill
          </Button>
          <Button className="w-full bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 transition-all duration-300">
            Message Healthcare Provider
          </Button>
        </motion.div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-white">Benefits of MyChart Integration:</h3>
        <ul className="list-disc list-inside space-y-2 text-white">
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            Share vital health information with your care team
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            Access your medical records and test results
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            Schedule appointments and request prescription refills
          </motion.li>
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            Communicate securely with your healthcare providers
          </motion.li>
        </ul>
      </div>
      <motion.div
        className="mt-6 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleListening}
          className={`flex items-center space-x-2 ${
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-full transition-all duration-300`}
        >
          <Mic className={`${isListening ? "animate-pulse" : ""}`} />
          <span>{isListening ? "Stop Listening" : "Start Voice Guidance"}</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}
