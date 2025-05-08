import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Lightbulb, Users, Shield } from "lucide-react"
import { SmartWatchShowcase } from "@/components/smartwatch-showcase"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Donate to Narcoguard | Support Our Mission",
  description:
    "Support Narcoguard's mission to prevent overdose fatalities and help people recover from addiction through your generous donation.",
}

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Support Our Mission</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Your donation helps us save lives and support recovery
          </p>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-2" /> Why We Need Your Support
              </CardTitle>
              <CardDescription>Help us develop life-saving technology and expand our support network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Narcoguard is a non-profit initiative focused on preventing overdose fatalities and supporting recovery.
                Your donation directly funds:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Lightbulb className="h-10 w-10 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Technology Development</h3>
                  <p className="text-sm">
                    Funding the development of the Narcoguard 2 smartwatch and improving our overdose detection
                    algorithms.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Users className="h-10 w-10 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Community Support</h3>
                  <p className="text-sm">
                    Building and maintaining our network of volunteers, recovery coaches, and support resources.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Shield className="h-10 w-10 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Education & Prevention</h3>
                  <p className="text-sm">
                    Creating educational resources and prevention programs to reduce overdose risk and promote recovery.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                  <Heart className="h-10 w-10 text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Direct Assistance</h3>
                  <p className="text-sm">
                    Providing direct support to individuals in recovery, including access to our technology for those
                    who cannot afford it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Narcoguard 2 Showcase */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Support Narcoguard 2 Development</h2>
            <SmartWatchShowcase className="bg-muted/20 rounded-xl" />
          </div>

          {/* Donation Options */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Make a Donation</CardTitle>
              <CardDescription>Choose how you'd like to support our mission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
                <h3 className="text-xl font-semibold mb-6">Donate via PayPal</h3>
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
                <p className="text-sm text-muted-foreground mt-6">
                  For questions about donations, please contact us at narcoguard607@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Impact</CardTitle>
              <CardDescription>See how your donation makes a difference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="individual">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="individual">$25</TabsTrigger>
                  <TabsTrigger value="supporter">$50</TabsTrigger>
                  <TabsTrigger value="champion">$100+</TabsTrigger>
                </TabsList>
                <TabsContent value="individual" className="p-4 bg-muted/20 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Individual Supporter</h3>
                  <p className="mb-4">Your $25 donation can:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Provide educational materials to 5 at-risk individuals
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Support our app development for one day
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="supporter" className="p-4 bg-muted/20 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Community Supporter</h3>
                  <p className="mb-4">Your $50 donation can:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Train a volunteer for our Hero Network
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Contribute to Narcoguard 2 smartwatch development
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="champion" className="p-4 bg-muted/20 rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">Life-Saving Champion</h3>
                  <p className="mb-4">Your $100+ donation can:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Provide a Narcoguard device to someone who cannot afford one
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Fund a community training session on overdose prevention
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Support significant development of the Narcoguard 2 smartwatch
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
