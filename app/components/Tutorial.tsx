"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const tutorialSteps = [
  {
    title: "Recognizing an Overdose",
    content:
      "Look for signs such as unresponsiveness, slow or shallow breathing, blue lips or fingertips, and pinpoint pupils.",
  },
  {
    title: "Call for Help",
    content: "Immediately call 911 or your local emergency number. Every second counts in an overdose situation.",
  },
  {
    title: "Administer Naloxone",
    content:
      "If available, administer naloxone. Follow the instructions on the naloxone device. It can be given as a nasal spray or injection.",
  },
  {
    title: "Perform Rescue Breathing",
    content:
      "If the person isn't breathing, perform rescue breathing. Tilt their head back, pinch their nose, and give two quick breaths. Then give one breath every 5 seconds.",
  },
  {
    title: "Recovery Position",
    content:
      "If the person is breathing on their own, place them in the recovery position: on their side with their top leg and arm bent for support.",
  },
  {
    title: "Stay with the Person",
    content: "Remain with the person until emergency help arrives. Be prepared to give CPR if they stop breathing.",
  },
]

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">Naloxone and CPR Tutorial</h2>
      <p className="mb-4">
        This tutorial will guide you through the steps of recognizing an overdose, administering naloxone, and
        performing CPR if necessary. Remember, in a real emergency, always call for professional help immediately.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>{tutorialSteps[currentStep].title}</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {tutorialSteps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{tutorialSteps[currentStep].content}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={nextStep} disabled={currentStep === tutorialSteps.length - 1}>
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
