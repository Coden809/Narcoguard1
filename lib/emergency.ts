import { Twilio } from "twilio"
import { sendEmail } from "./email"

// Initialize Twilio client
const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID || "", process.env.TWILIO_AUTH_TOKEN || "")

interface User {
  id: string
  name?: string
}

interface EmergencyContact {
  id: string
  name: string
  phone?: string
  email?: string
}

interface NearbyHero {
  id: string
  name: string
  distance: number
  phone?: string
  email?: string
}

interface EmergencyNotificationData {
  user: User
  location: { latitude: number; longitude: number }
  vitalSigns: { heartRate?: number | null; oxygenLevel?: number | null }
  emergencyContacts: EmergencyContact[]
  nearbyHeroes: NearbyHero[]
}

// Send emergency notifications to contacts and nearby heroes
export async function sendEmergencyNotifications(data: EmergencyNotificationData) {
  const { user, location, vitalSigns, emergencyContacts, nearbyHeroes } = data

  // Format location for sharing
  const locationUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`

  // Base message for SMS
  const baseMessage = `EMERGENCY ALERT from Narcoguard: ${user.name || "A user"} may be experiencing an overdose and needs immediate help.`

  // Additional details for the message
  const vitalSignsText = vitalSigns.heartRate
    ? `\nVital signs: Heart rate ${vitalSigns.heartRate} BPM, Oxygen level ${vitalSigns.oxygenLevel}%`
    : ""

  // Send notifications to emergency contacts
  const contactPromises = emergencyContacts.map(async (contact) => {
    try {
      // Customize message for each contact
      const contactMessage = `${baseMessage}\n\nYou are listed as an emergency contact.${vitalSignsText}\n\nLocation: ${locationUrl}`

      // Send SMS if phone number is available
      if (contact.phone) {
        await twilioClient.messages.create({
          body: contactMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phone,
        })
      }

      // Send email if email is available
      if (contact.email) {
        await sendEmail({
          to: contact.email,
          subject: "EMERGENCY ALERT from Narcoguard",
          text: contactMessage,
          html: generateEmergencyEmailHtml({
            name: contact.name,
            message: baseMessage,
            vitalSigns,
            locationUrl,
            isHero: false,
          }),
        })
      }

      return { contactId: contact.id, success: true }
    } catch (error) {
      console.error(`Failed to notify emergency contact ${contact.id}:`, error)
      return { contactId: contact.id, success: false, error }
    }
  })

  // Send notifications to nearby heroes
  const heroPromises = nearbyHeroes.map(async (hero) => {
    try {
      // Customize message for each hero
      const heroMessage = `${baseMessage}\n\nYou are receiving this as a Narcoguard Hero ${hero.distance.toFixed(1)} miles away.${vitalSignsText}\n\nLocation: ${locationUrl}`

      // Send SMS if phone number is available
      if (hero.phone) {
        await twilioClient.messages.create({
          body: heroMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: hero.phone,
        })
      }

      // Send email if email is available
      if (hero.email) {
        await sendEmail({
          to: hero.email,
          subject: "URGENT: Nearby Overdose Emergency",
          text: heroMessage,
          html: generateEmergencyEmailHtml({
            name: hero.name,
            message: baseMessage,
            vitalSigns,
            locationUrl,
            isHero: true,
            distance: hero.distance,
          }),
        })
      }

      return { heroId: hero.id, success: true }
    } catch (error) {
      console.error(`Failed to notify hero ${hero.id}:`, error)
      return { heroId: hero.id, success: false, error }
    }
  })

  // Wait for all notifications to be sent
  const [contactResults, heroResults] = await Promise.all([Promise.all(contactPromises), Promise.all(heroPromises)])

  // Return results
  return {
    contactsNotified: contactResults.filter((r) => r.success).length,
    heroesNotified: heroResults.filter((r) => r.success).length,
    contactResults,
    heroResults,
  }
}

// Generate HTML email for emergency notifications
function generateEmergencyEmailHtml(params: {
  name: string
  message: string
  vitalSigns: { heartRate?: number | null; oxygenLevel?: number | null }
  locationUrl: string
  isHero: boolean
  distance?: number
}) {
  const { name, message, vitalSigns, locationUrl, isHero, distance } = params

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Emergency Alert</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #FF3B30;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #FF3B30;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          margin: 20px 0;
        }
        .vital-signs {
          background: #fde8e8;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>EMERGENCY ALERT</h1>
        <p>${isHero ? "Nearby overdose emergency" : "Emergency contact notification"}</p>
      </div>
      <div class="content">
        <h2>Urgent: Medical Emergency</h2>
        <p>Hello ${name},</p>
        <p>${message}</p>
        
        ${
          isHero
            ? `<p>You are receiving this alert because you are a Narcoguard Hero approximately <strong>${distance?.toFixed(1)} miles</strong> from someone experiencing a possible overdose.</p>`
            : `<p>You are receiving this alert because you are listed as an emergency contact.</p>`
        }
        
        ${
          vitalSigns.heartRate
            ? `
        <div class="vital-signs">
          <h3>Vital Signs</h3>
          <p>Heart Rate: <strong>${vitalSigns.heartRate} BPM</strong></p>
          <p>Oxygen Level: <strong>${vitalSigns.oxygenLevel}%</strong></p>
        </div>
        `
            : ""
        }
        
        <h3>Location</h3>
        <p>Click the button below to view the location on Google Maps:</p>
        
        <div style="text-align: center;">
          <a href="${locationUrl}" class="button">View Location</a>
        </div>
        
        <p><strong>Important:</strong> If you can assist, please do so immediately. Call emergency services (911) if needed.</p>
      </div>
      <div class="footer">
        <p>This is an automated emergency alert from Narcoguard.</p>
        <p>© ${new Date().getFullYear()} Narcoguard. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}
