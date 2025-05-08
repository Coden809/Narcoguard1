import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Clock, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DonationComponent } from "@/components/donation-component"
import { SmartWatchShowcase } from "@/components/smartwatch-showcase"
import { BackgroundAnimation } from "@/components/BackgroundAnimation"
import { SplashScreen } from "@/components/splash-screen"
import { HeroBanner } from "@/components/hero-banner"
import { GuardianStories } from "@/components/guardian-stories"

export const metadata: Metadata = {
  title: "Narcoguard | Preventing Overdose Fatalities",
  description:
    "Narcoguard is a life-saving application designed to prevent overdose fatalities and help people recover from addiction.",
}

export default function HomePage() {
  return (
    <>
      <SplashScreen />
      <Navbar />
      <div className="relative">
        <BackgroundAnimation className="absolute inset-0 z-0" />
        <main className="relative z-10">
          {/* Hero Banner */}
          <HeroBanner />

          {/* Smartwatch Showcase */}
          <SmartWatchShowcase />

          {/* Features Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 gradient-text">How Narcoguard Saves Lives</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-narcoguard-purple mb-4" />
                    <CardTitle>Early Detection</CardTitle>
                    <CardDescription>Monitors vital signs to detect signs of an overdose</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Our wearable devices and smartphone app use advanced algorithms to detect the early signs of an
                    overdose, allowing for timely intervention.
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Clock className="h-12 w-12 text-narcoguard-blue mb-4" />
                    <CardTitle>Rapid Response</CardTitle>
                    <CardDescription>Automatically alerts emergency contacts and services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    When an overdose is detected, Narcoguard immediately alerts designated emergency contacts, nearby
                    volunteers, and emergency services.
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Users className="h-12 w-12 text-narcoguard-pink mb-4" />
                    <CardTitle>Community Support</CardTitle>
                    <CardDescription>Connects users with a network of support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Beyond emergency response, Narcoguard connects users with a community of volunteers, recovery
                    coaches, and healthcare professionals.
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Guardian Stories Section */}
          <GuardianStories />

          {/* Donation Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-2 gradient-text">Support Our Mission</h2>
              <p className="text-center text-muted-foreground mb-8">
                Your donation helps us develop life-saving technology and support those in recovery
              </p>
              <DonationComponent />
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 px-4 bg-gradient-to-br from-narcoguard-purple/10 to-narcoguard-pink/10">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Join the Hero Network</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Become a volunteer and help save lives in your community. Our Hero Network connects those in need with
                nearby volunteers who can provide immediate assistance.
              </p>
              <Button asChild size="lg" className="bg-narcoguard-purple hover:bg-narcoguard-purple/90">
                <Link href="/hero-network">
                  Join Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  )
}
