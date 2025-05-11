/**
 * Emergency service module for Narcoguard application
 * This module handles emergency detection, alerts, and response coordination
 */

import { handleError, AppError, ErrorSeverity, ErrorCategory } from "./error-handling"

// Types for emergency data
export interface EmergencyData {
  userId: string
  timestamp: Date
  location?: {
    latitude: number
    longitude: number
    accuracy?: number
    address?: string
  }
  vitalSigns?: {
    heartRate?: number
    respiratoryRate?: number
    oxygenLevel?: number
    bloodPressure?: {
      systolic?: number
      diastolic?: number
    }
    temperature?: number
  }
  deviceInfo?: {
    type: string
    id: string
    batteryLevel?: number
  }
  emergencyType: EmergencyType
  status: EmergencyStatus
  responders?: EmergencyResponder[]
  notes?: string
}

export enum EmergencyType {
  OVERDOSE = "overdose",
  MEDICAL = "medical",
  MANUAL_TRIGGER = "manual_trigger",
  VITAL_SIGNS = "vital_signs",
  FALL = "fall",
  UNRESPONSIVE = "unresponsive",
}

export enum EmergencyStatus {
  DETECTED = "detected",
  CONFIRMED = "confirmed",
  ALERTS_SENT = "alerts_sent",
  RESPONDER_ASSIGNED = "responder_assigned",
  RESPONDER_EN_ROUTE = "responder_en_route",
  RESPONDER_ARRIVED = "responder_arrived",
  RESOLVED = "resolved",
  FALSE_ALARM = "false_alarm",
  CANCELLED = "cancelled",
}

export interface EmergencyResponder {
  id: string
  type: "emergency_contact" | "hero_network" | "emergency_services"
  name: string
  status: "notified" | "acknowledged" | "en_route" | "arrived" | "completed"
  estimatedArrivalTime?: Date
  notes?: string
}

export interface EmergencyContact {
  id: string
  userId: string
  name: string
  relationship: string
  phone?: string
  email?: string
  notificationPreferences: {
    methods: ("sms" | "email" | "push" | "call")[]
    enabled: boolean
  }
}

// Emergency detection thresholds
export const EMERGENCY_THRESHOLDS = {
  heartRate: {
    min: 40,
    max: 120,
    sustainedPeriod: 60, // seconds
  },
  respiratoryRate: {
    min: 8,
    max: 30,
    sustainedPeriod: 60,
  },
  oxygenLevel: {
    min: 90,
    sustainedPeriod: 60,
  },
  unresponsiveness: {
    period: 120, // seconds without interaction after prompt
  },
}

// Emergency service class
export class EmergencyService {
  private static instance: EmergencyService
  private activeEmergencies: Map<string, EmergencyData> = new Map()
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map()

  // Singleton pattern
  private constructor() {}

