"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ARButton, XR, Controllers, Hands, useXR } from "@react-three/xr"
import { OrbitControls, useGLTF, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsService, AnalyticsEventType } from "@/lib/analytics-service"
import type * as THREE from "three"

// Define the steps for naloxone administration
const NALOXONE_STEPS = [
  {
    id: "check-response",
    title: "Check Response",
    description: "Check if the person is responsive by calling their name and shaking their shoulders.",
    modelPosition: [0, 0, -0.5],
    annotation: "Shake shoulders gently",
  },
  {
    id: "call-help",
    title: "Call for Help",
    description: "Call 911 immediately. Tell them someone is unresponsive and not breathing.",
    modelPosition: [0, 0, -0.5],
    annotation: "Call 911",
  },
  {
    id: "prepare-naloxone",
    title: "Prepare Naloxone",
    description: "Remove the naloxone device from its packaging.",
    modelPosition: [0, 0, -0.3],
    annotation: "Remove from package",
  },
  {
    id: "administer-naloxone",
    title: "Administer Naloxone",
    description: "For nasal spray: Insert the nozzle into one nostril and press the plunger firmly.",
    modelPosition: [0, 0, -0.2],
    annotation: "Insert and press firmly",
  },
  {
    id: "recovery-position",
    title: "Recovery Position",
    description: "Place the person in the recovery position (on their side) to prevent choking.",
    modelPosition: [0, 0, -0.4],
    annotation: "Roll onto side",
  },
  {
    id: "monitor",
    title: "Monitor",
    description:
      "Monitor the person's breathing and be prepared to administer another dose if needed after 2-3 minutes.",
    modelPosition: [0, 0, -0.5],
    annotation: "Watch breathing",
  },
]

// 3D Model component
function NaloxoneModel({ step, position }: { step: (typeof NALOXONE_STEPS)[0]; position: [number, number, number] }) {
  const { scene } = useGLTF("/models/naloxone.glb")
  const modelRef = useRef<THREE.Group>(null)
  const { isPresenting } = useXR()

  // Animate the model
  useFrame((state) => {
    if (modelRef.current) {
      if (!isPresenting) {
        // Only rotate in non-AR mode
        modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
      }
    }
  })

  return (
    <group position={position}>
      <primitive ref={modelRef} object={scene.clone()} scale={0.5} />
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {step.annotation}
      </Text>
    </group>
  )
}

// AR Scene component
function ARScene({ currentStep }: { currentStep: number }) {
  const step = NALOXONE_STEPS[currentStep]
  const { isPresenting } = useXR()

  return (
    <>
      {isPresenting ? (
        // AR mode content
        <group>
          <NaloxoneModel step={step} position={step.modelPosition} />
          <Text
            position={[0, -0.3, -0.5]}
            fontSize={0.05}
            color="#ffffff"
            maxWidth={0.8}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.004}
            outlineColor="#000000"
          >
            {step.title}: {step.description}
          </Text>
        </group>
      ) : (
        // Non-AR preview content
        <group>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <NaloxoneModel step={step} position={[0, 0, 0]} />
          <OrbitControls />
        </group>
      )}
    </>
  )
}

// Main AR Naloxone Guide component
export default function ARNaloxoneGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [arSupported, setArSupported] = useState(false)
  const [arMode, setArMode] = useState(false)

  // Check if AR is supported
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        const isSupported = "xr" in navigator && (await (navigator as any).xr?.isSessionSupported("immersive-ar"))
        setArSupported(isSupported)
      } catch (error) {
        console.error("Error checking AR support:", error)
        setArSupported(false)
      }
    }

    checkARSupport()
  }, [])

  // Track step changes
  useEffect(() => {
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.FEATURE_USAGE,
      properties: {
        featureName: "ar-naloxone-guide",
        action: "view-step",
        stepId: NALOXONE_STEPS[currentStep].id,
        stepNumber: currentStep + 1,
      },
    })
  }, [currentStep])

  // Handle AR session start
  const handleARStart = () => {
    setArMode(true)
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.FEATURE_USAGE,
      properties: {
        featureName: "ar-naloxone-guide",
        action: "start-ar-session",
      },
    })
  }

  // Handle AR session end
  const handleAREnd = () => {
    setArMode(false)
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.FEATURE_USAGE,
      properties: {
        featureName: "ar-naloxone-guide",
        action: "end-ar-session",
      },
    })
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < NALOXONE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Naloxone Administration Guide</CardTitle>
          <CardDescription>
            Follow these steps to administer naloxone in case of a suspected opioid overdose.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">AR Guide</TabsTrigger>
              <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
            </TabsList>
            <TabsContent value="ar" className="space-y-4">
              <div className="relative w-full h-[400px] bg-muted rounded-md overflow-hidden">
                <Canvas>
                  <XR onSessionStart={handleARStart} onSessionEnd={handleAREnd}>
                    <ARScene currentStep={currentStep} />
                    <Controllers />
                    <Hands />
                  </XR>
                </Canvas>
                {arSupported && !arMode && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <ARButton className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                      Start AR Experience
                    </ARButton>
                  </div>
                )}
                {!arSupported && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center">
                    <div>
                      <p className="text-lg font-bold mb-2">AR Not Supported</p>
                      <p>Your device doesn't support AR experiences. You can still follow the step-by-step guide.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={prevStep} disabled={currentStep === 0}>
                  Previous Step
                </Button>
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {NALOXONE_STEPS.length}
                </span>
                <Button onClick={nextStep} disabled={currentStep === NALOXONE_STEPS.length - 1}>
                  Next Step
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="steps">
              <div className="space-y-4">
                {NALOXONE_STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 border rounded-md ${
                      currentStep === index ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <h3 className="font-medium text-lg mb-1">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Always call 911 first in case of a suspected overdose. Naloxone is a temporary
            treatment and medical attention is still required.
          </p>
          <p className="text-sm text-muted-foreground">
            This guide is for educational purposes. Please receive proper training before administering naloxone.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
