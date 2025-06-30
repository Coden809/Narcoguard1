import { NextResponse } from "next/server"
import { 
  validatePlatformCompatibility, 
  detectPlatform, 
  PLATFORM_CONFIGS 
} from "@/lib/download-service"

export async function POST(request: Request) {
  try {
    const { platform, userAgent } = await request.json()

    // Detect platform if not provided
    const targetPlatform = platform || detectPlatform(userAgent || "")
    
    // Validate platform exists
    if (!PLATFORM_CONFIGS[targetPlatform]) {
      return NextResponse.json({
        valid: false,
        platform: targetPlatform,
        issues: ["Unsupported platform"],
        recommendations: []
      })
    }

    // Check compatibility
    const compatibility = validatePlatformCompatibility(targetPlatform, userAgent || "")
    
    // Generate recommendations
    const recommendations: string[] = []
    
    if (!compatibility.compatible) {
      const config = PLATFORM_CONFIGS[targetPlatform]
      
      if (compatibility.issues.some(issue => issue.includes('Browser'))) {
        recommendations.push(`Try using a supported browser: ${config.requirements.requiredFeatures?.join(', ')}`)
      }
      
      if (compatibility.issues.some(issue => issue.includes('version'))) {
        recommendations.push(`Update your operating system to version ${config.requirements.minOsVersion} or later`)
      }
      
      // Suggest alternative platforms
      const detectedPlatform = detectPlatform(userAgent || "")
      if (detectedPlatform !== targetPlatform && PLATFORM_CONFIGS[detectedPlatform]) {
        recommendations.push(`Consider downloading for ${PLATFORM_CONFIGS[detectedPlatform].displayName} instead`)
      }
      
      // Always suggest web app as fallback
      recommendations.push("Try the web app version which works on all modern browsers")
    }

    return NextResponse.json({
      valid: compatibility.compatible,
      platform: PLATFORM_CONFIGS[targetPlatform].displayName,
      issues: compatibility.issues,
      recommendations,
      config: {
        directDownload: PLATFORM_CONFIGS[targetPlatform].directDownload,
        storeUrl: PLATFORM_CONFIGS[targetPlatform].storeUrl,
        requirements: PLATFORM_CONFIGS[targetPlatform].requirements
      }
    })

  } catch (error) {
    console.error("Platform validation error:", error)
    return NextResponse.json({
      valid: false,
      platform: "unknown",
      issues: ["Failed to validate platform"],
      recommendations: ["Please try again or contact support"]
    }, { status: 500 })
  }
}