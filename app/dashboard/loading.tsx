import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading your dashboard data...</p>
        </CardContent>
      </Card>
    </div>
  )
}
