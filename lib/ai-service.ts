/**
 * AI Service for Narcoguard
 * Provides personalized risk assessment, recommendations, and predictive analytics
 */

import { AppError, ErrorSeverity, ErrorCategory } from "./error-handling"
import { analyticsService, AnalyticsEventType } from "./analytics-service"

// Types for AI risk assessment
export interface RiskAssessmentInput {
  userId: string
  vitalSigns?: {
    heartRate?: number[]
    respiratoryRate?: number[]
    oxygenLevel?: number[]
    bloodPressure?: { systolic?: number[]; diastolic?: number[] }
    temperature?: number[]
  }
  medicalHistory?: {
    conditions?: string[]
    medications?: string[]
    allergies?: string[]
    previousOverdoses?: number
    substanceUsePatterns?: Record<string, any>
  }
  environmentalFactors?: {
    location?: { latitude: number; longitude: number }
    timeOfDay?: string
    socialContext?: string
    stressLevel?: number
  }
  behavioralPatterns?: {
    sleepData?: { duration: number; quality: number }[]
    activityLevel?: number[]
    socialInteractions?: number[]
    moodScores?: number[]
  }
}

export interface RiskAssessmentResult {
  overallRiskScore: number // 0-100
  riskLevel: "low" | "moderate" | "high" | "critical"
  contributingFactors: {
    factor: string
    impact: number // 0-10
    description: string
  }[]
  recommendations: {
    id: string
    priority: number // 1-10
    category: "immediate" | "short-term" | "long-term"
    description: string
    actionable: boolean
    action?: {
      type: "contact" | "resource" | "medication" | "activity" | "emergency"
      data: any
    }
  }[]
  predictionConfidence: number // 0-1
  nextAssessmentRecommended: Date
}

export interface PersonalizationProfile {
  userId: string
  riskTolerance: number // 0-1
  communicationPreferences: {
    frequency: "low" | "moderate" | "high"
    channels: ("push" | "sms" | "email" | "in-app")[]
    tone: "clinical" | "supportive" | "direct" | "motivational"
  }
  learningStyle: "visual" | "auditory" | "reading" | "kinesthetic"
  motivationalFactors: string[]
  goals: {
    id: string
    description: string
    importance: number // 1-10
    progress: number // 0-1
  }[]
  contentPreferences: string[]
  interactionHistory: {
    timestamp: Date
    interactionType: string
    response: "positive" | "neutral" | "negative"
    engagement: number // 0-1
  }[]
}

// AI Service class
export class AIService {
  private static instance: AIService
  private modelEndpoint: string
  private apiKey: string
  private initialized = false

