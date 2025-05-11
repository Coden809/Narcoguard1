"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { LineChart, BarChart, PieChart, AreaChart } from "@/components/charts"
import { Loader2, Download, Filter, RefreshCw, AlertTriangle, Users, Clock, MapPin } from "lucide-react"
import { analyticsService, AnalyticsEventType } from "@/lib/analytics-service"

// Types for analytics data
interface AnalyticsData {
  emergencies: {
    total: number
    byType: Record<string, number>
    byOutcome: Record<string, number>
    byTime: { date: string; count: number }[]
    responseTime: { average: number; min: number; max: number }
    naloxoneAdministrations: number
  }
  users: {
    total: number
    active: number
    newUsers: { date: string; count: number }[]
    byRegion: Record<string, number>
    retention: number
  }
  engagement: {
    sessionCount: number
    averageSessionDuration: number
    featureUsage: Record<string, number>
    screenViews: Record<string, number>
  }
  performance: {
    averageLoadTime: number
    errorRate: number
    apiLatency: number
    crashCount: number
  }
  community: {
    heroNetworkSize: number
    heroNetworkCoverage: number
    successfulInterventions: number
  }
}

// Analytics Dashboard component
export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("day")
  const [region, setRegion] = useState<string>("all")

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll simulate data
        const simulatedData = simulateAnalyticsData(dateRange, timeframe, region)
        setData(simulatedData)

        // Track dashboard view
        analyticsService.trackEvent({
          eventType: AnalyticsEventType.FEATURE_USAGE,
          properties: {
            featureName: "analytics-dashboard",
            action: "view",
            timeframe,
            region,
            dateRange: {
              from: dateRange.from.toISOString(),
              to: dateRange.to.toISOString(),
            },
          },
        })
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, timeframe, region])

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      const refreshedData = simulateAnalyticsData(dateRange, timeframe, region)
      setData(refreshedData)
      setLoading(false)

      // Track refresh action
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.FEATURE_USAGE,
        properties: {
          featureName: "analytics-dashboard",
          action: "refresh",
        },
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    // In a real implementation, this would generate and download a report
    // For now, we'll just log a message
    console.log("Exporting analytics data...")

    // Track export action
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.FEATURE_USAGE,
      properties: {
        featureName: "analytics-dashboard",
        action: "export",
        format: "csv",
      },
    })
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading analytics data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into Narcoguard's impact and performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-3 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Date Range</CardTitle>
              <CardDescription>Select the time period for analysis</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onUpdate={(range) => {
                if (range.from && range.to) {
                  setDateRange({ from: range.from, to: range.to })
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your analytics view</CardDescription>
            </div>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe Grouping</label>
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="northeast">Northeast</SelectItem>
                  <SelectItem value="midwest">Midwest</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.emergencies.total || 0}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)}% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.users.active || 0}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 15)}% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.emergencies.responseTime.average || 0} min</div>
            <p className="text-xs text-muted-foreground">-{Math.floor(Math.random() * 10)}% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Network Coverage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.community.heroNetworkCoverage || 0}%</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 5)}% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emergencies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emergencies">Emergencies</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="emergencies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Trends</CardTitle>
                <CardDescription>Number of emergencies over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && (
                  <AreaChart data={data.emergencies.byTime} xField="date" yField="count" category="Emergencies" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Types</CardTitle>
                <CardDescription>Distribution by emergency type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && (
                  <PieChart
                    data={Object.entries(data.emergencies.byType).map(([name, value]) => ({ name, value }))}
                    nameKey="name"
                    dataKey="value"
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Outcomes</CardTitle>
                <CardDescription>Results of emergency interventions</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && (
                  <BarChart
                    data={Object.entries(data.emergencies.byOutcome).map(([name, value]) => ({ name, value }))}
                    xField="name"
                    yField="value"
                    category="Outcomes"
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
                <CardDescription>Emergency response time metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Average</p>
                      <p className="text-2xl font-bold">{data?.emergencies.responseTime.average || 0} min</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Minimum</p>
                      <p className="text-2xl font-bold">{data?.emergencies.responseTime.min || 0} min</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Maximum</p>
                      <p className="text-2xl font-bold">{data?.emergencies.responseTime.max || 0} min</p>
                    </div>
                  </div>
                  <div className="pt-6">
                    <h4 className="text-sm font-medium mb-3">Response Time Distribution</h4>
                    <div className="h-40">
                      {/* Simulated response time distribution chart */}
                      <div className="bg-muted h-full rounded-md flex items-end p-2">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-primary mx-1 rounded-t-md w-full"
                            style={{
                              height: `${20 + Math.random() * 70}%`,
                              opacity: 0.5 + i / 20,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New users over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && <LineChart data={data.users.newUsers} xField="date" yField="count" category="New Users" />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users by region</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && (
                  <PieChart
                    data={Object.entries(data.users.byRegion).map(([name, value]) => ({ name, value }))}
                    nameKey="name"
                    dataKey="value"
                  />
                )}
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User retention by cohort</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Simulated cohort retention chart */}
                <div className="h-full bg-muted rounded-md p-4 grid grid-cols-10 gap-1">
                  {[...Array(10)].map((_, week) => (
                    <div key={week} className="space-y-1">
                      {[...Array(10)].map((_, cohort) => (
                        <div
                          key={cohort}
                          className="bg-primary rounded-sm w-full h-6"
                          style={{
                            opacity: Math.max(0.1, 1 - week * 0.1 - cohort * 0.03),
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Overall retention rate: {data?.users.retention || 0}%</p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most used features</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && (
                  <BarChart
                    data={Object.entries(data.engagement.featureUsage).map(([name, value]) => ({ name, value }))}
                    xField="name"
                    yField="value"
                    category="Usage"
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Screen Views</CardTitle>
                <CardDescription>Most viewed screens</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {data && (
                  <BarChart
                    data={Object.entries(data.engagement.screenViews).map(([name, value]) => ({ name, value }))}
                    xField="name"
                    yField="value"
                    category="Views"
                  />
                )}
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Session Analysis</CardTitle>
                <CardDescription>Session duration and frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Session Count</h4>
                    <div className="text-2xl font-bold mb-2">{data?.engagement.sessionCount || 0}</div>
                    <p className="text-sm text-muted-foreground">
                      Average {Math.floor((data?.engagement.sessionCount || 0) / 30)} sessions per day
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3">Average Session Duration</h4>
                    <div className="text-2xl font-bold mb-2">{data?.engagement.averageSessionDuration || 0} min</div>
                    <p className="text-sm text-muted-foreground">
                      +{Math.floor(Math.random() * 15)}% from previous period
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Session Duration Distribution</h4>
                  <div className="h-40">
                    {/* Simulated session duration distribution chart */}
                    <div className="bg-muted h-full rounded-md flex items-end p-2">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-primary mx-1 rounded-t-md w-full"
                          style={{
                            height: `${10 + Math.random() * 80}%`,
                            opacity: 0.5 + i / 24,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Load Time</CardTitle>
                <CardDescription>Page load time trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Simulated load time chart */}
                <div className="h-full bg-muted rounded-md p-4">
                  <LineChart
                    data={[...Array(30)].map((_, i) => ({
                      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                      value: 500 + Math.random() * 1000,
                    }))}
                    xField="date"
                    yField="value"
                    category="Load Time (ms)"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Average load time: {data?.performance.averageLoadTime || 0} ms
                </p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>Application error trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Simulated error rate chart */}
                <div className="h-full bg-muted rounded-md p-4">
                  <LineChart
                    data={[...Array(30)].map((_, i) => ({
                      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                      value: Math.random() * 2,
                    }))}
                    xField="date"
                    yField="value"
                    category="Error Rate (%)"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Current error rate: {data?.performance.errorRate || 0}%</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>API Latency</CardTitle>
                <CardDescription>API response time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Simulated API latency chart */}
                <div className="h-full bg-muted rounded-md p-4">
                  <LineChart
                    data={[...Array(30)].map((_, i) => ({
                      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                      value: 100 + Math.random() * 300,
                    }))}
                    xField="date"
                    yField="value"
                    category="Latency (ms)"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Average API latency: {data?.performance.apiLatency || 0} ms
                </p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Crash Analysis</CardTitle>
                <CardDescription>Application crashes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Total Crashes</p>
                      <p className="text-2xl font-bold">{data?.performance.crashCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Crash Rate</p>
                      <p className="text-2xl font-bold">
                        {(((data?.performance.crashCount || 0) / (data?.users.active || 1)) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Top Crash Reasons</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm">Memory exception</span>
                        <span className="text-sm font-medium">42%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Network timeout</span>
                        <span className="text-sm font-medium">28%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Rendering error</span>
                        <span className="text-sm font-medium">15%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">API error</span>
                        <span className="text-sm font-medium">10%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Other</span>
                        <span className="text-sm font-medium">5%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Network Growth</CardTitle>
                <CardDescription>Growth of volunteer network</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Simulated hero network growth chart */}
                <div className="h-full bg-muted rounded-md p-4">
                  <LineChart
                    data={[...Array(30)].map((_, i) => ({
                      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
                      value: 100 + i * 10 + Math.random() * 20,
                    }))}
                    xField="date"
                    yField="value"
                    category="Heroes"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Current network size: {data?.community.heroNetworkSize || 0} heroes
                </p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Successful Interventions</CardTitle>
                <CardDescription>Lives saved through community response</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Simulated interventions chart */}
                <div className="h-full bg-muted rounded-md p-4">
                  <BarChart
                    data={[...Array(12)].map((_, i) => ({
                      name: new Date(Date.now() - (12 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                        month: "short",
                      }),
                      value: 5 + Math.floor(Math.random() * 20),
                    }))}
                    xField="name"
                    yField="value"
                    category="Interventions"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Total successful interventions: {data?.community.successfulInterventions || 0}
                </p>
              </CardFooter>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Geographic Coverage</CardTitle>
                <CardDescription>Hero network coverage by region</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {/* Simulated map chart */}
                <div className="h-full bg-muted rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Interactive map visualization would be displayed here
                    </p>
                    <p className="text-sm">
                      Overall coverage: <span className="font-bold">{data?.community.heroNetworkCoverage || 0}%</span>{" "}
                      of target areas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Simulate analytics data
function simulateAnalyticsData(dateRange: { from: Date; to: Date }, timeframe: string, region: string): AnalyticsData {
  // Calculate date range duration in days
  const durationDays = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))

  // Generate time series data based on timeframe
  const generateTimeSeries = (baseValue: number, variance: number) => {
    const series = []
    let date = new Date(dateRange.from)
    let step = 1

    if (timeframe === "week") {
      step = 7
    } else if (timeframe === "month") {
      step = 30
    }

    while (date <= dateRange.to) {
      series.push({
        date: date.toLocaleDateString(),
        count: Math.max(0, Math.floor(baseValue + (Math.random() - 0.3) * variance)),
      })
      date = new Date(date.getTime() + step * 24 * 60 * 60 * 1000)
    }

    return series
  }

  // Apply regional multiplier
  const regionalMultiplier = region === "all" ? 1 : 0.3 + Math.random() * 0.4

  // Generate data
  return {
    emergencies: {
      total: Math.floor(durationDays * 3 * regionalMultiplier),
      byType: {
        "Opioid Overdose": Math.floor(durationDays * 1.8 * regionalMultiplier),
        "Stimulant Overdose": Math.floor(durationDays * 0.7 * regionalMultiplier),
        "Polysubstance Overdose": Math.floor(durationDays * 0.4 * regionalMultiplier),
        "Unknown Substance": Math.floor(durationDays * 0.1 * regionalMultiplier),
      },
      byOutcome: {
        "Successful Intervention": Math.floor(durationDays * 2.5 * regionalMultiplier),
        "Medical Transport": Math.floor(durationDays * 1.8 * regionalMultiplier),
        "False Alarm": Math.floor(durationDays * 0.3 * regionalMultiplier),
        Fatality: Math.floor(durationDays * 0.2 * regionalMultiplier),
      },
      byTime: generateTimeSeries(3, 4),
      responseTime: {
        average: Math.floor(5 + Math.random() * 3),
        min: Math.floor(1 + Math.random() * 2),
        max: Math.floor(15 + Math.random() * 10),
      },
      naloxoneAdministrations: Math.floor(durationDays * 2.2 * regionalMultiplier),
    },
    users: {
      total: Math.floor(1000 + durationDays * 10 * regionalMultiplier),
      active: Math.floor(500 + durationDays * 5 * regionalMultiplier),
      newUsers: generateTimeSeries(10, 15),
      byRegion: {
        Northeast: Math.floor(250 + durationDays * 2 * (region === "northeast" ? 1 : 0.3)),
        Midwest: Math.floor(200 + durationDays * 1.5 * (region === "midwest" ? 1 : 0.3)),
        South: Math.floor(300 + durationDays * 3 * (region === "south" ? 1 : 0.3)),
        West: Math.floor(250 + durationDays * 2.5 * (region === "west" ? 1 : 0.3)),
      },
      retention: Math.floor(65 + Math.random() * 20),
    },
    engagement: {
      sessionCount: Math.floor(durationDays * 50 * regionalMultiplier),
      averageSessionDuration: Math.floor(4 + Math.random() * 6),
      featureUsage: {
        "Emergency Button": Math.floor(durationDays * 5 * regionalMultiplier),
        "Naloxone Locator": Math.floor(durationDays * 15 * regionalMultiplier),
        "Resource Directory": Math.floor(durationDays * 20 * regionalMultiplier),
        "Hero Network": Math.floor(durationDays * 10 * regionalMultiplier),
        "Educational Content": Math.floor(durationDays * 25 * regionalMultiplier),
        Settings: Math.floor(durationDays * 8 * regionalMultiplier),
      },
      screenViews: {
        Home: Math.floor(durationDays * 40 * regionalMultiplier),
        Dashboard: Math.floor(durationDays * 30 * regionalMultiplier),
        Resources: Math.floor(durationDays * 25 * regionalMultiplier),
        "Hero Network": Math.floor(durationDays * 15 * regionalMultiplier),
        Profile: Math.floor(durationDays * 10 * regionalMultiplier),
        Settings: Math.floor(durationDays * 8 * regionalMultiplier),
      },
    },
    performance: {
      averageLoadTime: Math.floor(800 + Math.random() * 400),
      errorRate: Number.parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
      apiLatency: Math.floor(150 + Math.random() * 100),
      crashCount: Math.floor(durationDays * 0.3 * regionalMultiplier),
    },
    community: {
      heroNetworkSize: Math.floor(100 + durationDays * 2 * regionalMultiplier),
      heroNetworkCoverage: Math.floor(40 + Math.random() * 30),
      successfulInterventions: Math.floor(durationDays * 1.5 * regionalMultiplier),
    },
  }
}
