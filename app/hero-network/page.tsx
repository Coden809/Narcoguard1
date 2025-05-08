import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Heart, MapPin, Clock, Users, Award } from "lucide-react"

export default function HeroNetworkPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">The Hero Network</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">What is the Hero Network?</h2>
            <p className="text-lg mb-4">
              The Hero Network is a community of volunteers trained in overdose response who have opted in to receive
              alerts about nearby emergencies. When someone experiences an overdose, nearby heroes are notified and can
              provide immediate assistance.
            </p>
            <p className="text-lg mb-4">
              Heroes are equipped with naloxone and trained in its administration, as well as basic life support
              techniques. They serve as a critical bridge between the onset of an overdose and the arrival of emergency
              medical services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Emergency Detection</h3>
                <p>Narcoguard detects a potential overdose through vital sign monitoring.</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Location Sharing</h3>
                <p>The system identifies the location of the emergency.</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hero Notification</h3>
                <p>Nearby heroes receive an alert with the location and emergency details.</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rapid Response</h3>
                <p>Heroes can respond, administer naloxone, and provide support until EMS arrives.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Become a Hero</h2>
            <p className="text-lg mb-4">Joining the Hero Network is simple. Here's what you need to do:</p>
            <ol className="list-decimal list-inside space-y-2 text-lg mb-6">
              <li>Download the Narcoguard app and create an account</li>
              <li>Complete the Hero Network training module</li>
              <li>Obtain naloxone (we can help you find free or low-cost options)</li>
              <li>Set your availability and notification preferences</li>
              <li>Respond to alerts when you're able to help</li>
            </ol>
            <p className="text-lg mb-4">
              As a Hero, you'll receive specialized training, access to resources, and become part of a community
              dedicated to saving lives.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Hero Network Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border text-center">
                <div className="mx-auto mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-1">2,500+</h3>
                <p className="font-medium">Active Heroes</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border text-center">
                <div className="mx-auto mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-1">4.2 min</h3>
                <p className="font-medium">Average Response Time</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border text-center">
                <div className="mx-auto mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-1">350+</h3>
                <p className="font-medium">Lives Saved</p>
              </div>
            </div>
          </section>

          <div className="flex justify-center mt-8">
            <Button asChild size="lg">
              <Link href="/download">Join the Hero Network</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
