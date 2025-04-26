"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, MapPin, Bell, Users, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function HeroMode() {
  const [isHeroMode, setIsHeroMode] = useState(false)
  const [allowHeroNetwork, setAllowHeroNetwork] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    try {
      const savedContacts = localStorage.getItem("emergencyContacts")
      if (savedContacts) {
        const parsedData = JSON.parse(savedContacts)
        if (parsedData && typeof parsedData === "object" && "allowHeroNetwork" in parsedData) {
          setAllowHeroNetwork(parsedData.allowHeroNetwork)
          setIsHeroMode(parsedData.allowHeroNetwork)
        } else {
          console.warn("Invalid emergency contacts data structure:", parsedData)
          setAllowHeroNetwork(false)
          setIsHeroMode(false)
        }
      } else {
        console.log("No emergency contacts data found in localStorage")
        setAllowHeroNetwork(false)
        setIsHeroMode(false)
      }
    } catch (error) {
      console.error("Error parsing emergency contacts data:", error)
      setAllowHeroNetwork(false)
      setIsHeroMode(false)
    }
  }, [])

  const features = [
    {
      icon: AlertCircle,
      title: "Instant Alerts",
      description: "Receive immediate notifications when someone nearby needs help.",
    },
    {
      icon: MapPin,
      title: "Precise Locations",
      description: "Get exact naloxone locations to save precious time in emergencies.",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Join a network of heroes ready to respond and save lives.",
    },
    {
      icon: Shield,
      title: "Privacy Protection",
      description: "Your personal information is always kept secure and anonymous.",
    },
    {
      icon: Bell,
      title: "Customizable Notifications",
      description: "Set your availability and notification preferences.",
    },
    { icon: Clock, title: "24/7 Support", description: "Our support team is always available to assist you." },
  ]

  const handleHeroModeToggle = (checked: boolean) => {
    setIsHeroMode(checked)
    setAllowHeroNetwork(checked)
    try {
      localStorage.setItem("emergencyContacts", JSON.stringify({ allowHeroNetwork: checked }))
    } catch (error) {
      console.error("Error saving hero network preference:", error)
    }
  }

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return "from-yellow-400 to-orange-500"
      case "dark":
        return "from-indigo-600 to-purple-600"
      case "ocean":
        return "from-blue-400 to-cyan-300"
      case "forest":
        return "from-green-400 to-emerald-500"
      case "sunset":
        return "from-orange-400 to-pink-500"
      default:
        return "from-fuchsia-500 to-blue-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className={`text-3xl font-bold mb-4 text-gradient bg-gradient-to-r ${getThemeColors()}`}>Hero Mode</h2>
      <p className="mb-4 text-white text-lg">
        Activate Hero Mode to join a network of lifesavers. When active, you'll be alerted if someone nearby experiences
        an overdose. Your quick response could make the difference between life and death.
      </p>
      <div className="flex items-center space-x-2">
        <Switch
          id="hero-mode"
          checked={isHeroMode}
          onCheckedChange={handleHeroModeToggle}
          className={`bg-gradient-to-r ${getThemeColors()}`}
        />
        <Label htmlFor="hero-mode" className="text-white text-lg">
          Activate Hero Mode
        </Label>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeroMode ? 1 : 0.5 }}
        transition={{ duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`bg-gradient-to-br ${getThemeColors()} bg-opacity-10 p-4 rounded-lg backdrop-blur-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <feature.icon className="w-8 h-8 mb-2 text-white" />
            <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-white/80">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className={`mt-8 p-6 bg-gradient-to-br ${getThemeColors()} bg-opacity-30 rounded-lg backdrop-blur-md`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-white">Your Hero Network Preference</h3>
        <p className="mb-4 text-white">
          {isHeroMode
            ? "You have chosen to allow heroes from the Narcoguard network to assist you in case of an emergency. This means that nearby heroes may be notified if you need help."
            : "You have chosen not to allow heroes from the Narcoguard network to assist you. Only your designated emergency contacts will be notified in case of an emergency."}
        </p>
        <Button
          onClick={() => {
            // In a real app, this would open a modal or navigate to the EmergencyContacts component
            alert("This would allow you to change your Hero Network preference in the Emergency Contacts settings.")
          }}
          className={`bg-gradient-to-r ${getThemeColors()} text-white`}
        >
          Change Hero Network Preference
        </Button>
      </motion.div>
      <p className="mt-4 text-white text-lg">
        Remember, being a hero isn't just about responding to emergencies—it's about being prepared. Always keep your
        naloxone accessible and stay informed about proper administration techniques. Your commitment could save a life!
      </p>
    </motion.div>
  )
}
