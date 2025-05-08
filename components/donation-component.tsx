"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Script from "next/script"

interface DonationComponentProps {
  compact?: boolean
}

export function DonationComponent({ compact = false }: DonationComponentProps) {
  const [showPayPal, setShowPayPal] = useState(false)

  if (compact) {
    return (
      <Card className="border-2 border-primary/20 overflow-hidden">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="flex items-center text-lg">
            <Heart className="h-5 w-5 text-red-500 mr-2" /> Support Narcoguard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <p className="text-sm mb-4">
            Your donation helps us develop life-saving technology and support those in recovery.
          </p>
          <div className="flex justify-center">
            <div id="paypal-container-V93EZUSZ7GVLW"></div>
            <Script
              src="https://www.paypal.com/sdk/js?client-id=BAAXXvKchMc6hgXGX0K_flnYbAEsffbx4TlPcTV6O3epK9hFZSqkPFjKscw7FrPBNA0U81fElUFCbfcmc4&components=hosted-buttons&enable-funding=venmo&currency=USD"
              onLoad={() => {
                // @ts-ignore
                if (window.paypal && window.paypal.HostedButtons) {
                  // @ts-ignore
                  window.paypal
                    .HostedButtons({
                      hostedButtonId: "V93EZUSZ7GVLW",
                    })
                    .render("#paypal-container-V93EZUSZ7GVLW")
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-2" /> Support Our Mission
        </CardTitle>
        <CardDescription>Help us save lives and support recovery</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="mb-6">
          Your donation directly supports our mission to prevent overdose fatalities and help people recover from
          addiction. We're developing the Narcoguard 2 smartwatch and expanding our support network.
        </p>
        <div className="flex justify-center">
          <div id="paypal-container-V93EZUSZ7GVLW"></div>
          <Script
            src="https://www.paypal.com/sdk/js?client-id=BAAXXvKchMc6hgXGX0K_flnYbAEsffbx4TlPcTV6O3epK9hFZSqkPFjKscw7FrPBNA0U81fElUFCbfcmc4&components=hosted-buttons&enable-funding=venmo&currency=USD"
            onLoad={() => {
              // @ts-ignore
              if (window.paypal && window.paypal.HostedButtons) {
                // @ts-ignore
                window.paypal
                  .HostedButtons({
                    hostedButtonId: "V93EZUSZ7GVLW",
                  })
                  .render("#paypal-container-V93EZUSZ7GVLW")
              }
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 flex flex-col items-start pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          100% of your donation goes toward our mission. Narcoguard is a non-profit initiative focused on saving lives.
        </p>
        <p className="text-xs text-muted-foreground">
          For questions about donations, please contact us at narcoguard607@gmail.com
        </p>
      </CardFooter>
    </Card>
  )
}
