"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Calendar, DollarSign, Building } from "lucide-react"

interface GrantOpportunity {
  id: string
  title: string
  organization: string
  amount: string
  deadline: string
  description: string
  eligibility: string
  url: string
  category: "federal" | "foundation" | "corporate" | "state"
}

export default function GrantOpportunities() {
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<"all" | "federal" | "foundation" | "corporate" | "state">("all")

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll use sample data
    const sampleOpportunities: GrantOpportunity[] = [
      {
        id: "1",
        title: "Innovative Health Technology Grant",
        organization: "National Institutes of Health",
        amount: "$100,000 - $500,000",
        deadline: "2024-06-30",
        description: "Funding for innovative health technologies that address public health challenges.",
        eligibility: "Non-profit organizations, research institutions, and small businesses.",
        url: "https://grants.nih.gov",
        category: "federal",
      },
      {
        id: "2",
        title: "Overdose Prevention Innovation Fund",
        organization: "Gates Foundation",
        amount: "$50,000 - $250,000",
        deadline: "2024-05-15",
        description: "Supporting innovative approaches to prevent overdose deaths in vulnerable communities.",
        eligibility: "501(c)(3) organizations with proven track record in harm reduction.",
        url: "https://gatesfoundation.org/grants",
        category: "foundation",
      },
      {
        id: "3",
        title: "Health Tech Accelerator Program",
        organization: "Johnson & Johnson Innovation",
        amount: "Up to $150,000",
        deadline: "2024-07-01",
        description: "Funding and mentorship for health technology startups addressing critical healthcare needs.",
        eligibility: "Early-stage companies with working prototypes.",
        url: "https://jnjinnovation.com",
        category: "corporate",
      },
      {
        id: "4",
        title: "Opioid Response Grant Program",
        organization: "California Department of Public Health",
        amount: "$75,000 - $200,000",
        deadline: "2024-04-30",
        description: "Funding for community-based approaches to address the opioid epidemic in California.",
        eligibility: "California-based non-profits and public health organizations.",
        url: "https://cdph.ca.gov/grants",
        category: "state",
      },
      {
        id: "5",
        title: "Digital Health Innovation Award",
        organization: "Robert Wood Johnson Foundation",
        amount: "$100,000 - $300,000",
        deadline: "2024-08-15",
        description: "Supporting digital health solutions that improve health outcomes for underserved populations.",
        eligibility: "Non-profit organizations and academic institutions.",
        url: "https://rwjf.org/funding",
        category: "foundation",
      },
    ]

    setOpportunities(sampleOpportunities)
    setLoading(false)
  }, [])

  const filteredOpportunities =
    category === "all" ? opportunities : opportunities.filter((opp) => opp.category === category)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Grant Opportunities</CardTitle>
        <CardDescription>Potential funding sources for Narcoguard's mission</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="federal">Federal</TabsTrigger>
            <TabsTrigger value="foundation">Foundation</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
          </TabsList>

          <TabsContent value={category} className="mt-6">
            {filteredOpportunities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No grant opportunities found in this category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4">
                      <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.organization}</p>
                    </div>
                    <div className="p-4 space-y-4">
                      <p>{opportunity.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-primary" />
                          <span>
                            <strong>Amount:</strong> {opportunity.amount}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>
                            <strong>Deadline:</strong> {formatDate(opportunity.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-primary" />
                          <span>
                            <strong>Category:</strong>{" "}
                            {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm">
                          <strong>Eligibility:</strong> {opportunity.eligibility}
                        </p>
                      </div>

                      <Button asChild variant="outline" className="w-full">
                        <a href={opportunity.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Opportunity
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          These grant opportunities are updated regularly. Contact our grants team for assistance with applications.
        </p>
      </CardFooter>
    </Card>
  )
}
