import React from "react"
/**
 * Comprehensive error handling module for Narcoguard application
 * This module provides standardized error handling, logging, and reporting
 */

// Error severity levels
export enum ErrorSeverity {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

// Error categories
export enum ErrorCategory {
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  DATABASE = "database",
  NETWORK = "network",
  EXTERNAL_SERVICE = "external_service",
  INTERNAL = "internal",
  UNKNOWN = "unknown",
}

// Application error interface
export interface AppErrorOptions {
  message: string
  code: string
  severity: ErrorSeverity
  category: ErrorCategory
  context?: Record<string, any>
  cause?: Error
  recoverable?: boolean
  userMessage?: string
}

// Custom application error class
export class AppError extends Error {
  public readonly code: string
  public readonly severity: ErrorSeverity
  public readonly category: ErrorCategory
  public readonly context?: Record<string, any>
  public readonly cause?: Error
  public readonly recoverable: boolean
  public readonly userMessage: string
  public readonly timestamp: Date

  constructor(options: AppErrorOptions) {
    super(options.message)
    this.name = "AppError"
    this.code = options.code
    this.severity = options.severity
    this.category = options.category
    this.context = options.context
    this.cause = options.cause
    this.recoverable = options.recoverable ?? false
    this.userMessage = options.userMessage ?? "An unexpected error occurred. Please try again later."
    this.timestamp = new Date()

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  // Convert to JSON for logging
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      category: this.category,
      context: this.context,
      cause: this.cause?.message,
      recoverable: this.recoverable,
      userMessage: this.userMessage,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    }
  }
}

// Error handler options
export interface ErrorHandlerOptions {
  context?: Record<string, any>
  reportToAnalytics?: boolean
  logToConsole?: boolean
  notifyUser?: boolean
}

// Default error handler options
const defaultErrorHandlerOptions: ErrorHandlerOptions = {
  reportToAnalytics: true,
  logToConsole: true,
  notifyUser: false,
}

// Global error handler
export async function handleError(
  error: Error,
  options: ErrorHandlerOptions = defaultErrorHandlerOptions,
): Promise<void> {
  // Merge options with defaults
  const mergedOptions = { ...defaultErrorHandlerOptions, ...options }

  // Convert to AppError if not already
  const appError =
    error instanceof AppError
      ? error
      : new AppError({
          message: error.message,
          code: "ERR_UNKNOWN",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.UNKNOWN,
          cause: error,
          context: mergedOptions.context,
        })

  // Log to console
  if (mergedOptions.logToConsole) {
    logErrorToConsole(appError)
  }

  // Report to analytics
  if (mergedOptions.reportToAnalytics) {
    await reportErrorToAnalytics(appError)
  }

  // Notify user
  if (mergedOptions.notifyUser) {
    notifyUserOfError(appError)
  }
}

// Log error to console
function logErrorToConsole(error: AppError): void {
  const errorData = error.toJSON()

  // Use different console methods based on severity
  switch (error.severity) {
    case ErrorSeverity.DEBUG:
      console.debug("[Narcoguard Error]", errorData)
      break
    case ErrorSeverity.INFO:
      console.info("[Narcoguard Error]", errorData)
      break
    case ErrorSeverity.WARNING:
      console.warn("[Narcoguard Error]", errorData)
      break
    case ErrorSeverity.ERROR:
    case ErrorSeverity.CRITICAL:
    default:
      console.error("[Narcoguard Error]", errorData)
      break
  }
}

// Report error to analytics
async function reportErrorToAnalytics(error: AppError): Promise<void> {
  try {
    // In a real implementation, this would send the error to an analytics service
    // For now, we'll just log it
    console.log("[Analytics] Error reported:", error.toJSON())

    // Example implementation for sending to a backend API
    if (typeof window !== "undefined" && process.env.ANALYTICS_API_URL) {
      await fetch(`${process.env.ANALYTICS_API_URL}/errors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ANALYTICS_API_KEY || ""}`,
        },
        body: JSON.stringify({
          ...error.toJSON(),
          applicationId: process.env.ANALYTICS_APP_ID || "narcoguard",
          environment: process.env.NODE_ENV || "development",
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      })
    }
  } catch (reportingError) {
    // Don't throw from error handler
    console.error("Failed to report error to analytics:", reportingError)
  }
}

// Notify user of error
function notifyUserOfError(error: AppError): void {
  try {
    // In a real implementation, this would show a toast or notification to the user
    // For now, we'll just log it
    console.log("[User Notification] Error:", error.userMessage)

    // Example implementation using a toast library
    if (typeof window !== "undefined" && (window as any).toast) {
      ;(window as any).toast.error(error.userMessage)
    }
  } catch (notificationError) {
    // Don't throw from error handler
    console.error("Failed to notify user of error:", notificationError)
  }
}

// Create a validation error
export function createValidationError(
  message: string,
  fieldErrors: Record<string, string>,
  userMessage?: string,
): AppError {
  return new AppError({
    message,
    code: "ERR_VALIDATION",
    severity: ErrorSeverity.WARNING,
    category: ErrorCategory.VALIDATION,
    context: { fieldErrors },
    recoverable: true,
    userMessage: userMessage ?? "Please correct the errors in the form.",
  })
}

// Create an authentication error
export function createAuthenticationError(message: string, userMessage?: string): AppError {
  return new AppError({
    message,
    code: "ERR_AUTHENTICATION",
    severity: ErrorSeverity.WARNING,
    category: ErrorCategory.AUTHENTICATION,
    recoverable: true,
    userMessage: userMessage ?? "Authentication failed. Please check your credentials and try again.",
  })
}

// Create an authorization error
export function createAuthorizationError(message: string, userMessage?: string): AppError {
  return new AppError({
    message,
    code: "ERR_AUTHORIZATION",
    severity: ErrorSeverity.WARNING,
    category: ErrorCategory.AUTHORIZATION,
    recoverable: false,
    userMessage: userMessage ?? "You do not have permission to perform this action.",
  })
}

// Create a network error
export function createNetworkError(message: string, cause?: Error, userMessage?: string): AppError {
  return new AppError({
    message,
    code: "ERR_NETWORK",
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.NETWORK,
    cause,
    recoverable: true,
    userMessage: userMessage ?? "Network error. Please check your connection and try again.",
  })
}

// Create a database error
export function createDatabaseError(message: string, cause?: Error, userMessage?: string): AppError {
  return new AppError({
    message,
    code: "ERR_DATABASE",
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.DATABASE,
    cause,
    recoverable: false,
    userMessage: userMessage ?? "Database error. Please try again later.",
  })
}

// Create an external service error
export function createExternalServiceError(
  message: string,
  service: string,
  cause?: Error,
  userMessage?: string,
): AppError {
  return new AppError({
    message,
    code: `ERR_${service.toUpperCase()}`,
    severity: ErrorSeverity.ERROR,
    category: ErrorCategory.EXTERNAL_SERVICE,
    context: { service },
    cause,
    recoverable: true,
    userMessage: userMessage ?? "External service error. Please try again later.",
  })
}

// Global error boundary for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleError(error, {
      context: { componentStack: errorInfo.componentStack },
      notifyUser: true,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
            <p className="text-red-600">
              {this.state.error instanceof AppError
                ? this.state.error.userMessage
                : "An unexpected error occurred. Please try again later."}
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
