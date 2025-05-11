/**
 * User service for Narcoguard application
 * This module handles user management, authentication, and profile operations
 */

import { handleError, AppError, ErrorSeverity, ErrorCategory } from "./error-handling"
import { createClient } from "@supabase/supabase-js"

// User types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  profileComplete: boolean
  roles: UserRole[]
  preferences: UserPreferences
  emergencyContacts: EmergencyContact[]
  medicalInfo?: MedicalInfo
}

export enum UserRole {
  USER = "user",
  HERO = "hero",
  ADMIN = "admin",
}

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    shareLocation: boolean
    shareProfile: boolean
    anonymousDataCollection: boolean
  }
  accessibility: {
    reduceMotion: boolean
    highContrast: boolean
    largeText: boolean
  }
  theme: string
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone?: string
  email?: string
  isVerified: boolean
  notificationPreferences: {
    methods: ("sms" | "email" | "push" | "call")[]
    enabled: boolean
  }
}

export interface MedicalInfo {
  allergies?: string[]
  medications?: string[]
  conditions?: string[]
  bloodType?: string
  organDonor?: boolean
  notes?: string
  primaryPhysician?: {
    name: string
    phone?: string
    email?: string
  }
}

// Authentication types
export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User | null
  session: any
  error?: string
}

export interface RegistrationData extends AuthCredentials {
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
}

// User service class
export class UserService {
  private static instance: UserService
  private supabase

