import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Bell, MapPin, Heart } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">How Narcoguard Works</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">The Narcoguard System</h2>
            <p className="text-lg mb-6">
              Narcoguard combines advanced technology with community response to create a comprehensive overdose
              prevention system. Here's how it works:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Overdose Detection</h3>
                <p>Advanced algorithms detect signs of overdose through wearable devices and smartphone sensors.</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Automatic Alerts</h3>
                <p>When an overdose is detected, the system sends immediate notifications to emergency contacts.</p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Location Sharing</h3>
                <p>
                  The system automatically shares the user's precise location with emergency responders and trusted
                  contacts.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">4. Hero Network Response</h3>
                <p>
                  Nearby volunteers from the Hero Network are notified and can provide immediate assistance with
                  naloxone.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">The Technology Behind Narcoguard</h2>
            <p className="text-lg mb-4">
              Narcoguard uses a combination of hardware and software technologies to detect and respond to overdoses:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mb-6">
              <li>Wearable sensors that monitor vital signs</li>
              <li>AI algorithms that can identify patterns indicative of an overdose</li>
              <li>GPS and location services for precise positioning</li>
              <li>Secure cloud infrastructure for data processing and storage</li>
              <li>Mobile apps for iOS, Android, and web platforms</li>
              <li>Encrypted communication channels for emergency notifications</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Narcoguard 2: The Future</h2>

            {/* Add the smartwatch image */}
            <div className="relative max-w-md mx-auto my-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-k6JStmuwmmCik2yBhc2UbzeWHnQFRF.png"
                alt="Narcoguard 2 Smartwatch"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <p className="text-lg font-bold">Coming Soon: Narcoguard 2</p>
                <p className="text-sm">The world's first naloxone auto-injecting smartwatch</p>
              </div>
            </div>

            <p className="text-lg mb-4">
              Our upcoming Narcoguard 2 smartwatch represents a revolutionary leap in overdose prevention technology.
              This cutting-edge device combines sophisticated vital sign monitoring with an innovative naloxone
              auto-injector system.
            </p>

            <ul className="list-disc list-inside space-y-2 text-lg mb-6">
              <li>Built-in naloxone auto-injector technology for immediate response</li>
              <li>Advanced vital sign monitoring with AI-powered detection</li>
              <li>Extended battery life ensuring 24/7 protection</li>
              <li>Enhanced water and impact resistance for durability</li>
              <li>Seamless integration with emergency services</li>
              <li>Real-time connection to the Hero Network</li>
            </ul>

            <div className="bg-muted p-6 rounded-lg mt-6">
              <h3 className="text-xl font-bold mb-2">How the Auto-Injector Works</h3>
              <p className="text-lg mb-4">
                When Narcoguard 2 detects signs of an overdose through its advanced sensors, it immediately begins a
                rapid response sequence:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-lg">
                <li>Vital sign monitoring detects overdose indicators</li>
                <li>AI confirmation of overdose status</li>
                <li>Brief countdown with haptic warning</li>
                <li>Automatic deployment of naloxone</li>
                <li>Immediate alert to emergency services</li>
                <li>Notification to emergency contacts</li>
              </ol>
            </div>
          </section>

          <div className="flex justify-center mt-8">
            <Button asChild size="lg">
              <Link href="/download">Download Narcoguard</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
