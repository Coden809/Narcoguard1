/**
 * Monitoring service for Narcoguard application
 * This module handles vital sign monitoring and analysis
 */

import { handleError, AppError, ErrorSeverity, ErrorCategory } from "./error-handling"
import { emergencyService, EmergencyType } from "./emergency-service"

// Types for vital sign data
export interface VitalSigns {
  heartRate?: number
  respiratoryRate?: number
  oxygenLevel?: number
  bloodPressure?: {
    systolic?: number
    diastolic?: number
  }
  temperature?: number
  timestamp: Date
  deviceId?: string
}

export interface VitalSignsThresholds {
  heartRate: {
    min: number
    max: number
  }
  respiratoryRate: {
    min: number
    max: number
  }
  oxygenLevel: {
    min: number
  }
  bloodPressure: {
    systolic: {
      min: number
      max: number
    }
    diastolic: {
      min: number
      max: number
    }
  }
  temperature: {
    min: number
    max: number
  }
}

export interface MonitoringSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  deviceId?: string
  vitalSigns: VitalSigns[]
  status: "active" | "paused" | "completed" | "emergency"
  emergencyDetected?: {
    time: Date
    type: EmergencyType
    vitalSigns: VitalSigns
  }
}

// Default thresholds for vital signs
export const DEFAULT_THRESHOLDS: VitalSignsThresholds = {
  heartRate: {
    min: 40,
    max: 120,
  },
  respiratoryRate: {
    min: 8,
    max: 30,
  },
  oxygenLevel: {
    min: 90,
  },
  bloodPressure: {
    systolic: {
      min: 90,
      max: 180,
    },
    diastolic: {
      min: 60,
      max: 120,
    },
  },
  temperature: {
    min: 35,
    max: 39,
  },
}

// Monitoring service class
export class MonitoringService {
  private static instance: MonitoringService
  private sessions: Map<string, MonitoringSession> = new Map()
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map()
  private thresholds: VitalSignsThresholds = DEFAULT_THRESHOLDS

