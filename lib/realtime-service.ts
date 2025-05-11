/**
 * Real-time Service for Narcoguard
 * Provides WebSocket-based real-time data synchronization and notifications
 */

import { AppError, ErrorSeverity, ErrorCategory } from "./error-handling"
import { analyticsService, AnalyticsEventType } from "./analytics-service"

// Types for real-time events
export enum RealtimeEventType {
  VITAL_SIGNS = "vital_signs",
  EMERGENCY_ALERT = "emergency_alert",
  EMERGENCY_UPDATE = "emergency_update",
  RESPONDER_LOCATION = "responder_location",
  USER_LOCATION = "user_location",
  NOTIFICATION = "notification",
  CHAT_MESSAGE = "chat_message",
  SYSTEM_MESSAGE = "system_message",
  CONNECTION_STATUS = "connection_status",
}

export interface RealtimeEvent {
  type: RealtimeEventType
  timestamp: Date
  data: any
  source?: string
  target?: string
  priority?: "low" | "medium" | "high" | "critical"
  id?: string
}

export interface RealtimeSubscription {
  id: string
  eventType: RealtimeEventType
  callback: (event: RealtimeEvent) => void
  filter?: (event: RealtimeEvent) => boolean
}

export interface RealtimeOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  enableCompression?: boolean
  enableEncryption?: boolean
  bufferSize?: number
  debug?: boolean
}

// Real-time service class
export class RealtimeService {
  private static instance: RealtimeService
  private url: string
  private socket: WebSocket | null = null
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts = 0
  private heartbeatInterval: number
  private heartbeatTimer: NodeJS.Timeout | null = null
  private enableCompression: boolean
  private enableEncryption: boolean
  private bufferSize: number
  private debug: boolean
  private connected = false
  private connecting = false
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private eventBuffer: RealtimeEvent[] = []
  private connectionListeners: ((status: boolean) => void)[] = []

  // Singleton pattern
  private constructor(options: RealtimeOptions = {}) {
    this.url = options.url || process.env.REALTIME_WS_URL || "wss://realtime.narcoguard.org/ws"
    this.reconnectInterval = options.reconnectInterval || 5000 // 5 seconds
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10
    this.heartbeatInterval = options.heartbeatInterval || 30000 // 30 seconds
    this.enableCompression = options.enableCompression || false
    this.enableEncryption = options.enableEncryption || false
    this.bufferSize = options.bufferSize || 100
    this.debug = options.debug || process.env.NODE_ENV === "development"
  }

