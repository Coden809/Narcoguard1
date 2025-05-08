import { NextResponse } from "next/server"
import { logEmergencyEvent } from "@/lib/analytics"
import { sendEmergencyEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { userId, emergencyType, location, vitalSigns, contacts } = await request.json()

    // Validate required fields
    if (!userId || !emergencyType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Log the emergency event
    await logEmergencyEvent(userId, emergencyType, location, vitalSigns, {
      type: "web",
      appVersion: "1.2.0",
    })

    // Send emergency emails to contacts if provided
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      const emailPromises = contacts.map((contact) => {
        return sendEmergencyEmail(
          contact.email,
          contact.userName || "A Narcoguard user",
          location?.address || "Unknown location",
          emergencyType,
        )
      })

      await Promise.all(emailPromises)
    }

    // In a real implementation, this would also:
    // 1. Send SMS alerts via Twilio
    // 2. Notify nearby Hero Network members
    // 3. Contact emergency services if configured

    return NextResponse.json({
      success: true,
      message: "Emergency alert triggered successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Emergency trigger error:", error)
    return NextResponse.json({ success: false, message: "Failed to process emergency alert" }, { status: 500 })
  }
}
