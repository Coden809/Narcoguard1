import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Platform Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The download platform you requested doesn't exist or is not supported.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/download/ios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Available Downloads
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