  // Singleton pattern
  private constructor() {}

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Set custom thresholds
  public setThresholds(thresholds: Partial<VitalSignsThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...thresholds,
    }
  }

  // Start a monitoring session
  public startSession(userId: string, deviceId?: string): MonitoringSession {
    // Generate a unique session ID
    const sessionId = `${userId}-${Date.now()}`

    // Create a new session
    const session: MonitoringSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      deviceId,
      vitalSigns: [],
      status: "active",
    }

    // Store the session
    this.sessions.set(sessionId, session)

    // Start monitoring
    this.startMonitoring(sessionId)

    return session
  }

  // Stop a monitoring session
  public stopSession(sessionId: string): MonitoringSession | null {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Stop monitoring
    this.stopMonitoring(sessionId)

    // Update session
    session.endTime = new Date()
    session.status = "completed"

    // Store updated session
    this.sessions.set(sessionId, session)

    return session
  }

  // Pause a monitoring session
  public pauseSession(sessionId: string): MonitoringSession | null {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Stop monitoring
    this.stopMonitoring(sessionId)

    // Update session
    session.status = "paused"

    // Store updated session
    this.sessions.set(sessionId, session)

    return session
  }

  // Resume a paused monitoring session
  public resumeSession(sessionId: string): MonitoringSession | null {
    const session = this.sessions.get(sessionId)
    if (!session || session.status !== "paused") return null

    // Update session
    session.status = "active"

    // Store updated session
    this.sessions.set(sessionId, session)

    // Start monitoring
    this.startMonitoring(sessionId)

    return session
  }

  // Get a monitoring session
  public getSession(sessionId: string): MonitoringSession | null {
    return this.sessions.get(sessionId) || null
  }

  // Get all sessions for a user
  public getUserSessions(userId: string): MonitoringSession[] {
    const userSessions: MonitoringSession[] = []

    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        userSessions.push(session)
      }
    }

    return userSessions
  }

  // Add vital signs to a session
  public addVitalSigns(sessionId: string, vitalSigns: Omit<VitalSigns, "timestamp">): VitalSigns {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new AppError({
        message: `Session not found: ${sessionId}`,
        code: "ERR_SESSION_NOT_FOUND",
        severity: ErrorSeverity.WARNING,
        category: ErrorCategory.VALIDATION,
        userMessage: "Monitoring session not found.",
      })
    }

    // Create a complete vital signs object
    const completeVitalSigns: VitalSigns = {
      ...vitalSigns,
      timestamp: new Date(),
      deviceId: vitalSigns.deviceId || session.deviceId,
    }

    // Add to session
    session.vitalSigns.push(completeVitalSigns)

    // Check for emergency
    this.checkForEmergency(session, completeVitalSigns)

    return completeVitalSigns
  }

  // Start monitoring for a session
  private startMonitoring(sessionId: string): void {
    // Clear any existing monitoring
    this.stopMonitoring(sessionId)

    // Set up monitoring interval
    const interval = setInterval(() => {
      try {
        const session = this.sessions.get(sessionId)
        if (!session || session.status !== "active") {
          this.stopMonitoring(sessionId)
          return
        }

        // In a real implementation, this would fetch data from a device
        // For now, we'll simulate by generating random data
        const vitalSigns = this.simulateVitalSigns(session)

        // Add to session
        this.addVitalSigns(sessionId, vitalSigns)
      } catch (error) {
        handleError(error as Error, {
          context: { sessionId, service: "MonitoringService", method: "startMonitoring" },
        })
      }
    }, 5000) // Check every 5 seconds

    // Store the interval
    this.monitoringIntervals.set(sessionId, interval)
  }

  // Stop monitoring for a session
  private stopMonitoring(sessionId: string): void {
    const interval = this.monitoringIntervals.get(sessionId)
    if (interval) {
      clearInterval(interval)
      this.monitoringIntervals.delete(sessionId)
    }
  }

  // Check for emergency conditions
  private checkForEmergency(session: MonitoringSession, vitalSigns: VitalSigns): void {
    // Skip if already in emergency state
    if (session.status === "emergency") return

    let emergencyDetected = false
    let emergencyType: EmergencyType = EmergencyType.VITAL_SIGNS

    // Check heart rate
    if (vitalSigns.heartRate !== undefined) {
      if (
        vitalSigns.heartRate < this.thresholds.heartRate.min ||
        vitalSigns.heartRate > this.thresholds.heartRate.max
      ) {
        emergencyDetected = true
      }
    }

    // Check respiratory rate
    if (vitalSigns.respiratoryRate !== undefined) {
      if (
        vitalSigns.respiratoryRate < this.thresholds.respiratoryRate.min ||
        vitalSigns.respiratoryRate > this.thresholds.respiratoryRate.max
      ) {
        emergencyDetected = true
      }
    }

    // Check oxygen level
    if (vitalSigns.oxygenLevel !== undefined) {
      if (vitalSigns.oxygenLevel < this.thresholds.oxygenLevel.min) {
        emergencyDetected = true
        emergencyType = EmergencyType.OVERDOSE // Low oxygen is a strong indicator of overdose
      }
    }

    // Check blood pressure
    if (vitalSigns.bloodPressure) {
      if (vitalSigns.bloodPressure.systolic !== undefined) {
        if (
          vitalSigns.bloodPressure.systolic < this.thresholds.bloodPressure.systolic.min ||
          vitalSigns.bloodPressure.systolic > this.thresholds.bloodPressure.systolic.max
        ) {
          emergencyDetected = true
        }
      }

      if (vitalSigns.bloodPressure.diastolic !== undefined) {
        if (
          vitalSigns.bloodPressure.diastolic < this.thresholds.bloodPressure.diastolic.min ||
          vitalSigns.bloodPressure.diastolic > this.thresholds.bloodPressure.diastolic.max
        ) {
          emergencyDetected = true
        }
      }
    }

    // Check temperature
    if (vitalSigns.temperature !== undefined) {
      if (
        vitalSigns.temperature < this.thresholds.temperature.min ||
        vitalSigns.temperature > this.thresholds.temperature.max
      ) {
        emergencyDetected = true
      }
    }

    // If multiple vital signs are abnormal, classify as overdose
    if (
      vitalSigns.heartRate !== undefined &&
      vitalSigns.heartRate < this.thresholds.heartRate.min &&
      vitalSigns.respiratoryRate !== undefined &&
      vitalSigns.respiratoryRate < this.thresholds.respiratoryRate.min &&
      vitalSigns.oxygenLevel !== undefined &&
      vitalSigns.oxygenLevel < this.thresholds.oxygenLevel.min
    ) {
      emergencyType = EmergencyType.OVERDOSE
    }

    // If emergency detected, update session and trigger emergency response
    if (emergencyDetected) {
      session.status = "emergency"
      session.emergencyDetected = {
        time: new Date(),
        type: emergencyType,
        vitalSigns,
      }

      // Trigger emergency response
      this.triggerEmergencyResponse(session, vitalSigns, emergencyType)
    }
  }

  // Trigger emergency response
  private async triggerEmergencyResponse(
    session: MonitoringSession,
    vitalSigns: VitalSigns,
    emergencyType: EmergencyType,
  ): Promise<void> {
    try {
      // Get user location
      const location = await this.getUserLocation()

      // Trigger emergency
      await emergencyService.triggerEmergency(session.userId, {
        emergencyType,
        vitalSigns,
        location,
        deviceInfo: {
          type: "monitoring_session",
          id: session.id,
        },
      })
    } catch (error) {
      await handleError(error as Error, {
        context: {
          sessionId: session.id,
          userId: session.userId,
          service: "MonitoringService",
          method: "triggerEmergencyResponse",
        },
      })
    }
  }

  // Get user's current location
  private async getUserLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number } | undefined> {
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
  private simulateVitalSigns(session: MonitoringSession): Omit<VitalSigns, "timestamp"> {
    // Generate random vital signs
    // In a real implementation, this would come from wearable devices

    // For testing, we'll occasionally generate abnormal values
    const abnormal = Math.random() < 0.05 // 5% chance of abnormal values

    return {
      heartRate: abnormal ? 35 + Math.random() * 10 : 60 + Math.random() * 30,
      respiratoryRate: abnormal ? 5 + Math.random() * 3 : 12 + Math.random() * 8,
      oxygenLevel: abnormal ? 80 + Math.random() * 10 : 95 + Math.random() * 5,
      bloodPressure: {
        systolic: abnormal ? 80 + Math.random() * 10 : 110 + Math.random() * 30,
        diastolic: abnormal ? 50 + Math.random() * 10 : 70 + Math.random() * 20,
      },
      temperature: 36.5 + Math.random() * 1.5,
      deviceId: session.deviceId,
    }
  }

  // Get analytics data for a user's monitoring sessions
  public getAnalyticsData(userId: string): {
    totalSessions: number
    totalMonitoringTime: number // in milliseconds
    emergencies: number
    averageVitalSigns: {
      heartRate?: number
      respiratoryRate?: number
      oxygenLevel?: number
      bloodPressure?: {
        systolic?: number
        diastolic?: number
      }
      temperature?: number
    }
  } {
    const sessions = this.getUserSessions(userId)

    // Calculate total sessions
    const totalSessions = sessions.length

    // Calculate total monitoring time
    let totalMonitoringTime = 0
    for (const session of sessions) {
      const endTime = session.endTime || new Date()
      totalMonitoringTime += endTime.getTime() - session.startTime.getTime()
    }

    // Count emergencies
    const emergencies = sessions.filter((session) => session.emergencyDetected).length

    // Calculate average vital signs
    let heartRateSum = 0
    let heartRateCount = 0
    let respiratoryRateSum = 0
    let respiratoryRateCount = 0
    let oxygenLevelSum = 0
    let oxygenLevelCount = 0
    let systolicSum = 0
    let systolicCount = 0
    let diastolicSum = 0
    let diastolicCount = 0
    let temperatureSum = 0
    let temperatureCount = 0

    for (const session of sessions) {
      for (const vitalSigns of session.vitalSigns) {
        if (vitalSigns.heartRate !== undefined) {
          heartRateSum += vitalSigns.heartRate
          heartRateCount++
        }

        if (vitalSigns.respiratoryRate !== undefined) {
          respiratoryRateSum += vitalSigns.respiratoryRate
          respiratoryRateCount++
        }

        if (vitalSigns.oxygenLevel !== undefined) {
          oxygenLevelSum += vitalSigns.oxygenLevel
          oxygenLevelCount++
        }

        if (vitalSigns.bloodPressure?.systolic !== undefined) {
          systolicSum += vitalSigns.bloodPressure.systolic
          systolicCount++
        }

        if (vitalSigns.bloodPressure?.diastolic !== undefined) {
          diastolicSum += vitalSigns.bloodPressure.diastolic
          diastolicCount++
        }

        if (vitalSigns.temperature !== undefined) {
          temperatureSum += vitalSigns.temperature
          temperatureCount++
        }
      }
    }

    // Calculate averages
    const averageVitalSigns: {
      heartRate?: number
      respiratoryRate?: number
      oxygenLevel?: number
      bloodPressure?: {
        systolic?: number
        diastolic?: number
      }
      temperature?: number
    } = {}

    if (heartRateCount > 0) {
      averageVitalSigns.heartRate = heartRateSum / heartRateCount
    }

    if (respiratoryRateCount > 0) {
      averageVitalSigns.respiratoryRate = respiratoryRateSum / respiratoryRateCount
    }

    if (oxygenLevelCount > 0) {
      averageVitalSigns.oxygenLevel = oxygenLevelSum / oxygenLevelCount
    }

    if (systolicCount > 0 || diastolicCount > 0) {
      averageVitalSigns.bloodPressure = {}

      if (systolicCount > 0) {
        averageVitalSigns.bloodPressure.systolic = systolicSum / systolicCount
      }

      if (diastolicCount > 0) {
        averageVitalSigns.bloodPressure.diastolic = diastolicSum / diastolicCount
      }
    }

    if (temperatureCount > 0) {
      averageVitalSigns.temperature = temperatureSum / temperatureCount
    }

    return {
      totalSessions,
      totalMonitoringTime,
      emergencies,
      averageVitalSigns,
    }
  }

  // Export monitoring data for a user
  public exportUserData(userId: string): string {
    const sessions = this.getUserSessions(userId)
    return JSON.stringify(sessions, null, 2)
  }

  // Import monitoring data for a user
  public importUserData(userId: string, data: string): void {
    try {
      const sessions = JSON.parse(data) as MonitoringSession[]

      for (const session of sessions) {
        if (session.userId === userId) {
          this.sessions.set(session.id, session)
        }
      }
    } catch (error) {
      throw new AppError({
        message: "Failed to import monitoring data",
        code: "ERR_IMPORT_FAILED",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.DATA,
        userMessage: "Failed to import monitoring data. The data format may be invalid.",
        cause: error as Error,
      })
    }
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance()