  public static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService()
    }
    return EmergencyService.instance
  }

  // Detect emergency based on vital signs
  public detectEmergency(
    userId: string,
    vitalSigns: EmergencyData["vitalSigns"],
    options: {
      location?: EmergencyData["location"]
      deviceInfo?: EmergencyData["deviceInfo"]
    } = {},
  ): { isEmergency: boolean; type?: EmergencyType; details?: string } {
    if (!vitalSigns) {
      return { isEmergency: false }
    }

    let isEmergency = false
    let emergencyType: EmergencyType | undefined
    let details = ""

    // Check heart rate
    if (vitalSigns.heartRate) {
      if (
        vitalSigns.heartRate < EMERGENCY_THRESHOLDS.heartRate.min ||
        vitalSigns.heartRate > EMERGENCY_THRESHOLDS.heartRate.max
      ) {
        isEmergency = true
        emergencyType = EmergencyType.VITAL_SIGNS
        details += `Abnormal heart rate: ${vitalSigns.heartRate} bpm. `
      }
    }

    // Check respiratory rate
    if (vitalSigns.respiratoryRate) {
      if (
        vitalSigns.respiratoryRate < EMERGENCY_THRESHOLDS.respiratoryRate.min ||
        vitalSigns.respiratoryRate > EMERGENCY_THRESHOLDS.respiratoryRate.max
      ) {
        isEmergency = true
        emergencyType = EmergencyType.VITAL_SIGNS
        details += `Abnormal respiratory rate: ${vitalSigns.respiratoryRate} breaths/min. `
      }
    }

    // Check oxygen level
    if (vitalSigns.oxygenLevel) {
      if (vitalSigns.oxygenLevel < EMERGENCY_THRESHOLDS.oxygenLevel.min) {
        isEmergency = true
        emergencyType = EmergencyType.OVERDOSE // Low oxygen is a strong indicator of overdose
        details += `Low oxygen level: ${vitalSigns.oxygenLevel}%. `
      }
    }

    // If multiple vital signs are abnormal, classify as overdose
    if (
      vitalSigns.heartRate &&
      vitalSigns.heartRate < EMERGENCY_THRESHOLDS.heartRate.min &&
      vitalSigns.respiratoryRate &&
      vitalSigns.respiratoryRate < EMERGENCY_THRESHOLDS.respiratoryRate.min &&
      vitalSigns.oxygenLevel &&
      vitalSigns.oxygenLevel < EMERGENCY_THRESHOLDS.oxygenLevel.min
    ) {
      emergencyType = EmergencyType.OVERDOSE
      details = `Multiple vital signs indicate possible overdose. `
    }

    return { isEmergency, type: emergencyType, details }
  }

  // Start monitoring a user's vital signs
  public startMonitoring(
    userId: string,
    callback: (data: { isEmergency: boolean; type?: EmergencyType; details?: string }) => void,
    interval = 5000, // Check every 5 seconds
  ): void {
    // Clear any existing monitoring for this user
    this.stopMonitoring(userId)

    // Set up new monitoring interval
    const monitoringInterval = setInterval(async () => {
      try {
        // In a real implementation, this would fetch the latest vital signs
        // For now, we'll simulate by generating random data
        const vitalSigns = this.simulateVitalSigns(userId)

        // Get user's location
        const location = await this.getUserLocation()

        // Detect emergency
        const emergencyData = this.detectEmergency(userId, vitalSigns, { location })

        // Call the callback with the result
        callback(emergencyData)

        // If emergency detected, trigger the emergency process
        if (emergencyData.isEmergency && emergencyData.type) {
          await this.triggerEmergency(userId, {
            emergencyType: emergencyData.type,
            vitalSigns,
            location,
            notes: emergencyData.details,
          })
        }
      } catch (error) {
        await handleError(error as Error, {
          context: { userId, service: "EmergencyService", method: "startMonitoring" },
        })
      }
    }, interval)

    // Store the interval reference
    this.monitoringIntervals.set(userId, monitoringInterval)
  }

  // Stop monitoring a user
  public stopMonitoring(userId: string): void {
    const interval = this.monitoringIntervals.get(userId)
    if (interval) {
      clearInterval(interval)
      this.monitoringIntervals.delete(userId)
    }
  }

  // Trigger an emergency
  public async triggerEmergency(
    userId: string,
    data: {
      emergencyType: EmergencyType
      vitalSigns?: EmergencyData["vitalSigns"]
      location?: EmergencyData["location"]
      deviceInfo?: EmergencyData["deviceInfo"]
      notes?: string
    },
  ): Promise<EmergencyData> {
    try {
      // Check if there's already an active emergency for this user
      const existingEmergency = this.activeEmergencies.get(userId)
      if (
        existingEmergency &&
        existingEmergency.status !== EmergencyStatus.RESOLVED &&
        existingEmergency.status !== EmergencyStatus.FALSE_ALARM &&
        existingEmergency.status !== EmergencyStatus.CANCELLED
      ) {
        // Update the existing emergency with new data
        const updatedEmergency = {
          ...existingEmergency,
          vitalSigns: data.vitalSigns || existingEmergency.vitalSigns,
          location: data.location || existingEmergency.location,
          deviceInfo: data.deviceInfo || existingEmergency.deviceInfo,
          notes: data.notes ? `${existingEmergency.notes || ""} ${data.notes}` : existingEmergency.notes,
        }

        this.activeEmergencies.set(userId, updatedEmergency)

        // Log the update
        console.log(`Emergency updated for user ${userId}:`, updatedEmergency)

        return updatedEmergency
      }

      // Create a new emergency
      const emergency: EmergencyData = {
        userId,
        timestamp: new Date(),
        emergencyType: data.emergencyType,
        status: EmergencyStatus.DETECTED,
        vitalSigns: data.vitalSigns,
        location: data.location,
        deviceInfo: data.deviceInfo,
        notes: data.notes,
      }

      // Store the emergency
      this.activeEmergencies.set(userId, emergency)

      // Log the new emergency
      console.log(`New emergency created for user ${userId}:`, emergency)

      // Proceed with emergency response
      await this.processEmergency(userId)

      return emergency
    } catch (error) {
      throw new AppError({
        message: `Failed to trigger emergency for user ${userId}`,
        code: "ERR_EMERGENCY_TRIGGER",
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.UNKNOWN,
        context: { userId, emergencyData: data, error },
        recoverable: false,
        userMessage: "Failed to trigger emergency response. Please call emergency services directly.",
      })
    }
  }

  // Process an emergency through its lifecycle
  private async processEmergency(userId: string): Promise<void> {
    try {
      const emergency = this.activeEmergencies.get(userId)
      if (!emergency) {
        throw new Error(`No active emergency found for user ${userId}`)
      }

      // Update status to confirmed
      emergency.status = EmergencyStatus.CONFIRMED
      this.activeEmergencies.set(userId, emergency)

      // Get emergency contacts
      const contacts = await this.getEmergencyContacts(userId)

      // Find nearby heroes
      const heroes = await this.findNearbyHeroes(emergency.location)

      // Send alerts to contacts and heroes
      await this.sendEmergencyAlerts(emergency, contacts, heroes)

      // Update status to alerts sent
      emergency.status = EmergencyStatus.ALERTS_SENT
      this.activeEmergencies.set(userId, emergency)

      // In a real implementation, we would continue monitoring the emergency
      // and updating its status based on responder feedback
    } catch (error) {
      await handleError(error as Error, {
        context: { userId, service: "EmergencyService", method: "processEmergency" },
      })
    }
  }

  // Get emergency contacts for a user
  private async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      // In a real implementation, this would fetch contacts from the database
      // For now, return mock data
      return [
        {
          id: "contact1",
          userId,
          name: "Emergency Contact 1",
          relationship: "Family",
          phone: "+1234567890",
          email: "contact1@example.com",
          notificationPreferences: {
            methods: ["sms", "call"],
            enabled: true,
          },
        },
        {
          id: "contact2",
          userId,
          name: "Emergency Contact 2",
          relationship: "Friend",
          phone: "+1987654321",
          email: "contact2@example.com",
          notificationPreferences: {
            methods: ["sms", "email"],
            enabled: true,
          },
        },
      ]
    } catch (error) {
      throw new AppError({
        message: `Failed to get emergency contacts for user ${userId}`,
        code: "ERR_GET_CONTACTS",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.DATABASE,
        context: { userId, error },
        recoverable: true,
      })
    }
  }

  // Find nearby heroes
  private async findNearbyHeroes(location?: EmergencyData["location"]): Promise<EmergencyResponder[]> {
    if (!location) {
      return []
    }

    try {
      // In a real implementation, this would query a spatial database
      // For now, return mock data
      return [
        {
          id: "hero1",
          type: "hero_network",
          name: "Hero 1",
          status: "notified",
        },
        {
          id: "hero2",
          type: "hero_network",
          name: "Hero 2",
          status: "notified",
        },
      ]
    } catch (error) {
      throw new AppError({
        message: "Failed to find nearby heroes",
        code: "ERR_FIND_HEROES",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.DATABASE,
        context: { location, error },
        recoverable: true,
      })
    }
  }

  // Send emergency alerts
  private async sendEmergencyAlerts(
    emergency: EmergencyData,
    contacts: EmergencyContact[],
    heroes: EmergencyResponder[],
  ): Promise<void> {
    try {
      // Send alerts to emergency contacts
      for (const contact of contacts) {
        await this.sendContactAlert(emergency, contact)
      }

      // Send alerts to nearby heroes
      for (const hero of heroes) {
        await this.sendHeroAlert(emergency, hero)
      }

      // Notify emergency services if appropriate
      if (emergency.emergencyType === EmergencyType.OVERDOSE) {
        await this.notifyEmergencyServices(emergency)
      }
    } catch (error) {
      throw new AppError({
        message: "Failed to send emergency alerts",
        code: "ERR_SEND_ALERTS",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.NETWORK,
        context: { emergency, error },
        recoverable: true,
      })
    }
  }

  // Send alert to an emergency contact
  private async sendContactAlert(emergency: EmergencyData, contact: EmergencyContact): Promise<void> {
    // In a real implementation, this would send SMS, email, etc.
    console.log(`Alert sent to contact ${contact.name} for user ${emergency.userId}`)
  }

  // Send alert to a nearby hero
  private async sendHeroAlert(emergency: EmergencyData, hero: EmergencyResponder): Promise<void> {
    // In a real implementation, this would send push notifications, SMS, etc.
    console.log(`Alert sent to hero ${hero.name} for user ${emergency.userId}`)
  }

  // Notify emergency services
  private async notifyEmergencyServices(emergency: EmergencyData): Promise<void> {
    // In a real implementation, this would integrate with emergency services API
    console.log(`Emergency services notified for user ${emergency.userId}`)
  }

  // Resolve an emergency
  public async resolveEmergency(
    userId: string,
    resolution: {
      status: EmergencyStatus.RESOLVED | EmergencyStatus.FALSE_ALARM | EmergencyStatus.CANCELLED
      notes?: string
    },
  ): Promise<EmergencyData | null> {
    const emergency = this.activeEmergencies.get(userId)
    if (!emergency) {
      return null
    }

    // Update emergency status
    emergency.status = resolution.status
    if (resolution.notes) {
      emergency.notes = emergency.notes ? `${emergency.notes} ${resolution.notes}` : resolution.notes
    }

    // Store updated emergency
    this.activeEmergencies.set(userId, emergency)

    // Log resolution
    console.log(`Emergency for user ${userId} resolved with status ${resolution.status}`)

    return emergency
  }

  // Get user's current location
  private async getUserLocation(): Promise<EmergencyData["location"] | undefined> {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return undefined
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        () => {
          // Error getting location
          resolve(undefined)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      )
    })
  }

  // Simulate vital signs for testing
  private simulateVitalSigns(userId: string): EmergencyData["vitalSigns"] {
    // Generate random vital signs
    // In a real implementation, this would come from wearable devices

    // For testing, we'll occasionally generate abnormal values
    const abnormal = Math.random() < 0.1 // 10% chance of abnormal values

    return {
      heartRate: abnormal ? 35 + Math.random() * 10 : 60 + Math.random() * 30,
      respiratoryRate: abnormal ? 5 + Math.random() * 3 : 12 + Math.random() * 8,
      oxygenLevel: abnormal ? 80 + Math.random() * 10 : 95 + Math.random() * 5,
      temperature: 36.5 + Math.random() * 1.5,
    }
  }
}

// Export singleton instance
export const emergencyService = EmergencyService.getInstance()
