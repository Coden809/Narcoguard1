"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function EmergencyFAB() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  const handleEmergencyCall = () => {
    // In a real app, this would trigger an emergency call
    toast({
      title: "Emergency Call Initiated",
      description: "Connecting you to emergency services...",
      variant: "destructive",
    })
  }

  const handleTextSupport = () => {
    toast({
      title: "Text Support",
      description: "Opening text support chat...",
    })
  }

  const handleAlertContacts = () => {
    toast({
      title: "Alert Sent",
      description: "Your emergency contacts have been notified.",
    })
  }

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {isExpanded && (
            <>
              <motion.button
                className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-full shadow-lg"
                onClick={handleTextSupport}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="sr-only">Text Support</span>
              </motion.button>

              <motion.button
                className="flex items-center justify-center bg-yellow-500 text-white p-4 rounded-full shadow-lg"
                onClick={handleAlertContacts}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.05 } }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AlertTriangle className="w-6 h-6" />
                <span className="sr-only">Alert Contacts</span>
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <motion.button
          className={`flex items-center justify-center p-4 rounded-full shadow-lg ${
            isExpanded ? "bg-gray-700 text-white" : "bg-red-500 text-white"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            if (isExpanded) {
              setIsExpanded(false)
            } else {
              setIsExpanded(true)
            }
          }}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Image
                src="/images/narcoguard-icon.png"
                alt="Narcoguard"
                width={28}
                height={28}
                className="rounded-full"
              />
            </div>
          )}
          <span className="sr-only">{isExpanded ? "Close Emergency Menu" : "Open Emergency Menu"}</span>
        </motion.button>
      </div>
    </>
  )
}
