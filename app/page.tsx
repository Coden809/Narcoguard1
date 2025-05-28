"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Sparkles, ChevronLeft, ChevronRight, Volume2, VolumeX, HelpCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import ErrorBoundary from "./components/ErrorBoundary"
import ProgressTracker from "./components/ProgressTracker"
import { ThemeProvider } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Dynamically import heavy components
const BackgroundAnimation = dynamic(() => import("./components/BackgroundAnimation"), {
  ssr: false,
})

// Loading component for dynamic imports
const ComponentLoader = () => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin-slow"></div>
      <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-primary border-l-transparent animate-spin-slower"></div>
    </div>
    <p className="text-foreground/70 animate-pulse">Loading component...</p>
  </div>
)

// Dynamically import components for better performance
const Introduction = dynamic(() => import("./components/Introduction"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const ThemeSelector = dynamic(() => import("./components/ThemeSelector"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const VolumeControl = dynamic(() => import("./components/VolumeControl"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const EmergencyContacts = dynamic(() => import("./components/EmergencyContacts"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const NaloxoneSetup = dynamic(() => import("./components/NaloxoneSetup"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const HeroMode = dynamic(() => import("./components/HeroMode"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const EndUserAgreement = dynamic(() => import("./components/EndUserAgreement"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const MyChartIntegration = dynamic(() => import("./components/MyChartIntegration"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const Tutorial = dynamic(() => import("./components/Tutorial"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})
const VRTraining = dynamic(() => import("./components/VRTraining"), {
  loading: () => <ComponentLoader />,
  ssr: false,
})

export default function NarcoguardSetup() {
  const [step, setStep] = useState(0)
  const [volume, setVolume] = useState(50)
  const [agreed, setAgreed] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const speakGuardianAI = (text: string) => {
    if (!isMuted && "speechSynthesis" in window) {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
      sentences.forEach((sentence, index) => {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(sentence.trim())
          utterance.volume = volume / 100
          window.speechSynthesis.speak(utterance)
        }, index * 1000)
      })
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const steps = [
    { component: <Introduction speak={speakGuardianAI} />, title: "Welcome to Narcoguard" },
    { component: <ThemeSelector speak={speakGuardianAI} />, title: "Choose Your Theme" },
    {
      component: <VolumeControl volume={volume} setVolume={setVolume} speak={speakGuardianAI} />,
      title: "Adjust Volume",
    },
    { component: <EmergencyContacts speak={speakGuardianAI} />, title: "Set Up Emergency Contacts" },
    { component: <NaloxoneSetup speak={speakGuardianAI} />, title: "Naloxone Setup" },
    { component: <HeroMode speak={speakGuardianAI} />, title: "Hero Mode" },
    { component: <MyChartIntegration speak={speakGuardianAI} />, title: "MyChart Integration" },
    { component: <Tutorial speak={speakGuardianAI} />, title: "Naloxone and CPR Tutorial" },
    { component: <VRTraining />, title: "VR Training Simulator" },
    {
      component: <EndUserAgreement agreed={agreed} setAgreed={setAgreed} speak={speakGuardianAI} />,
      title: "End User Agreement",
    },
  ]

  const nextStep = useCallback(() => {
    if (step < steps.length - 1) {
      setIsLoading(true)
      setStep(step + 1)
      setTimeout(() => setIsLoading(false), 500) // Simulating load time
    }
  }, [step, steps.length])

  const prevStep = useCallback(() => {
    if (step > 0) {
      setIsLoading(true)
      setStep(step - 1)
      setTimeout(() => setIsLoading(false), 500) // Simulating load time
    }
  }, [step])

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
  }, [isMuted])

  const toggleHelp = useCallback(() => {
    setShowHelp(!showHelp)
  }, [showHelp])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-500">
          <Suspense fallback={<div>Loading background...</div>}>
            <BackgroundAnimation />
          </Suspense>

          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground p-2 z-50"
          >
            Skip to main content
          </a>

          {/* Emergency banner */}
          <motion.div
            className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 p-2 text-white text-center z-50 shadow-lg"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="flex justify-center items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="tel:1-800-484-3731"
                    className="flex items-center hover:scale-105 transition-transform duration-300"
                  >
                    <AlertTriangle className="w-6 h-6 mr-2 animate-pulse" />
                    <span className="font-bold text-lg">Never Use Alone: 1-800-484-3731</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Call this hotline if you're using alone. They'll check on you and send help if needed.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </motion.div>

          {/* Floating controls */}
          <div className="fixed top-20 right-4 z-40 flex flex-col space-y-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className="p-3 rounded-full glass-card pulse-glow flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-foreground" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-foreground" />
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"} voice guidance</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className="p-3 rounded-full glass-card pulse-glow flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleHelp}
                >
                  <HelpCircle className="w-6 h-6 text-foreground" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Information</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <ErrorBoundary
            fallback={
              <div className="container mx-auto p-4 text-center">
                <Card className="max-w-md mx-auto glass-card">
                  <CardHeader>
                    <CardTitle>Something went wrong</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      We're sorry, but there was an error loading this page. Please try refreshing the page or contact
                      support if the issue persists.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                  </CardFooter>
                </Card>
              </div>
            }
          >
            <main id="main-content" className="relative z-10 container mx-auto p-4 pt-24">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="w-full max-w-4xl mx-auto overflow-hidden glass-card shadow-2xl transition-all duration-500">
                  <CardHeader className="relative">
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    <CardTitle className="text-4xl font-bold text-center relative z-10 gradient-text-primary">
                      <motion.div
                        className="inline-block mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8" />
                      </motion.div>
                      {steps[step].title}
                    </CardTitle>
                    <CardDescription className="text-center relative z-10 text-lg">
                      Narcoguard: Prequel to the Life-Saving Wearable
                    </CardDescription>
                    <ProgressTracker currentStep={step} totalSteps={steps.length} />
                  </CardHeader>
                  <CardContent className="p-6">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/20 p-4 rounded-md flex items-center mb-6"
                        role="alert"
                      >
                        <AlertTriangle className="mr-2 text-red-500" />
                        <p>An error occurred: {error}</p>
                      </motion.div>
                    )}

                    {isLoading ? (
                      <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <motion.div
                          className="relative w-24 h-24"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"></div>
                          <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent"></div>
                          <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent"></div>
                        </motion.div>
                        <p className="text-foreground/70 animate-pulse">Loading next step...</p>
                      </div>
                    ) : (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.5 }}
                          className="min-h-[400px]"
                        >
                          {steps[step].component}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={prevStep}
                        disabled={step === 0 || error !== null || isLoading}
                        className="btn-glow relative overflow-hidden group bg-primary/80 text-primary-foreground hover:bg-primary border border-primary/50 rounded-full px-6 py-2 transition-all duration-300"
                        aria-label="Previous step"
                      >
                        <span className="relative z-10 flex items-center">
                          <ChevronLeft className="mr-2" />
                          Previous
                        </span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={nextStep}
                        disabled={
                          step === steps.length - 1 ||
                          (step === steps.length - 1 && !agreed) ||
                          error !== null ||
                          isLoading
                        }
                        className="btn-glow relative overflow-hidden group bg-primary/80 hover:bg-primary text-primary-foreground border border-primary/50 rounded-full px-6 py-2 transition-all duration-300"
                        aria-label="Next step"
                      >
                        <span className="relative z-10 flex items-center">
                          {step === steps.length - 1 ? "Finish" : "Next"}
                          <ChevronRight className="ml-2" />
                        </span>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Help modal */}
              <AnimatePresence>
                {showHelp && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={toggleHelp}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-card text-card-foreground rounded-lg shadow-xl max-w-2xl w-full p-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-2xl font-bold mb-4 gradient-text-primary">Narcoguard Help</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">What is Narcoguard?</h3>
                          <p>
                            Narcoguard is a prequel to the revolutionary Narcoguard 2 smartwatch, designed to help
                            prevent opioid overdose deaths through early detection and intervention.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">How to use this setup wizard</h3>
                          <p>
                            Navigate through the steps using the Next and Previous buttons. Each step will guide you
                            through setting up different aspects of Narcoguard.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Voice Guidance</h3>
                          <p>
                            Narcoguard features voice guidance to help you through the setup process. You can mute or
                            adjust the volume using the controls provided.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Emergency Resources</h3>
                          <p>
                            If you or someone you know is experiencing an overdose, call 911 immediately. For support
                            when using alone, call the Never Use Alone hotline at 1-800-484-3731.
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Button onClick={toggleHelp}>Close Help</Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 text-center text-sm text-foreground/70"
              >
                <p>© 2025 Narcoguard. Created by Stephen Blanford, inspired by family and friends.</p>
                <p className="mt-1">
                  Narcoguard is a life-saving technology designed to prevent opioid overdose deaths.
                </p>
              </motion.footer>
            </main>
          </ErrorBoundary>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}