  // Singleton pattern
  private constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  // Register a new user
  public async register(data: RegistrationData): Promise<AuthResponse> {
    try {
      // Validate registration data
      this.validateRegistrationData(data)

      // Register user with Supabase
      const { data: authData, error } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new AppError({
          message: `Registration failed: ${error.message}`,
          code: "ERR_REGISTRATION",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.AUTHENTICATION,
          context: { email: data.email, error },
          userMessage: "Registration failed. Please try again.",
        })
      }

      if (!authData.user) {
        throw new AppError({
          message: "Registration succeeded but no user was returned",
          code: "ERR_REGISTRATION_NO_USER",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.AUTHENTICATION,
          context: { email: data.email },
          userMessage: "Registration was successful, but there was an issue with your account. Please contact support.",
        })
      }

      // Create user profile
      const { error: profileError } = await this.supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          date_of_birth: data.dateOfBirth,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile_complete: false,
          roles: [UserRole.USER],
        },
      ])

      if (profileError) {
        throw new AppError({
          message: `Failed to create user profile: ${profileError.message}`,
          code: "ERR_CREATE_PROFILE",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.DATABASE,
          context: { userId: authData.user.id, error: profileError },
          userMessage:
            "Your account was created, but there was an issue setting up your profile. Please contact support.",
        })
      }

      // Create default user preferences
      const { error: preferencesError } = await this.supabase.from("user_preferences").insert([
        {
          user_id: authData.user.id,
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          privacy: {
            shareLocation: true,
            shareProfile: false,
            anonymousDataCollection: true,
          },
          accessibility: {
            reduceMotion: false,
            highContrast: false,
            largeText: false,
          },
          theme: "system",
        },
      ])

      if (preferencesError) {
        throw new AppError({
          message: `Failed to create user preferences: ${preferencesError.message}`,
          code: "ERR_CREATE_PREFERENCES",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.DATABASE,
          context: { userId: authData.user.id, error: preferencesError },
          userMessage:
            "Your account was created, but there was an issue setting up your preferences. Please try again later.",
        })
      }

      // Get the complete user object
      const user = await this.getUserById(authData.user.id)

      return {
        user,
        session: authData.session,
      }
    } catch (error) {
      await handleError(error as Error, {
        context: { email: data.email, service: "UserService", method: "register" },
      })

      return {
        user: null,
        session: null,
        error: error instanceof AppError ? error.userMessage : "Registration failed. Please try again.",
      }
    }
  }

  // Login a user
  public async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        throw new AppError({
          message: "Email and password are required",
          code: "ERR_INVALID_CREDENTIALS",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.VALIDATION,
          userMessage: "Email and password are required",
        })
      }

      // Login with Supabase
      const { data: authData, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw new AppError({
          message: `Login failed: ${error.message}`,
          code: "ERR_LOGIN",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.AUTHENTICATION,
          context: { email: credentials.email, error },
          userMessage: "Login failed. Please check your credentials and try again.",
        })
      }

      if (!authData.user) {
        throw new AppError({
          message: "Login succeeded but no user was returned",
          code: "ERR_LOGIN_NO_USER",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.AUTHENTICATION,
          context: { email: credentials.email },
          userMessage: "Login was successful, but there was an issue with your account. Please contact support.",
        })
      }

      // Update last login timestamp
      await this.supabase
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", authData.user.id)

      // Get the complete user object
      const user = await this.getUserById(authData.user.id)

      return {
        user,
        session: authData.session,
      }
    } catch (error) {
      await handleError(error as Error, {
        context: { email: credentials.email, service: "UserService", method: "login" },
      })

      return {
        user: null,
        session: null,
        error: error instanceof AppError ? error.userMessage : "Login failed. Please try again.",
      }
    }
  }

  // Logout a user
  public async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        throw new AppError({
          message: `Logout failed: ${error.message}`,
          code: "ERR_LOGOUT",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.AUTHENTICATION,
          context: { error },
          userMessage: "Logout failed. Please try again.",
        })
      }
    } catch (error) {
      await handleError(error as Error, {
        context: { service: "UserService", method: "logout" },
      })

      throw error
    }
  }

  // Get the current user
  public async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        return null
      }

      return await this.getUserById(user.id)
    } catch (error) {
      await handleError(error as Error, {
        context: { service: "UserService", method: "getCurrentUser" },
      })

      return null
    }
  }

  // Get a user by ID
  public async getUserById(userId: string): Promise<User | null> {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        throw new AppError({
          message: `Failed to get user profile: ${profileError.message}`,
          code: "ERR_GET_PROFILE",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.DATABASE,
          context: { userId, error: profileError },
          userMessage: "Failed to load user profile. Please try again later.",
        })
      }

      // Get user preferences
      const { data: preferences, error: preferencesError } = await this.supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (preferencesError && preferencesError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        throw new AppError({
          message: `Failed to get user preferences: ${preferencesError.message}`,
          code: "ERR_GET_PREFERENCES",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.DATABASE,
          context: { userId, error: preferencesError },
          userMessage: "Failed to load user preferences. Default preferences will be used.",
        })
      }

      // Get emergency contacts
      const { data: contacts, error: contactsError } = await this.supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", userId)

      if (contactsError) {
        throw new AppError({
          message: `Failed to get emergency contacts: ${contactsError.message}`,
          code: "ERR_GET_CONTACTS",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.DATABASE,
          context: { userId, error: contactsError },
          userMessage: "Failed to load emergency contacts. Please try again later.",
        })
      }

      // Get medical info
      const { data: medicalInfo, error: medicalError } = await this.supabase
        .from("medical_info")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (medicalError && medicalError.code !== "PGRST116") {
        throw new AppError({
          message: `Failed to get medical info: ${medicalError.message}`,
          code: "ERR_GET_MEDICAL_INFO",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.DATABASE,
          context: { userId, error: medicalError },
          userMessage: "Failed to load medical information. Please try again later.",
        })
      }

      // Map database objects to User interface
      const user: User = {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        dateOfBirth: profile.date_of_birth,
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
        lastLoginAt: profile.last_login_at ? new Date(profile.last_login_at) : undefined,
        profileComplete: profile.profile_complete,
        roles: profile.roles || [UserRole.USER],
        preferences: preferences
          ? {
              notifications: preferences.notifications,
              privacy: preferences.privacy,
              accessibility: preferences.accessibility,
              theme: preferences.theme,
            }
          : {
              notifications: { email: true, sms: true, push: true },
              privacy: { shareLocation: true, shareProfile: false, anonymousDataCollection: true },
              accessibility: { reduceMotion: false, highContrast: false, largeText: false },
              theme: "system",
            },
        emergencyContacts: contacts
          ? contacts.map((contact) => ({
              id: contact.id,
              name: contact.name,
              relationship: contact.relationship,
              phone: contact.phone,
              email: contact.email,
              isVerified: contact.is_verified,
              notificationPreferences: contact.notification_preferences,
            }))
          : [],
        medicalInfo: medicalInfo
          ? {
              allergies: medicalInfo.allergies,
              medications: medicalInfo.medications,
              conditions: medicalInfo.conditions,
              bloodType: medicalInfo.blood_type,
              organDonor: medicalInfo.organ_donor,
              notes: medicalInfo.notes,
              primaryPhysician: medicalInfo.primary_physician,
            }
          : undefined,
      }

      return user
    } catch (error) {
      await handleError(error as Error, {
        context: { userId, service: "UserService", method: "getUserById" },
      })

      return null
    }
  }

  // Update user profile
  public async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
    try {
      // Map User interface to database object
      const profileData: any = {}

      if (data.firstName !== undefined) profileData.first_name = data.firstName
      if (data.lastName !== undefined) profileData.last_name = data.lastName
      if (data.phone !== undefined) profileData.phone = data.phone
      if (data.dateOfBirth !== undefined) profileData.date_of_birth = data.dateOfBirth

      // Always update the updated_at timestamp
      profileData.updated_at = new Date().toISOString()

      // Check if profile is now complete
      if (!data.profileComplete && data.firstName && data.lastName && data.phone) {
        profileData.profile_complete = true
      } else if (data.profileComplete !== undefined) {
        profileData.profile_complete = data.profileComplete
      }

      // Update profile
      const { error: profileError } = await this.supabase.from("profiles").update(profileData).eq("id", userId)

      if (profileError) {
        throw new AppError({
          message: `Failed to update user profile: ${profileError.message}`,
          code: "ERR_UPDATE_PROFILE",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.DATABASE,
          context: { userId, error: profileError },
          userMessage: "Failed to update profile. Please try again later.",
        })
      }

      // Update preferences if provided
      if (data.preferences) {
        const { error: preferencesError } = await this.supabase
          .from("user_preferences")
          .update({
            notifications: data.preferences.notifications,
            privacy: data.preferences.privacy,
            accessibility: data.preferences.accessibility,
            theme: data.preferences.theme,
          })
          .eq("user_id", userId)

        if (preferencesError) {
          throw new AppError({
            message: `Failed to update user preferences: ${preferencesError.message}`,
            code: "ERR_UPDATE_PREFERENCES",
            severity: ErrorSeverity.WARNING,
            category: ErrorCategory.DATABASE,
            context: { userId, error: preferencesError },
            userMessage: "Failed to update preferences. Please try again later.",
          })
        }
      }

      // Update medical info if provided
      if (data.medicalInfo) {
        // Check if medical info exists
        const { data: existingMedical } = await this.supabase
          .from("medical_info")
          .select("id")
          .eq("user_id", userId)
          .single()

        const medicalData = {
          user_id: userId,
          allergies: data.medicalInfo.allergies,
          medications: data.medicalInfo.medications,
          conditions: data.medicalInfo.conditions,
          blood_type: data.medicalInfo.bloodType,
          organ_donor: data.medicalInfo.organDonor,
          notes: data.medicalInfo.notes,
          primary_physician: data.medicalInfo.primaryPhysician,
        }

        if (existingMedical) {
          // Update existing record
          const { error: medicalError } = await this.supabase
            .from("medical_info")
            .update(medicalData)
            .eq("id", existingMedical.id)

          if (medicalError) {
            throw new AppError({
              message: `Failed to update medical info: ${medicalError.message}`,
              code: "ERR_UPDATE_MEDICAL_INFO",
              severity: ErrorSeverity.WARNING,
              category: ErrorCategory.DATABASE,
              context: { userId, error: medicalError },
              userMessage: "Failed to update medical information. Please try again later.",
            })
          }
        } else {
          // Create new record
          const { error: medicalError } = await this.supabase.from("medical_info").insert([medicalData])

          if (medicalError) {
            throw new AppError({
              message: `Failed to create medical info: ${medicalError.message}`,
              code: "ERR_CREATE_MEDICAL_INFO",
              severity: ErrorSeverity.WARNING,
              category: ErrorCategory.DATABASE,
              context: { userId, error: medicalError },
              userMessage: "Failed to save medical information. Please try again later.",
            })
          }
        }
      }

      // Get the updated user
      return await this.getUserById(userId)
    } catch (error) {
      await handleError(error as Error, {
        context: { userId, service: "UserService", method: "updateProfile" },
      })

      throw error
    }
  }

  // Add an emergency contact
  public async addEmergencyContact(
    userId: string,
    contact: Omit<EmergencyContact, "id" | "isVerified">,
  ): Promise<EmergencyContact> {
    try {
      // Validate contact data
      if (!contact.name || (!contact.phone && !contact.email)) {
        throw new AppError({
          message: "Name and either phone or email are required for emergency contacts",
          code: "ERR_INVALID_CONTACT",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.VALIDATION,
          userMessage: "Please provide a name and either a phone number or email address.",
        })
      }

      // Insert contact
      const { data, error } = await this.supabase
        .from("emergency_contacts")
        .insert([
          {
            user_id: userId,
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone,
            email: contact.email,
            is_verified: false,
            notification_preferences: contact.notificationPreferences,
          },
        ])
        .select()
        .single()

      if (error) {
        throw new AppError({
          message: `Failed to add emergency contact: ${error.message}`,
          code: "ERR_ADD_CONTACT",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.DATABASE,
          context: { userId, contact, error },
          userMessage: "Failed to add emergency contact. Please try again later.",
        })
      }

      // Map database object to EmergencyContact interface
      const newContact: EmergencyContact = {
        id: data.id,
        name: data.name,
        relationship: data.relationship,
        phone: data.phone,
        email: data.email,
        isVerified: data.is_verified,
        notificationPreferences: data.notification_preferences,
      }

      // Send verification request if email is provided
      if (contact.email) {
        await this.sendContactVerificationEmail(userId, newContact)
      }

      return newContact
    } catch (error) {
      await handleError(error as Error, {
        context: { userId, contact, service: "UserService", method: "addEmergencyContact" },
      })

      throw error
    }
  }

  // Remove an emergency contact
  public async removeEmergencyContact(userId: string, contactId: string): Promise<void> {
    try {
      // Verify the contact belongs to the user
      const { data: contact, error: fetchError } = await this.supabase
        .from("emergency_contacts")
        .select("id")
        .eq("id", contactId)
        .eq("user_id", userId)
        .single()

      if (fetchError || !contact) {
        throw new AppError({
          message: "Emergency contact not found or does not belong to user",
          code: "ERR_CONTACT_NOT_FOUND",
          severity: ErrorSeverity.WARNING,
          category: ErrorCategory.VALIDATION,
          context: { userId, contactId, error: fetchError },
          userMessage: "Emergency contact not found.",
        })
      }

      // Delete the contact
      const { error } = await this.supabase.from("emergency_contacts").delete().eq("id", contactId)

      if (error) {
        throw new AppError({
          message: `Failed to remove emergency contact: ${error.message}`,
          code: "ERR_REMOVE_CONTACT",
          severity: ErrorSeverity.ERROR,
          category: ErrorCategory.DATABASE,
          context: { userId, contactId, error },
          userMessage: "Failed to remove emergency contact. Please try again later.",
        })
      }
    } catch (error) {
      await handleError(error as Error, {
        context: { userId, contactId, service: "UserService", method: "removeEmergencyContact" },
      })

      throw error
    }
  }

  // Send verification email to emergency contact
  private async sendContactVerificationEmail(userId: string, contact: EmergencyContact): Promise<void> {
    try {
      if (!contact.email) return

      // In a real implementation, this would send an email with a verification link
      console.log(`Sending verification email to ${contact.email} for user ${userId}`)

      // For now, just log it
    } catch (error) {
      await handleError(error as Error, {
        context: { userId, contactId: contact.id, service: "UserService", method: "sendContactVerificationEmail" },
      })
    }
  }

  // Validate registration data
  private validateRegistrationData(data: RegistrationData): void {
    const errors: Record<string, string> = {}

    if (!data.email) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format"
    }

    if (!data.password) {
      errors.password = "Password is required"
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (!data.firstName) {
      errors.firstName = "First name is required"
    }

    if (!data.lastName) {
      errors.lastName = "Last name is required"
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError({
        message: "Invalid registration data",
        code: "ERR_INVALID_REGISTRATION",
        severity: ErrorSeverity.WARNING,
        category: ErrorCategory.VALIDATION,
        context: { errors },
        userMessage: "Please correct the errors in the form.",
        recoverable: true,
      })
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance()
