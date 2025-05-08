import { NextResponse } from "next/server"
import { logEvent } from "@/lib/analytics"

export async function POST(request: Request) {
  try {
    const { name, value, id } = await request.json()

    // Log the performance metric
    await logEvent({
      eventType: "performance",
      timestamp: new Date(),
      properties: {
        metricName: name,
        metricValue: value,
        metricId: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging metrics:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