  // Singleton pattern
  private constructor() {
    this.modelEndpoint = process.env.AI_MODEL_ENDPOINT || "https://api.narcoguard.ai/model"
    this.apiKey = process.env.AI_API_KEY || ""
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  // Initialize the AI service
  public async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Load AI models and initialize service
      await this.loadModels()
      this.initialized = true
      console.log("AI Service initialized successfully")
    } catch (error) {
      console.error("Failed to initialize AI Service:", error)
      throw new AppError({
        message: "Failed to initialize AI Service",
        code: "ERR_AI_INIT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.INITIALIZATION,
        cause: error as Error,
      })
    }
  }

  // Load AI models
  private async loadModels(): Promise<void> {
    // In a real implementation, this would load models from a service
    // For now, we'll simulate the loading process
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }

  // Perform risk assessment
  public async assessRisk(input: RiskAssessmentInput): Promise<RiskAssessmentResult> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // Track the assessment request
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.AI_ASSESSMENT,
        properties: {
          userId: input.userId,
          assessmentType: "risk",
          timestamp: new Date(),
        },
      })

      // In a real implementation, this would call an AI model API
      // For now, we'll generate a simulated response
      const result = this.simulateRiskAssessment(input)

      // Track the assessment result
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.AI_ASSESSMENT_RESULT,
        properties: {
          userId: input.userId,
          riskLevel: result.riskLevel,
          riskScore: result.overallRiskScore,
          confidence: result.predictionConfidence,
          timestamp: new Date(),
        },
      })

      return result
    } catch (error) {
      throw new AppError({
        message: "Failed to perform risk assessment",
        code: "ERR_RISK_ASSESSMENT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId: input.userId },
      })
    }
  }

  // Generate personalized recommendations
  public async generateRecommendations(
    userId: string,
    riskAssessment: RiskAssessmentResult,
    personalizationProfile?: PersonalizationProfile,
  ): Promise<RiskAssessmentResult["recommendations"]> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // If no personalization profile is provided, get or create one
      if (!personalizationProfile) {
        personalizationProfile = await this.getPersonalizationProfile(userId)
      }

      // In a real implementation, this would call an AI model API
      // For now, we'll generate simulated recommendations
      const recommendations = this.simulateRecommendations(riskAssessment, personalizationProfile)

      // Track the recommendation generation
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.AI_RECOMMENDATIONS,
        properties: {
          userId,
          recommendationCount: recommendations.length,
          highPriorityCount: recommendations.filter((r) => r.priority >= 8).length,
          timestamp: new Date(),
        },
      })

      return recommendations
    } catch (error) {
      throw new AppError({
        message: "Failed to generate recommendations",
        code: "ERR_RECOMMENDATIONS",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId },
      })
    }
  }

  // Get or create personalization profile
  public async getPersonalizationProfile(userId: string): Promise<PersonalizationProfile> {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll generate a simulated profile
      return this.simulatePersonalizationProfile(userId)
    } catch (error) {
      throw new AppError({
        message: "Failed to get personalization profile",
        code: "ERR_PERSONALIZATION_PROFILE",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId },
      })
    }
  }

  // Update personalization profile
  public async updatePersonalizationProfile(
    userId: string,
    updates: Partial<PersonalizationProfile>,
  ): Promise<PersonalizationProfile> {
    try {
      // Get the current profile
      const currentProfile = await this.getPersonalizationProfile(userId)

      // Merge updates with current profile
      const updatedProfile: PersonalizationProfile = {
        ...currentProfile,
        ...updates,
        userId,
        interactionHistory: [...(currentProfile.interactionHistory || []), ...(updates.interactionHistory || [])],
      }

      // In a real implementation, this would save to a database
      // For now, we'll just return the updated profile
      return updatedProfile
    } catch (error) {
      throw new AppError({
        message: "Failed to update personalization profile",
        code: "ERR_UPDATE_PROFILE",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId },
      })
    }
  }

  // Predict potential overdose risk based on patterns
  public async predictOverdoseRisk(
    userId: string,
    timeframe = 24,
  ): Promise<{
    riskScore: number
    confidence: number
    timeframe: number
    factors: { name: string; weight: number }[]
  }> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // In a real implementation, this would call an AI model API
      // For now, we'll generate a simulated prediction
      const prediction = {
        riskScore: Math.random() * 100,
        confidence: 0.7 + Math.random() * 0.3,
        timeframe,
        factors: [
          { name: "Recent vital sign patterns", weight: 0.4 },
          { name: "Historical usage patterns", weight: 0.3 },
          { name: "Environmental factors", weight: 0.2 },
          { name: "Social context", weight: 0.1 },
        ],
      }

      // Track the prediction
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.AI_PREDICTION,
        properties: {
          userId,
          riskScore: prediction.riskScore,
          confidence: prediction.confidence,
          timeframe,
          timestamp: new Date(),
        },
      })

      return prediction
    } catch (error) {
      throw new AppError({
        message: "Failed to predict overdose risk",
        code: "ERR_RISK_PREDICTION",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId, timeframe },
      })
    }
  }

  // Generate personalized content
  public async generatePersonalizedContent(
    userId: string,
    contentType: "education" | "motivation" | "resource" | "alert",
    context?: any,
  ): Promise<{
    content: string
    format: "text" | "html" | "markdown"
    mediaUrls?: string[]
    actions?: { label: string; action: string; data?: any }[]
  }> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // Get personalization profile
      const profile = await this.getPersonalizationProfile(userId)

      // In a real implementation, this would call an AI model API
      // For now, we'll generate simulated content
      const content = this.simulatePersonalizedContent(contentType, profile, context)

      // Track the content generation
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.AI_CONTENT_GENERATION,
        properties: {
          userId,
          contentType,
          format: content.format,
          hasMedia: !!content.mediaUrls?.length,
          hasActions: !!content.actions?.length,
          timestamp: new Date(),
        },
      })

      return content
    } catch (error) {
      throw new AppError({
        message: "Failed to generate personalized content",
        code: "ERR_PERSONALIZED_CONTENT",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId, contentType },
      })
    }
  }

  // Analyze user behavior for patterns
  public async analyzeUserBehavior(
    userId: string,
    dataPoints: {
      type: string
      timestamp: Date
      value: any
    }[],
  ): Promise<{
    patterns: { name: string; confidence: number; description: string }[]
    anomalies: { dataPoint: number; severity: number; description: string }[]
    insights: string[]
  }> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      // In a real implementation, this would call an AI model API
      // For now, we'll generate simulated analysis
      const analysis = {
        patterns: [
          {
            name: "Evening usage pattern",
            confidence: 0.85,
            description: "Consistent usage pattern detected in evening hours (8PM-12AM)",
          },
          {
            name: "Weekend intensity",
            confidence: 0.72,
            description: "Increased usage intensity detected on weekends",
          },
        ],
        anomalies: [
          {
            dataPoint: 23,
            severity: 0.9,
            description: "Unusual spike in heart rate combined with low oxygen levels",
          },
        ],
        insights: [
          "User shows consistent patterns that may indicate risk periods",
          "Social contexts appear to significantly influence usage behavior",
          "Sleep patterns show correlation with next-day risk levels",
        ],
      }

      // Track the analysis
      analyticsService.trackEvent({
        eventType: AnalyticsEventType.AI_BEHAVIOR_ANALYSIS,
        properties: {
          userId,
          dataPointCount: dataPoints.length,
          patternCount: analysis.patterns.length,
          anomalyCount: analysis.anomalies.length,
          timestamp: new Date(),
        },
      })

      return analysis
    } catch (error) {
      throw new AppError({
        message: "Failed to analyze user behavior",
        code: "ERR_BEHAVIOR_ANALYSIS",
        severity: ErrorSeverity.ERROR,
        category: ErrorCategory.AI,
        cause: error as Error,
        context: { userId, dataPointCount: dataPoints.length },
      })
    }
  }

  // Simulate risk assessment
  private simulateRiskAssessment(input: RiskAssessmentInput): RiskAssessmentResult {
    // Generate a risk score based on the input
    let riskScore = 0
    const factors = []

    // Analyze vital signs
    if (input.vitalSigns) {
      if (input.vitalSigns.heartRate) {
        const avgHeartRate =
          input.vitalSigns.heartRate.reduce((sum, rate) => sum + rate, 0) / input.vitalSigns.heartRate.length
        if (avgHeartRate < 50 || avgHeartRate > 100) {
          riskScore += 20
          factors.push({
            factor: "Abnormal heart rate",
            impact: 7,
            description: `Average heart rate of ${avgHeartRate.toFixed(1)} bpm is outside normal range`,
          })
        }
      }

      if (input.vitalSigns.respiratoryRate) {
        const avgRespRate =
          input.vitalSigns.respiratoryRate.reduce((sum, rate) => sum + rate, 0) /
          input.vitalSigns.respiratoryRate.length
        if (avgRespRate < 12 || avgRespRate > 20) {
          riskScore += 25
          factors.push({
            factor: "Abnormal respiratory rate",
            impact: 8,
            description: `Average respiratory rate of ${avgRespRate.toFixed(1)} breaths/min is outside normal range`,
          })
        }
      }

      if (input.vitalSigns.oxygenLevel) {
        const avgOxygenLevel =
          input.vitalSigns.oxygenLevel.reduce((sum, level) => sum + level, 0) / input.vitalSigns.oxygenLevel.length
        if (avgOxygenLevel < 95) {
          riskScore += 30
          factors.push({
            factor: "Low oxygen levels",
            impact: 9,
            description: `Average oxygen level of ${avgOxygenLevel.toFixed(1)}% is below normal range`,
          })
        }
      }
    }

    // Analyze medical history
    if (input.medicalHistory) {
      if (input.medicalHistory.previousOverdoses && input.medicalHistory.previousOverdoses > 0) {
        riskScore += 15 * Math.min(input.medicalHistory.previousOverdoses, 3)
        factors.push({
          factor: "Previous overdose history",
          impact: 8,
          description: `${input.medicalHistory.previousOverdoses} previous overdose(s) recorded`,
        })
      }

      if (input.medicalHistory.conditions && input.medicalHistory.conditions.length > 0) {
        const highRiskConditions = ["respiratory depression", "sleep apnea", "copd", "asthma"]
        const matches = input.medicalHistory.conditions.filter((condition) =>
          highRiskConditions.some((highRisk) => condition.toLowerCase().includes(highRisk)),
        )
        if (matches.length > 0) {
          riskScore += 10 * matches.length
          factors.push({
            factor: "High-risk medical conditions",
            impact: 6,
            description: `Presence of conditions that may increase overdose risk: ${matches.join(", ")}`,
          })
        }
      }
    }

    // Analyze environmental factors
    if (input.environmentalFactors) {
      if (input.environmentalFactors.stressLevel && input.environmentalFactors.stressLevel > 7) {
        riskScore += 10
        factors.push({
          factor: "High stress levels",
          impact: 5,
          description: `Current stress level (${input.environmentalFactors.stressLevel}/10) may increase risk`,
        })
      }

      if (input.environmentalFactors.socialContext === "isolated") {
        riskScore += 15
        factors.push({
          factor: "Social isolation",
          impact: 6,
          description: "Current social isolation increases risk due to lack of immediate help",
        })
      }
    }

    // Cap the risk score at 100
    riskScore = Math.min(riskScore, 100)

    // Determine risk level
    let riskLevel: RiskAssessmentResult["riskLevel"] = "low"
    if (riskScore >= 75) {
      riskLevel = "critical"
    } else if (riskScore >= 50) {
      riskLevel = "high"
    } else if (riskScore >= 25) {
      riskLevel = "moderate"
    }

    // Generate recommendations based on risk factors
    const recommendations = this.generateRecommendationsFromFactors(factors, riskLevel)

    return {
      overallRiskScore: riskScore,
      riskLevel,
      contributingFactors: factors,
      recommendations,
      predictionConfidence: 0.7 + Math.random() * 0.25, // 0.7-0.95
      nextAssessmentRecommended: new Date(Date.now() + 3600000), // 1 hour from now
    }
  }

  // Generate recommendations based on risk factors
  private generateRecommendationsFromFactors(
    factors: RiskAssessmentResult["contributingFactors"],
    riskLevel: RiskAssessmentResult["riskLevel"],
  ): RiskAssessmentResult["recommendations"] {
    const recommendations: RiskAssessmentResult["recommendations"] = []

    // Add recommendations based on risk level
    if (riskLevel === "critical") {
      recommendations.push({
        id: "emergency-contact",
        priority: 10,
        category: "immediate",
        description: "Contact emergency services immediately",
        actionable: true,
        action: {
          type: "emergency",
          data: { service: "emergency", number: "911" },
        },
      })

      recommendations.push({
        id: "naloxone-admin",
        priority: 9,
        category: "immediate",
        description: "Administer naloxone if available",
        actionable: true,
        action: {
          type: "medication",
          data: { medication: "naloxone", instructions: "naloxone-instructions" },
        },
      })
    } else if (riskLevel === "high") {
      recommendations.push({
        id: "contact-support",
        priority: 8,
        category: "immediate",
        description: "Contact a support person immediately",
        actionable: true,
        action: {
          type: "contact",
          data: { contactType: "support" },
        },
      })

      recommendations.push({
        id: "prepare-naloxone",
        priority: 7,
        category: "immediate",
        description: "Ensure naloxone is readily available",
        actionable: true,
        action: {
          type: "resource",
          data: { resource: "naloxone-locator" },
        },
      })
    }

    // Add recommendations based on specific factors
    factors.forEach((factor) => {
      if (factor.factor === "Abnormal heart rate" || factor.factor === "Abnormal respiratory rate") {
        recommendations.push({
          id: "monitor-vitals",
          priority: Math.min(factor.impact, 9),
          category: "immediate",
          description: "Continue monitoring vital signs closely",
          actionable: true,
          action: {
            type: "activity",
            data: { activity: "vital-monitoring", duration: 30 }, // 30 minutes
          },
        })
      }

      if (factor.factor === "Low oxygen levels") {
        recommendations.push({
          id: "improve-breathing",
          priority: Math.min(factor.impact, 8),
          category: "immediate",
          description: "Move to well-ventilated area and focus on deep breathing",
          actionable: true,
          action: {
            type: "activity",
            data: { activity: "breathing-exercise" },
          },
        })
      }

      if (factor.factor === "Previous overdose history") {
        recommendations.push({
          id: "review-safety-plan",
          priority: 6,
          category: "short-term",
          description: "Review your overdose prevention safety plan",
          actionable: true,
          action: {
            type: "resource",
            data: { resource: "safety-plan" },
          },
        })
      }

      if (factor.factor === "High stress levels") {
        recommendations.push({
          id: "stress-reduction",
          priority: 5,
          category: "short-term",
          description: "Engage in stress-reduction activities",
          actionable: true,
          action: {
            type: "activity",
            data: { activity: "stress-reduction" },
          },
        })
      }

      if (factor.factor === "Social isolation") {
        recommendations.push({
          id: "reduce-isolation",
          priority: 6,
          category: "short-term",
          description: "Connect with a supportive friend or family member",
          actionable: true,
          action: {
            type: "contact",
            data: { contactType: "support" },
          },
        })
      }
    })

    // Add general recommendations
    recommendations.push({
      id: "education",
      priority: 4,
      category: "long-term",
      description: "Review overdose prevention educational materials",
      actionable: true,
      action: {
        type: "resource",
        data: { resource: "education" },
      },
    })

    // Remove duplicates
    const uniqueRecommendations = recommendations.filter(
      (recommendation, index, self) => index === self.findIndex((r) => r.id === recommendation.id),
    )

    // Sort by priority
    return uniqueRecommendations.sort((a, b) => b.priority - a.priority)
  }

  // Simulate personalization profile
  private simulatePersonalizationProfile(userId: string): PersonalizationProfile {
    return {
      userId,
      riskTolerance: 0.3 + Math.random() * 0.4, // 0.3-0.7
      communicationPreferences: {
        frequency: ["low", "moderate", "high"][Math.floor(Math.random() * 3)] as any,
        channels: ["push", "sms", "in-app"],
        tone: ["clinical", "supportive", "direct", "motivational"][Math.floor(Math.random() * 4)] as any,
      },
      learningStyle: ["visual", "auditory", "reading", "kinesthetic"][Math.floor(Math.random() * 4)] as any,
      motivationalFactors: ["health", "family", "independence", "future goals"],
      goals: [
        {
          id: "goal1",
          description: "Maintain sobriety",
          importance: 9,
          progress: 0.6,
        },
        {
          id: "goal2",
          description: "Rebuild relationships",
          importance: 8,
          progress: 0.4,
        },
        {
          id: "goal3",
          description: "Develop coping skills",
          importance: 7,
          progress: 0.5,
        },
      ],
      contentPreferences: ["practical", "scientific", "story-based", "visual"],
      interactionHistory: [
        {
          timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
          interactionType: "risk-assessment",
          response: "positive",
          engagement: 0.8,
        },
        {
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          interactionType: "educational-content",
          response: "neutral",
          engagement: 0.5,
        },
      ],
    }
  }

  // Simulate recommendations
  private simulateRecommendations(
    riskAssessment: RiskAssessmentResult,
    profile: PersonalizationProfile,
  ): RiskAssessmentResult["recommendations"] {
    // Start with the recommendations from the risk assessment
    const recommendations = [...riskAssessment.recommendations]

    // Add personalized recommendations based on profile
    if (profile.goals.some((goal) => goal.description.toLowerCase().includes("sobriety"))) {
      recommendations.push({
        id: "sobriety-support",
        priority: 6,
        category: "short-term",
        description: "Connect with your sobriety support network",
        actionable: true,
        action: {
          type: "contact",
          data: { contactType: "support-network" },
        },
      })
    }

    if (profile.learningStyle === "visual") {
      recommendations.push({
        id: "visual-resources",
        priority: 4,
        category: "long-term",
        description: "Review visual guides on overdose prevention",
        actionable: true,
        action: {
          type: "resource",
          data: { resource: "visual-guides" },
        },
      })
    }

    // Sort by priority
    return recommendations.sort((a, b) => b.priority - a.priority)
  }

  // Simulate personalized content
  private simulatePersonalizedContent(
    contentType: string,
    profile: PersonalizationProfile,
    context?: any,
  ): {
    content: string
    format: "text" | "html" | "markdown"
    mediaUrls?: string[]
    actions?: { label: string; action: string; data?: any }[]
  } {
    let content = ""
    let format: "text" | "html" | "markdown" = "text"
    let mediaUrls: string[] = []
    let actions: { label: string; action: string; data?: any }[] = []

    // Generate content based on type and learning style
    switch (contentType) {
      case "education":
        if (profile.learningStyle === "visual") {
          content =
            "# Understanding Overdose Risk Factors\n\nVisual learners like you benefit from seeing information presented graphically. The diagram below illustrates how different factors contribute to overdose risk."
          format = "markdown"
          mediaUrls = ["/images/risk-factors-diagram.png"]
        } else if (profile.learningStyle === "auditory") {
          content =
            "# Understanding Overdose Risk Factors\n\nAs someone who learns best through listening, we've prepared an audio explanation of overdose risk factors. Click the play button below to listen."
          format = "markdown"
          mediaUrls = ["/audio/risk-factors-explanation.mp3"]
        } else {
          content =
            "# Understanding Overdose Risk Factors\n\nOverdose risk is influenced by multiple factors including:\n\n- Tolerance levels\n- Mixing substances\n- Using alone\n- Medical conditions\n- Previous overdose history"
          format = "markdown"
        }
        actions = [
          { label: "Learn More", action: "navigate", data: { route: "/education/risk-factors" } },
          { label: "Take Quiz", action: "navigate", data: { route: "/education/quiz/risk-factors" } },
        ]
        break

      case "motivation":
        if (profile.motivationalFactors.includes("family")) {
          content =
            "Remember that your family is your strength. Each day you prioritize your health and safety is a gift to them and yourself."
          mediaUrls = ["/images/family-support.jpg"]
        } else if (profile.motivationalFactors.includes("health")) {
          content =
            "Your commitment to your health is making a difference. Each step you take to reduce risks is strengthening your body and mind."
        } else {
          content =
            "You've made it through challenges before, and you have the strength to navigate this one too. Focus on one moment at a time."
        }
        actions = [
          { label: "View Progress", action: "navigate", data: { route: "/dashboard/progress" } },
          { label: "Journal", action: "navigate", data: { route: "/tools/journal" } },
        ]
        break

      case "alert":
        if (context && context.riskLevel === "high") {
          content =
            "<strong>IMPORTANT SAFETY ALERT</strong><br>Our system has detected elevated risk factors. Please take immediate precautions."
          format = "html"
          actions = [
            { label: "View Details", action: "viewRiskAssessment", data: { assessmentId: context.assessmentId } },
            { label: "Contact Support", action: "contactSupport" },
          ]
        } else {
          content = "Reminder: Keep your naloxone accessible and check that it hasn't expired."
          actions = [
            { label: "Check Naloxone", action: "navigate", data: { route: "/tools/naloxone-check" } },
            { label: "Find Naloxone", action: "navigate", data: { route: "/resources/naloxone-locator" } },
          ]
        }
        break

      case "resource":
        content =
          "# Local Support Resources\n\nBased on your location and preferences, here are resources that might be helpful:"
        format = "markdown"
        actions = [
          { label: "Treatment Centers", action: "navigate", data: { route: "/resources/treatment" } },
          { label: "Support Groups", action: "navigate", data: { route: "/resources/support-groups" } },
          { label: "Crisis Hotlines", action: "navigate", data: { route: "/resources/hotlines" } },
        ]
        break
    }

    return {
      content,
      format,
      mediaUrls,
      actions,
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance()
