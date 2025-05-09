import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Clock, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DonationComponent } from "@/components/donation-component"
import { SmartWatchShowcase } from "@/components/smartwatch-showcase"
import { SplashScreen } from "@/components/splash-screen"
import HeroSection from "@/components/hero-section"
import { GuardianStories } from "@/components/guardian-stories"
import { PageTransition } from "@/components/page-transition"
import { NoSignIcon } from "@/components/no-sign-icon"

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
      <PageTransition>
        <div className="relative">
          {/* Replace BackgroundAnimation with static background */}
          <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-0" />

          <main className="relative z-10">
            {/* Hero Section */}
            <HeroSection />

            {/* Smartwatch Showcase */}
            <section id="content-section">
              <SmartWatchShowcase />
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-muted/30 relative overflow-hidden">
              {/* Background No Sign - Decorative */}
              <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
                <NoSignIcon size={300} animated={false} strokeWidth={6} />
              </div>

              <div className="container mx-auto relative z-10">
                <h2 className="text-3xl font-bold text-center mb-6 gradient-text">How Narcoguard Saves Lives</h2>

                <div className="flex justify-center mb-12">
                  <NoSignIcon size={180} strokeWidth={5} />
                </div>

                <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                  Our mission is to prevent overdose deaths through innovative technology, rapid response systems, and
                  community support networks.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="glass-card hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      <Shield className="h-12 w-12 text-[hsl(var(--narcoguard-purple))] mb-4" />
                      <CardTitle>Early Detection</CardTitle>
                      <CardDescription>Monitors vital signs to detect signs of an overdose</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Our wearable devices and smartphone app use advanced algorithms to detect the early signs of an
                      overdose, allowing for timely intervention.
                    </CardContent>
                  </Card>
                  <Card className="glass-card hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      <Clock className="h-12 w-12 text-[hsl(var(--narcoguard-blue))] mb-4" />
                      <CardTitle>Rapid Response</CardTitle>
                      <CardDescription>Automatically alerts emergency contacts and services</CardDescription>
                    </CardHeader>
                    <CardContent>
                      When an overdose is detected, Narcoguard immediately alerts designated emergency contacts, nearby
                      volunteers, and emergency services.
                    </CardContent>
                  </Card>
                  <Card className="glass-card hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      <Users className="h-12 w-12 text-[hsl(var(--narcoguard-pink))] mb-4" />
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

            {/* Guardian Stories Section with No Sign */}
            <GuardianStories />

            {/* Donation Section */}
            <section className="py-16 px-4 relative">
              {/* Background No Sign - Decorative */}
              <div className="absolute -left-20 top-10 opacity-10 pointer-events-none hidden md:block">
                <NoSignIcon size={200} animated={false} strokeWidth={4} />
              </div>

              <div className="container mx-auto max-w-4xl relative z-10">
                <h2 className="text-3xl font-bold text-center mb-2 gradient-text">Support Our Mission</h2>
                <p className="text-center text-muted-foreground mb-8">
                  Your donation helps us develop life-saving technology and support those in recovery
                </p>
                <DonationComponent />
              </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 bg-gradient-to-br from-[hsl(var(--narcoguard-purple))/10] to-[hsl(var(--narcoguard-pink))/10] relative">
              {/* Background No Sign - Decorative */}
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                <NoSignIcon size={250} animated={false} strokeWidth={5} />
              </div>

              <div className="container mx-auto text-center relative z-10">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Join the Hero Network</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Become a volunteer and help save lives in your community. Our Hero Network connects those in need with
                  nearby volunteers who can provide immediate assistance.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[hsl(var(--narcoguard-purple))] to-[hsl(var(--narcoguard-blue))] hover:opacity-90 transition-opacity"
                >
                  <Link href="/hero-network">
                    Join Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </section>
          </main>
        </div>
      </PageTransition>
      <Footer />
    </>
  )
}
