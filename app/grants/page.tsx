import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, FileText, Users, Microscope, Award, Download } from "lucide-react"
import Link from "next/link"
import GrantOpportunities from "@/components/grant-opportunities"

export default function GrantsPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Grant & Funding Opportunities</h1>

          <p className="text-lg mb-8">
            Narcoguard is seeking partnerships with foundations, government agencies, and other grant-making
            organizations to accelerate our mission of preventing overdose deaths through innovative technology.
          </p>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Our Grant Program</CardTitle>
                  <CardDescription>
                    Learn about our funding needs and how your organization can help save lives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>
                    Narcoguard is a non-profit initiative dedicated to preventing overdose deaths through innovative
                    technology. Our flagship project, the Narcoguard 2 auto-injecting smartwatch, represents a
                    revolutionary approach to overdose intervention that could save thousands of lives.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary" />
                        Our Impact
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          500+ lives saved through our current technology
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          10,000+ active users protected by our monitoring system
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          2,500+ volunteers in our Hero Network
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          45+ cities with Narcoguard coverage
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Briefcase className="mr-2 h-5 w-5 text-primary" />
                        Funding Needs
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          $250,000 for Narcoguard 2 prototype development
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          $150,000 for clinical trials and testing
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          $100,000 for FDA approval process
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-green-500">✓</span>
                          $75,000 for Hero Network expansion
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Why Fund Narcoguard?</h3>
                    <p className="mb-4">
                      The opioid crisis continues to claim over 130 lives daily in the United States alone. Traditional
                      approaches have not been sufficient to address this epidemic. Narcoguard's innovative technology
                      represents a paradigm shift in overdose prevention:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Our technology provides immediate intervention at the critical moment of overdose
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        We combine hardware, software, and community response for a comprehensive solution
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Our approach is scalable and can be deployed nationwide
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        We have a proven track record of saving lives with our current technology
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href="mailto:grants@narcoguard.com">Contact Our Grants Team</a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects Seeking Funding</CardTitle>
                  <CardDescription>Explore our innovative initiatives that need financial support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-primary text-primary-foreground p-4">
                      <h3 className="text-xl font-semibold">Narcoguard 2 Smartwatch</h3>
                      <p className="text-sm opacity-90">Flagship Project • Seeking $500,000</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <p>
                        The world's first naloxone auto-injecting smartwatch that can detect overdose and automatically
                        administer life-saving medication.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Features</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Advanced vital sign monitoring</li>
                            <li>• AI-powered overdose detection</li>
                            <li>• Automatic naloxone injection</li>
                            <li>• Emergency contact notification</li>
                            <li>• GPS location sharing</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Funding Allocation</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• R&D: $250,000</li>
                            <li>• Clinical Trials: $150,000</li>
                            <li>• FDA Approval: $100,000</li>
                          </ul>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <a href="/files/narcoguard2-proposal.pdf" download>
                          <FileText className="mr-2 h-4 w-4" />
                          Download Full Proposal
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-secondary text-secondary-foreground p-4">
                        <h3 className="text-lg font-semibold">Hero Network Expansion</h3>
                        <p className="text-sm opacity-90">Community Project • Seeking $75,000</p>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm">
                          Expanding our network of naloxone-carrying volunteers to rural and underserved communities.
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <a href="/files/hero-network-proposal.pdf" download>
                            <Users className="mr-2 h-4 w-4" />
                            View Details
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-secondary text-secondary-foreground p-4">
                        <h3 className="text-lg font-semibold">AI Algorithm Research</h3>
                        <p className="text-sm opacity-90">Research Project • Seeking $125,000</p>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm">
                          Developing advanced machine learning algorithms to improve overdose detection accuracy.
                        </p>
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <a href="/files/ai-research-proposal.pdf" download>
                            <Microscope className="mr-2 h-4 w-4" />
                            View Details
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grant Application Process</CardTitle>
                  <CardDescription>Learn how to apply for funding and what to expect</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-muted p-6 rounded-lg">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">Initial Contact</h3>
                      <p className="text-sm">
                        Reach out to our grants team to discuss your interest in funding Narcoguard.
                      </p>
                    </div>

                    <div className="bg-muted p-6 rounded-lg">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">Proposal Review</h3>
                      <p className="text-sm">
                        We'll provide detailed proposals and budgets for your organization to review.
                      </p>
                    </div>

                    <div className="bg-muted p-6 rounded-lg">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">Partnership</h3>
                      <p className="text-sm">
                        Once approved, we'll establish a formal partnership with clear milestones and reporting.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">What We Provide to Funders</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Detailed project proposals with clear objectives and timelines
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Comprehensive budgets with allocation breakdowns
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Regular progress reports and milestone updates
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Impact assessments and outcome measurements
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Recognition in publications, website, and marketing materials
                      </li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Eligibility Requirements</h3>
                    <p className="mb-4">We welcome funding from a variety of sources, including:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Private foundations and philanthropic organizations
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Government agencies and departments
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Corporate foundations and CSR programs
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Impact investors and venture philanthropists
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href="mailto:grants@narcoguard.com">Start the Application Process</a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resources for Grant Applicants</CardTitle>
                  <CardDescription>Download materials to support your funding decision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4">Downloadable Resources</h3>
                      <ul className="space-y-4">
                        <li>
                          <Button asChild variant="outline" className="w-full justify-between">
                            <a href="/files/narcoguard-overview.pdf" download>
                              <span className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Organization Overview
                              </span>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </li>
                        <li>
                          <Button asChild variant="outline" className="w-full justify-between">
                            <a href="/files/narcoguard2-proposal.pdf" download>
                              <span className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Narcoguard 2 Full Proposal
                              </span>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </li>
                        <li>
                          <Button asChild variant="outline" className="w-full justify-between">
                            <a href="/files/budget-template.xlsx" download>
                              <span className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Budget Template
                              </span>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </li>
                        <li>
                          <Button asChild variant="outline" className="w-full justify-between">
                            <a href="/files/impact-report.pdf" download>
                              <span className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Impact Report 2023
                              </span>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Grants Team</h4>
                          <p className="text-sm mt-1">
                            Email: grants@narcoguard.com
                            <br />
                            Phone: (800) 555-1234 ext. 2
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Executive Director</h4>
                          <p className="text-sm mt-1">
                            Stephen Blanford
                            <br />
                            Email: stephen@narcoguard.com
                            <br />
                            Phone: (800) 555-1234 ext. 1
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Mailing Address</h4>
                          <p className="text-sm mt-1">
                            Narcoguard Foundation
                            <br />
                            123 Innovation Way
                            <br />
                            San Francisco, CA 94107
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Our Fiscal Sponsorship</h3>
                    <p className="mb-4">
                      Narcoguard operates under the fiscal sponsorship of the Health Innovation Foundation, a 501(c)(3)
                      non-profit organization. All donations are tax-deductible to the extent allowed by law.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Tax Information</h4>
                        <p className="text-sm">
                          EIN: 12-3456789
                          <br />
                          Tax Determination Letter available upon request
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Financial Reports</h4>
                        <p className="text-sm">Annual reports and financial statements available upon request</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Request Additional Information</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="opportunities" className="mt-6">
              <GrantOpportunities />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
