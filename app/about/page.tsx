import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Award, Lightbulb, Clock, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Narcoguard | Our Mission to Save Lives",
  description:
    "Learn about Narcoguard's mission to prevent overdose fatalities and help people recover from addiction through community, purpose, and support.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">About Narcoguard</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Our mission is to prevent overdose fatalities and transform lives
          </p>

          {/* Add the new image to the about page */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png"
                alt="Narcoguard Guardian"
                width={400}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg mb-4">
                Narcoguard was founded with a clear purpose: to protect individuals from the dangers of drug overdose
                and provide a safety net for those at risk.
              </p>
              <p className="text-lg">
                Our guardian angel symbolizes our commitment to watching over those who need protection, while actively
                working against the harms of drug abuse.
              </p>
            </div>
          </div>

          {/* Founder's Story */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Founder's Story</CardTitle>
              <CardDescription>A personal connection to the opioid epidemic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=192&width=192"
                      alt="Stephen Blanford"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Stephen Blanford</h3>
                  <p className="mb-4">
                    Our founder Stephen Blanford is no stranger to the opioid epidemic and all of the loss that it
                    carries with it, including loss of life and freedom. Having witnessed the devastating effects
                    firsthand, Stephen was driven to create a solution that could make a real difference.
                  </p>
                  <p>
                    It's Stephen's goal to not only prevent any overdose fatalities in the near future, but also
                    transform the lives of those saved and as many as can be reached by helping people form community
                    ties, family and friendships.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-4">
                  We believe in helping people earn an income, become financially independent, and providing support for
                  their basic necessities. Stephen has concluded that maybe a different approach towards recovery is
                  needed, and some of the most important things to breaking free from the chains of addiction are
                  founded in the "Rat Park" experiment.
                </p>
                <p>
                  This whole Narcoguard initiative isn't about money—it's about saving lives and helping people really
                  live a fulfilling life with a purpose. Even if this saves one life, then it is worth it, because every
                  life is priceless.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Our Mission */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription>Saving lives and transforming communities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Heart className="h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Prevent Overdose Fatalities</h3>
                  <p>
                    Our primary mission is to prevent overdose deaths through early detection, timely intervention, and
                    community response.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Users className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Build Community</h3>
                  <p>
                    We help people form meaningful connections, rebuild relationships, and develop support networks
                    essential for recovery.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Award className="h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Foster Independence</h3>
                  <p>
                    We support individuals in gaining financial independence, stable housing, and sustainable
                    employment.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Lightbulb className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Innovative Approach</h3>
                  <p>
                    We're rethinking addiction recovery based on the "Rat Park" experiment, focusing on environment and
                    connection rather than just abstinence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Approach */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Approach</CardTitle>
              <CardDescription>Technology with a human touch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Narcoguard combines cutting-edge technology with compassionate human support to create a comprehensive
                solution to the opioid crisis:
              </p>
              <ul className="space-y-4 mt-4">
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Early Detection:</span> Our wearable devices and smartphone app
                    monitor vital signs to detect signs of an overdose before it becomes fatal.
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Rapid Response:</span> When an overdose is detected, our system
                    automatically alerts emergency contacts, nearby volunteers, and emergency services.
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Community Network:</span> We build networks of volunteers, recovery
                    coaches, and healthcare professionals to provide immediate and ongoing support.
                  </div>
                </li>
                <li className="flex items-start">
                  <Heart className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Holistic Recovery:</span> Beyond the immediate crisis, we connect
                    individuals with resources for housing, employment, healthcare, and community integration.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="mb-6">
              Whether you're at risk, know someone who is, or simply want to help, there's a place for you in our
              community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/download">Download Narcoguard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/donate">Support Our Work</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/hero-network">Join Hero Network</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
