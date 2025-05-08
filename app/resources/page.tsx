import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Video, ExternalLink, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Resources</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Naloxone Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Naloxone Administration Guide
                  </CardTitle>
                  <CardDescription>Step-by-step instructions for administering naloxone</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Learn how to properly administer naloxone in case of an opioid overdose. This guide covers both
                    nasal spray and injectable forms.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/guides/naloxone">View Guide</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Naloxone Training Video
                  </CardTitle>
                  <CardDescription>Visual demonstration of naloxone administration</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Watch our comprehensive training video that demonstrates how to recognize an overdose and administer
                    naloxone properly.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/videos/naloxone-training">Watch Video</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Overdose Recognition</h2>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Signs of Opioid Overdose
                </CardTitle>
                <CardDescription>How to recognize an opioid overdose</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Common signs of an opioid overdose include:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Unresponsiveness or unconsciousness</li>
                  <li>Slow, shallow, or stopped breathing</li>
                  <li>Blue or purple lips or fingernails</li>
                  <li>Pale, clammy skin</li>
                  <li>Pinpoint pupils</li>
                  <li>Choking or gurgling sounds</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/guides/overdose-signs">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Find Naloxone Near You</h2>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Naloxone Locator
                </CardTitle>
                <CardDescription>Find places to get naloxone in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Use our interactive map to find pharmacies, health departments, and community organizations that
                  provide naloxone, often for free or at reduced cost.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/naloxone-locator">Find Naloxone</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Helplines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <strong>SAMHSA's National Helpline:</strong> 1-800-662-HELP (4357)
                    </li>
                    <li>
                      <strong>National Suicide Prevention Lifeline:</strong> 988
                    </li>
                    <li>
                      <strong>Crisis Text Line:</strong> Text HOME to 741741
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    External Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link href="https://www.cdc.gov/opioids/" className="text-primary hover:underline">
                        CDC Opioid Overdose
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.samhsa.gov/" className="text-primary hover:underline">
                        SAMHSA
                      </Link>
                    </li>
                    <li>
                      <Link href="https://harmreduction.org/" className="text-primary hover:underline">
                        National Harm Reduction Coalition
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