  public static getInstance(options?: RealtimeOptions): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService(options)
    }
    return RealtimeService.instance
  }

  // Connect to WebSocket server
  public async connect(): Promise<boolean> {
    if (this.connected || this.connecting) return this.connected

    this.connecting = true
    this.logDebug("Connecting to WebSocket server...")

    try {
      // In a browser environment, create a WebSocket connection
      if (typeof window !== "undefined") {
        return new Promise((resolve) => {
          // Create WebSocket connection
          this.socket = new WebSocket(this.url)

          // Set up event handlers
          this.socket.onopen = () => this.handleOpen(resolve)
          this.socket.onclose = (event) => this.handleClose(event)
          this.socket.onerror = (error) => this.handleError(error)
          this.socket.onmessage = (event) => this.handleMessage(event)
        })
      } else {
        // In a server environment, simulate connection
        this.logDebug("Server environment detected, simulating WebSocket connection")
        this.connected = true
        this.connecting = false
        return true
      }
    } catch (error) {
      this.connecting = false
      this.logDebug("Failed to connect:", error)
      throw new AppError({
        message: "Failed to connect to real-time service",
        code: "ERR_REALTIME_CONNECT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.NETWORK,
        cause: error as Error,
      })
    }
  }

  // Handle WebSocket open event
  private handleOpen(resolve: (value: boolean) => void): void {
    this.connected = true
    this.connecting = false
    this.reconnectAttempts = 0
    this.logDebug("WebSocket connection established")

    // Start heartbeat
    this.startHeartbeat()

    // Send buffered events
    this.sendBufferedEvents()

    // Notify connection listeners
    this.notifyConnectionListeners(true)

    // Track connection
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.SYSTEM,
      properties: {
        action: "websocket_connected",
        timestamp: new Date(),
      },
    })

    resolve(true)
  }

  // Handle WebSocket close event
  private handleClose(event: CloseEvent): void {
    this.connected = false
    this.connecting = false
    this.logDebug(`WebSocket connection closed: ${event.code} ${event.reason}`)

    // Stop heartbeat
    this.stopHeartbeat()

    // Notify connection listeners
    this.notifyConnectionListeners(false)

    // Track disconnection
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.SYSTEM,
      properties: {
        action: "websocket_disconnected",
        code: event.code,
        reason: event.reason,
        timestamp: new Date(),
      },
    })

    // Attempt to reconnect
    this.attemptReconnect()
  }

  // Handle WebSocket error event
  private handleError(error: Event): void {
    this.logDebug("WebSocket error:", error)

    // Track error
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.ERROR,
      properties: {
        errorCode: "WEBSOCKET_ERROR",
        errorMessage: "WebSocket connection error",
        timestamp: new Date(),
      },
    })
  }

  // Handle WebSocket message event
  private handleMessage(event: MessageEvent): void {
    try {
      // Parse message data
      const message = JSON.parse(event.data)

      // Handle different message types
      switch (message.type) {
        case "heartbeat":
          // Respond to heartbeat
          this.sendHeartbeat()
          break

        case "event":
          // Process event
          this.processIncomingEvent(message.event)
          break

        case "ack":
          // Handle acknowledgment
          this.logDebug(`Event acknowledged: ${message.eventId}`)
          break

        default:
          this.logDebug(`Unknown message type: ${message.type}`)
      }
    } catch (error) {
      this.logDebug("Error processing message:", error)
    }
  }

  // Attempt to reconnect
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logDebug("Max reconnect attempts reached")
      return
    }

    this.reconnectAttempts++
    this.logDebug(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

    setTimeout(() => {
      this.connect().catch((error) => {
        this.logDebug("Reconnect failed:", error)
      })
    }, this.reconnectInterval)
  }

  // Start heartbeat
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat()
    }, this.heartbeatInterval)
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // Send heartbeat
  private sendHeartbeat(): void {
    this.send({
      type: "heartbeat",
      timestamp: new Date(),
    })
  }

  // Send data to WebSocket server
  private send(data: any): boolean {
    if (!this.connected || !this.socket) return false

    try {
      this.socket.send(JSON.stringify(data))
      return true
    } catch (error) {
      this.logDebug("Error sending data:", error)
      return false
    }
  }

  // Disconnect from WebSocket server
  public disconnect(): void {
    if (!this.connected || !this.socket) return

    this.logDebug("Disconnecting from WebSocket server...")

    // Stop heartbeat
    this.stopHeartbeat()

    // Close connection
    this.socket.close(1000, "Client disconnected")
    this.socket = null
    this.connected = false
    this.connecting = false

    // Notify connection listeners
    this.notifyConnectionListeners(false)

    // Track disconnection
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.SYSTEM,
      properties: {
        action: "websocket_disconnected",
        reason: "client_initiated",
        timestamp: new Date(),
      },
    })
  }

  // Subscribe to events
  public subscribe(
    eventType: RealtimeEventType,
    callback: (event: RealtimeEvent) => void,
    filter?: (event: RealtimeEvent) => boolean,
  ): string {
    // Generate subscription ID
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Create subscription
    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      eventType,
      callback,
      filter,
    }

    // Store subscription
    this.subscriptions.set(subscriptionId, subscription)

    this.logDebug(`Subscribed to ${eventType} events with ID ${subscriptionId}`)

    return subscriptionId
  }

  // Unsubscribe from events
  public unsubscribe(subscriptionId: string): boolean {
    const result = this.subscriptions.delete(subscriptionId)
    this.logDebug(`Unsubscribed from events with ID ${subscriptionId}: ${result}`)
    return result
  }

  // Publish an event
  public async publishEvent(event: Omit<RealtimeEvent, "timestamp">): Promise<boolean> {
    // Create complete event
    const completeEvent: RealtimeEvent = {
      ...event,
      timestamp: new Date(),
      id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }

    // Track event
    analyticsService.trackEvent({
      eventType: AnalyticsEventType.REALTIME,
      properties: {
        action: "publish_event",
        eventType: completeEvent.type,
        eventId: completeEvent.id,
        priority: completeEvent.priority || "medium",
        timestamp: completeEvent.timestamp,
      },
    })

    // If not connected, buffer the event and try to connect
    if (!this.connected) {
      this.bufferEvent(completeEvent)

      // Try to connect
      if (!this.connecting) {
        this.connect().catch((error) => {
          this.logDebug("Failed to connect for event publishing:", error)
        })
      }

      return false
    }

    // Send event
    return this.send({
      type: "event",
      event: completeEvent,
    })
  }

  // Buffer an event for later sending
  private bufferEvent(event: RealtimeEvent): void {
    // Add to buffer
    this.eventBuffer.push(event)

    // Trim buffer if it exceeds the maximum size
    if (this.eventBuffer.length > this.bufferSize) {
      this.eventBuffer.shift()
    }

    this.logDebug(`Event buffered: ${event.type} (buffer size: ${this.eventBuffer.length})`)
  }

  // Send buffered events
  private sendBufferedEvents(): void {
    if (this.eventBuffer.length === 0) return

    this.logDebug(`Sending ${this.eventBuffer.length} buffered events...`)

    // Send each buffered event
    for (const event of this.eventBuffer) {
      this.send({
        type: "event",
        event,
      })
    }

    // Clear buffer
    this.eventBuffer = []
  }

  // Process incoming event
  private processIncomingEvent(event: RealtimeEvent): void {
    this.logDebug(`Received event: ${event.type}`)

    // Find matching subscriptions
    for (const subscription of this.subscriptions.values()) {
      // Check if subscription matches event type
      if (subscription.eventType === event.type || subscription.eventType === "*") {
        // Apply filter if provided
        if (subscription.filter && !subscription.filter(event)) {
          continue
        }

        // Call callback
        try {
          subscription.callback(event)
        } catch (error) {
          this.logDebug(`Error in subscription callback: ${error}`)
        }
      }
    }
  }

  // Add connection listener
  public addConnectionListener(listener: (status: boolean) => void): void {
    this.connectionListeners.push(listener)

    // Call immediately with current status
    listener(this.connected)
  }

  // Remove connection listener
  public removeConnectionListener(listener: (status: boolean) => void): void {
    const index = this.connectionListeners.indexOf(listener)
    if (index !== -1) {
      this.connectionListeners.splice(index, 1)
    }
  }

  // Notify connection listeners
  private notifyConnectionListeners(status: boolean): void {
    for (const listener of this.connectionListeners) {
      try {
        listener(status)
      } catch (error) {
        this.logDebug(`Error in connection listener: ${error}`)
      }
    }
  }

  // Get connection status
  public isConnected(): boolean {
    return this.connected
  }

  // Debug logging
  private logDebug(message: string, data?: any): void {
    if (!this.debug) return

    if (data) {
      console.log(`[RealtimeService] ${message}`, data)
    } else {
      console.log(`[RealtimeService] ${message}`)
    }
  }
}

// Export singleton instance
export const realtimeService = RealtimeService.getInstance()
