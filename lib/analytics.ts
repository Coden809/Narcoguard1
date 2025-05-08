/**
 * Enhanced analytics module for tracking events in the Narcoguard application
 */

// Types for analytics events
export interface AnalyticsEvent {
  eventType: string
  timestamp: Date
  userId?: string
  sessionId?: string
  properties?: Record<string, any>
}

export interface EmergencyEvent extends AnalyticsEvent {
  eventType: "emergency"
  emergencyType: string
  location?: {
    latitude?: number
    longitude?: number
    address?: string
  }
  vitalSigns?: {
    heartRate?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    bloodPressure?: {
      systolic?: number
      diastolic?: number
    }
  }
  deviceInfo?: {
    type?: string
    model?: string
    os?: string
    appVersion?: string
  }
  responseTime?: number
  outcome?: string
}

export interface DownloadEvent extends AnalyticsEvent {
  eventType: "download"
  platform: string
  fileSize?: number
  downloadType: "direct" | "email" | "store"
  email?: string
  userAgent?: string
}

export interface DonationEvent extends AnalyticsEvent {
  eventType: "donation"
  amount: number
  currency: string
  donationType: "one-time" | "recurring" | "grant" | "sponsorship"
  source: string
  donor?: {
    name?: string
    email?: string
    organization?: string
  }
}

/**
 * Log an analytics event
 * @param event The event to log
 * @returns Promise resolving when the event is logged
 */
export async function logEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // In a production environment, this would send the event to an analytics service
    // For now, we'll just log it to the console
    console.log(`[Analytics] Event logged: ${event.eventType}`, event)

    // Example implementation for sending to a backend API
    if (process.env.ANALYTICS_API_URL) {
      await fetch(process.env.ANALYTICS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ANALYTICS_API_KEY || ""}`,
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp.toISOString(),
          applicationId: process.env.ANALYTICS_APP_ID || "narcoguard",
          environment: process.env.NODE_ENV || "development",
        }),
      })
    }
  } catch (error) {
    console.error("Error logging analytics event:", error)
    // Don't throw the error to prevent disrupting the application flow
  }
}

/**
 * Log an emergency event
 * @param userId User ID
 * @param emergencyType Type of emergency
 * @param location Location information
 * @param vitalSigns Vital signs data
 * @param deviceInfo Device information
 * @returns Promise resolving when the event is logged
 */
export async function logEmergencyEvent(
  userId: string,
  emergencyType: string,
  location?: { latitude?: number; longitude?: number; address?: string },
  vitalSigns?: {
    heartRate?: number
    respiratoryRate?: number
    oxygenSaturation?: number
    bloodPressure?: { systolic?: number; diastolic?: number }
  },
  deviceInfo?: { type?: string; model?: string; os?: string; appVersion?: string },
): Promise<void> {
  const emergencyEvent: EmergencyEvent = {
    eventType: "emergency",
    timestamp: new Date(),
    userId,
    emergencyType,
    location,
    vitalSigns,
    deviceInfo,
  }

  // Log the emergency event
  await logEvent(emergencyEvent)

  // In a real implementation, this might also:
  // 1. Send the event to a real-time monitoring system
  // 2. Trigger notifications to emergency contacts
  // 3. Alert nearby users in the Hero Network
  // 4. Contact emergency services if configured

  console.log(`[EMERGENCY] ${emergencyType} event logged for user ${userId}`)
}

/**
 * Log a download event
 * @param platform Platform being downloaded
 * @param fileSize Size of the file in bytes
 * @param downloadType Type of download (direct, email, store)
 * @param email User email (optional)
 * @param userAgent User agent string (optional)
 * @returns Promise resolving when the event is logged
 */
export async function logDownloadEvent(
  platform: string,
  fileSize = 0,
  downloadType: "direct" | "email" | "store" = "direct",
  email?: string,
  userAgent?: string,
): Promise<void> {
  const downloadEvent: DownloadEvent = {
    eventType: "download",
    timestamp: new Date(),
    platform,
    fileSize,
    downloadType,
    email,
    userAgent,
  }

  await logEvent(downloadEvent)
}

/**
 * Log a donation event
 * @param amount Donation amount
 * @param currency Currency code (e.g., USD)
 * @param donationType Type of donation
 * @param source Source of the donation
 * @param donor Donor information (optional)
 * @returns Promise resolving when the event is logged
 */
export async function logDonationEvent(
  amount: number,
  currency = "USD",
  donationType: "one-time" | "recurring" | "grant" | "sponsorship" = "one-time",
  source = "website",
  donor?: {
    name?: string
    email?: string
    organization?: string
  },
): Promise<void> {
  const donationEvent: DonationEvent = {
    eventType: "donation",
    timestamp: new Date(),
    amount,
    currency,
    donationType,
    source,
    donor,
  }

  await logEvent(donationEvent)
}

/**
 * Log a user registration event
 * @param userId User ID
 * @param registrationType Type of registration (email, google, apple, etc.)
 * @param userProperties Additional user properties
 * @returns Promise resolving when the event is logged
 */
export async function logRegistrationEvent(
  userId: string,
  registrationType: string,
  userProperties?: Record<string, any>,
): Promise<void> {
  await logEvent({
    eventType: "registration",
    timestamp: new Date(),
    userId,
    properties: {
      registrationType,
      ...userProperties,
    },
  })
}

/**
 * Log a login event
 * @param userId User ID
 * @param loginMethod Login method used
 * @returns Promise resolving when the event is logged
 */
export async function logLoginEvent(userId: string, loginMethod: string): Promise<void> {
  await logEvent({
    eventType: "login",
    timestamp: new Date(),
    userId,
    properties: {
      loginMethod,
    },
  })
}

/**
 * Log a feature usage event
 * @param userId User ID
 * @param featureName Name of the feature
 * @param featureProperties Additional feature properties
 * @returns Promise resolving when the event is logged
 */
export async function logFeatureUsageEvent(
  userId: string,
  featureName: string,
  featureProperties?: Record<string, any>,
): Promise<void> {
  await logEvent({
    eventType: "feature_usage",
    timestamp: new Date(),
    userId,
    properties: {
      featureName,
      ...featureProperties,
    },
  })
}
