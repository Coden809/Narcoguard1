"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, DollarSign, Coffee, Gift, Building, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logDonationEvent } from "@/lib/analytics"

interface DonationSectionProps {
  className?: string
  compact?: boolean
}

export default function DonationSection({ className, compact = false }: DonationSectionProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [donationType, setDonationType] = useState<"individual" | "organization" | "grant">("individual")

  const donationAmounts = [
    { value: 5, label: "$5", icon: Coffee, description: "Buy us a coffee" },
    { value: 25, label: "$25", icon: Gift, description: "Support development" },
    { value: 50, label: "$50", icon: Heart, description: "Help save lives" },
    { value: 100, label: "$100", icon: DollarSign, description: "Fund our mission" },
  ]

  const handleDonate = (amount: number | null) => {
    const paypalEmail = "stephenblanford1@gmail.com"
    const donationAmount = amount || 5

    // Log the donation event
    try {
      logDonationEvent(
        donationAmount,
        "USD",
        "one-time",
        donationType === "individual"
          ? "website-individual"
          : donationType === "organization"
            ? "website-organization"
            : "website-grant",
      )
    } catch (error) {
      console.error("Failed to log donation event:", error)
    }

    // Create donation URL based on type
    let donationUrl = ""

    if (donationType === "individual" || donationType === "organization") {
      // For individuals and organizations, use PayPal
      donationUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(paypalEmail)}&amount=${donationAmount}&currency_code=USD`
    } else {
      // For grants, open the grant application page
      donationUrl = "/grants"
    }

    window.open(donationUrl, "_blank")
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Support Our Mission
          </CardTitle>
          <CardDescription>Help us save lives with your donation</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm mb-4">
            Your contribution helps fund the development of our life-saving technology, including the Narcoguard 2
            auto-injecting smartwatch.
          </p>
          <div className="flex flex-wrap gap-2">
            {donationAmounts.map((amount) => (
              <Button
                key={amount.value}
                variant={selectedAmount === amount.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAmount(amount.value)}
                className="flex-1"
              >
                {amount.label}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => handleDonate(selectedAmount)}>
            <Heart className="mr-2 h-4 w-4" />
            Donate Now
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your donations help us develop life-saving technology and make it accessible to those who need it most.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Help Fund Narcoguard's Future</CardTitle>
              <CardDescription>
                We're developing revolutionary technology to prevent overdose deaths, and we need your support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="individual" onValueChange={(value) => setDonationType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="individual" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Individual</span>
                  </TabsTrigger>
                  <TabsTrigger value="organization" className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Organization</span>
                  </TabsTrigger>
                  <TabsTrigger value="grant" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Grants</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="individual">
                  <div className="space-y-6">
                    <p>
                      Narcoguard is on a mission to save lives through innovative technology. Our upcoming Narcoguard 2
                      smartwatch with auto-injecting naloxone technology represents a breakthrough in overdose
                      prevention, but we need funding to make it a reality.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Your donation will help us:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Complete development of the Narcoguard 2 smartwatch
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Expand the Hero Network to more communities
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Provide free naloxone to those who can't afford it
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Conduct research on overdose prevention technology
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Make our technology accessible to underserved communities
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Choose an amount</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {donationAmounts.map((amount) => (
                            <motion.div key={amount.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant={selectedAmount === amount.value ? "default" : "outline"}
                                className="w-full h-20 flex flex-col items-center justify-center"
                                onClick={() => setSelectedAmount(amount.value)}
                              >
                                <amount.icon className="mb-1 h-5 w-5" />
                                <span className="font-bold">{amount.label}</span>
                                <span className="text-xs">{amount.description}</span>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                        <Button size="lg" className="w-full" onClick={() => handleDonate(selectedAmount)}>
                          <Heart className="mr-2 h-5 w-5" />
                          Donate Now via PayPal
                        </Button>
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          Secure payment processed by PayPal
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="organization">
                  <div className="space-y-6">
                    <p>
                      Organizations can make a significant impact in the fight against overdose deaths. Your corporate
                      donation or sponsorship helps us scale our technology and reach more people in need.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Benefits for organizations:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Recognition on our website and marketing materials
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Tax deductions for charitable contributions
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Corporate social responsibility showcase
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Potential for co-branded initiatives
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Employee engagement opportunities
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Organizational Support</h3>
                        <p className="mb-4">
                          For organizations interested in supporting our mission, we offer various sponsorship levels:
                        </p>
                        <div className="space-y-3 mb-6">
                          <Button
                            variant={selectedAmount === 500 ? "default" : "outline"}
                            className="w-full justify-between"
                            onClick={() => setSelectedAmount(500)}
                          >
                            <span>Bronze Sponsor</span>
                            <span>$500</span>
                          </Button>
                          <Button
                            variant={selectedAmount === 1000 ? "default" : "outline"}
                            className="w-full justify-between"
                            onClick={() => setSelectedAmount(1000)}
                          >
                            <span>Silver Sponsor</span>
                            <span>$1,000</span>
                          </Button>
                          <Button
                            variant={selectedAmount === 5000 ? "default" : "outline"}
                            className="w-full justify-between"
                            onClick={() => setSelectedAmount(5000)}
                          >
                            <span>Gold Sponsor</span>
                            <span>$5,000</span>
                          </Button>
                          <Button
                            variant={selectedAmount === 10000 ? "default" : "outline"}
                            className="w-full justify-between"
                            onClick={() => setSelectedAmount(10000)}
                          >
                            <span>Platinum Sponsor</span>
                            <span>$10,000</span>
                          </Button>
                        </div>
                        <Button size="lg" className="w-full" onClick={() => handleDonate(selectedAmount)}>
                          <Building className="mr-2 h-5 w-5" />
                          Become a Sponsor
                        </Button>
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          For custom sponsorship packages, please contact us directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="grant">
                  <div className="space-y-6">
                    <p>
                      Narcoguard is actively seeking grant funding to accelerate our research and development of
                      life-saving technology. We welcome partnerships with foundations, government agencies, and other
                      grant-making organizations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Current funding priorities:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            R&D for Narcoguard 2 auto-injecting smartwatch
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Clinical trials and FDA approval process
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Hero Network expansion to rural communities
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            AI algorithm development for overdose detection
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            Community outreach and education programs
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Grant Opportunities</h3>
                        <p className="mb-4">
                          We're seeking partnerships with foundations and grant-making organizations that share our
                          commitment to preventing overdose deaths.
                        </p>
                        <div className="space-y-4">
                          <div className="p-4 bg-background rounded-lg">
                            <h4 className="font-medium">Grant Application Process</h4>
                            <p className="text-sm mt-2">
                              We welcome inquiries from potential funders. Our team can provide detailed proposals,
                              budgets, and impact assessments.
                            </p>
                          </div>
                          <div className="p-4 bg-background rounded-lg">
                            <h4 className="font-medium">Current Grant Needs</h4>
                            <p className="text-sm mt-2">
                              We're currently seeking funding in the range of $50,000 to $500,000 for various stages of
                              our technology development.
                            </p>
                          </div>
                        </div>
                        <Button size="lg" className="w-full mt-6" onClick={() => handleDonate(null)}>
                          <Briefcase className="mr-2 h-5 w-5" />
                          Contact Our Grants Team
                        </Button>
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          For detailed information about our grant opportunities, please email grants@narcoguard.com
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
