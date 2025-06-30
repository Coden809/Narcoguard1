/**
 * Comprehensive Download Service for Cross-Platform Support
 * Handles download generation, validation, and delivery for all platforms
 */

export interface DownloadRequest {
  email: string
  platform: string
  userAgent?: string
  deviceInfo?: {
    os: string
    browser: string
    version: string
    mobile: boolean
  }
}

export interface DownloadResponse {
  success: boolean
  downloadUrl: string
  fallbackUrl?: string
  fileName: string
  platform: string
  expiresAt: Date
  instructions?: string
  error?: string
}

export interface PlatformConfig {
  name: string
  displayName: string
  fileExtension: string
  mimeType: string
  storeUrl?: string
  directDownload: boolean
  requirements: {
    minOsVersion?: string
    minBrowserVersion?: string
    requiredFeatures?: string[]
  }
}

// Platform configurations
export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  ios: {
    name: 'ios',
    displayName: 'iOS',
    fileExtension: '.ipa',
    mimeType: 'application/octet-stream',
    storeUrl: 'https://apps.apple.com/app/narcoguard/id1234567890',
    directDownload: false,
    requirements: {
      minOsVersion: '14.0',
      requiredFeatures: ['webkit', 'touchscreen']
    }
  },
  android: {
    name: 'android',
    displayName: 'Android',
    fileExtension: '.apk',
    mimeType: 'application/vnd.android.package-archive',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.narcoguard',
    directDownload: true,
    requirements: {
      minOsVersion: '8.0',
      requiredFeatures: ['chrome', 'touchscreen']
    }
  },
  windows: {
    name: 'windows',
    displayName: 'Windows',
    fileExtension: '.exe',
    mimeType: 'application/octet-stream',
    directDownload: true,
    requirements: {
      minOsVersion: '10',
      requiredFeatures: ['edge', 'chrome', 'firefox']
    }
  },
  mac: {
    name: 'mac',
    displayName: 'macOS',
    fileExtension: '.dmg',
    mimeType: 'application/x-apple-diskimage',
    directDownload: true,
    requirements: {
      minOsVersion: '11.0',
      requiredFeatures: ['safari', 'chrome', 'firefox']
    }
  },
  linux: {
    name: 'linux',
    displayName: 'Linux',
    fileExtension: '.AppImage',
    mimeType: 'application/vnd.appimage',
    directDownload: true,
    requirements: {
      requiredFeatures: ['chrome', 'firefox']
    }
  },
  web: {
    name: 'web',
    displayName: 'Web App',
    fileExtension: '',
    mimeType: 'text/html',
    directDownload: false,
    requirements: {
      requiredFeatures: ['serviceworker', 'indexeddb']
    }
  }
}

/**
 * Detect platform from user agent
 */
export function detectPlatform(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    return 'ios'
  }
  
  if (ua.includes('android')) {
    return 'android'
  }
  
  if (ua.includes('windows')) {
    return 'windows'
  }
  
  if (ua.includes('macintosh') || ua.includes('mac os x')) {
    return 'mac'
  }
  
  if (ua.includes('linux')) {
    return 'linux'
  }
  
  return 'web'
}

/**
 * Validate platform compatibility
 */
export function validatePlatformCompatibility(
  platform: string, 
  userAgent: string
): { compatible: boolean; issues: string[] } {
  const config = PLATFORM_CONFIGS[platform]
  if (!config) {
    return { compatible: false, issues: ['Unsupported platform'] }
  }

  const issues: string[] = []
  const ua = userAgent.toLowerCase()

  // Check browser compatibility
  if (config.requirements.requiredFeatures) {
    const hasChrome = ua.includes('chrome')
    const hasFirefox = ua.includes('firefox')
    const hasSafari = ua.includes('safari') && !ua.includes('chrome')
    const hasEdge = ua.includes('edge')

    const supportedBrowsers = config.requirements.requiredFeatures
    const hasCompatibleBrowser = supportedBrowsers.some(feature => {
      switch (feature) {
        case 'chrome': return hasChrome
        case 'firefox': return hasFirefox
        case 'safari': return hasSafari
        case 'edge': return hasEdge
        case 'webkit': return hasSafari || hasChrome
        default: return true
      }
    })

    if (!hasCompatibleBrowser) {
      issues.push(`Browser not supported. Requires: ${supportedBrowsers.join(' or ')}`)
    }
  }

  return {
    compatible: issues.length === 0,
    issues
  }
}

/**
 * Generate download URL for platform
 */
export function generateDownloadUrl(
  platform: string, 
  token: string, 
  baseUrl: string = ''
): string {
  const config = PLATFORM_CONFIGS[platform]
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  // For store-based platforms, return store URL
  if (config.storeUrl && !config.directDownload) {
    return config.storeUrl
  }

  // For web app, return app URL
  if (platform === 'web') {
    return `${baseUrl}/app?token=${token}`
  }

  // For direct downloads, return API endpoint
  return `${baseUrl}/api/download/files/${platform}?token=${token}`
}

/**
 * Generate fallback download options
 */
export function generateFallbackOptions(platform: string, baseUrl: string = ''): string[] {
  const fallbacks: string[] = []

  switch (platform) {
    case 'ios':
      fallbacks.push(`${baseUrl}/api/download/files/generic`) // Generic package
      fallbacks.push(`${baseUrl}/app`) // Web app
      break
    
    case 'android':
      fallbacks.push('https://play.google.com/store/apps/details?id=com.narcoguard')
      fallbacks.push(`${baseUrl}/app`) // Web app
      break
    
    case 'windows':
    case 'mac':
    case 'linux':
      fallbacks.push(`${baseUrl}/api/download/files/generic`) // Generic package
      fallbacks.push(`${baseUrl}/app`) // Web app
      break
    
    case 'web':
      fallbacks.push(`${baseUrl}/download`) // Download page
      break
  }

  return fallbacks
}

/**
 * Get download instructions for platform
 */
export function getDownloadInstructions(platform: string): string {
  const instructions: Record<string, string> = {
    ios: `
1. Tap the download link to open the App Store
2. Tap "Get" to download and install Narcoguard
3. Open the app and complete setup
4. Allow notifications and location access for emergency features
    `,
    android: `
1. Tap the download link to download the APK file
2. If prompted, allow installation from unknown sources
3. Open the downloaded file and tap "Install"
4. Open the app and complete setup
5. Allow notifications and location access for emergency features
    `,
    windows: `
1. Click the download link to download the installer
2. Run the downloaded .exe file
3. Follow the installation wizard
4. Launch Narcoguard from the Start menu
5. Complete the initial setup process
    `,
    mac: `
1. Click the download link to download the DMG file
2. Open the downloaded DMG file
3. Drag Narcoguard to your Applications folder
4. Launch Narcoguard from Applications
5. Complete the initial setup process
    `,
    linux: `
1. Click the download link to download the AppImage
2. Make the file executable: chmod +x narcoguard.AppImage
3. Run the AppImage file
4. Complete the initial setup process
    `,
    web: `
1. Click the link to open the web app
2. For the best experience, add to your home screen:
   - Chrome: Menu > Add to Home Screen
   - Safari: Share > Add to Home Screen
   - Firefox: Menu > Install
3. Complete the initial setup process
    `
  }

  return instructions[platform] || 'Follow the download link and installation prompts.'
}

/**
 * Validate download request
 */
export function validateDownloadRequest(request: DownloadRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!request.email || !emailRegex.test(request.email)) {
    errors.push('Valid email address is required')
  }

  // Validate platform
  if (!request.platform || !PLATFORM_CONFIGS[request.platform]) {
    errors.push('Valid platform is required')
  }

  // Check platform compatibility if user agent provided
  if (request.userAgent && request.platform) {
    const compatibility = validatePlatformCompatibility(request.platform, request.userAgent)
    if (!compatibility.compatible) {
      errors.push(...compatibility.issues)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Process download request and generate response
 */
export async function processDownloadRequest(
  request: DownloadRequest,
  baseUrl: string = ''
): Promise<DownloadResponse> {
  // Validate request
  const validation = validateDownloadRequest(request)
  if (!validation.valid) {
    return {
      success: false,
      downloadUrl: '',
      fileName: '',
      platform: request.platform,
      expiresAt: new Date(),
      error: validation.errors.join(', ')
    }
  }

  try {
    const config = PLATFORM_CONFIGS[request.platform]
    const { generateDownloadToken } = await import('./auth')
    
    // Generate secure token
    const token = generateDownloadToken(request.email, request.platform)
    
    // Generate URLs
    const downloadUrl = generateDownloadUrl(request.platform, token, baseUrl)
    const fallbackOptions = generateFallbackOptions(request.platform, baseUrl)
    
    // Calculate expiration (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
    
    // Generate filename
    const fileName = `narcoguard-${config.name}${config.fileExtension}`
    
    return {
      success: true,
      downloadUrl,
      fallbackUrl: fallbackOptions[0],
      fileName,
      platform: config.displayName,
      expiresAt,
      instructions: getDownloadInstructions(request.platform)
    }
  } catch (error) {
    console.error('Error processing download request:', error)
    return {
      success: false,
      downloadUrl: '',
      fileName: '',
      platform: request.platform,
      expiresAt: new Date(),
      error: 'Failed to generate download link'
    }
  }
}

/**
 * Get platform-specific download statistics
 */
export function getDownloadStats(): Record<string, any> {
  return {
    platforms: Object.keys(PLATFORM_CONFIGS).map(key => ({
      name: key,
      displayName: PLATFORM_CONFIGS[key].displayName,
      available: true,
      directDownload: PLATFORM_CONFIGS[key].directDownload
    })),
    totalPlatforms: Object.keys(PLATFORM_CONFIGS).length,
    supportedFeatures: [
      'Cross-platform compatibility',
      'Secure token-based downloads',
      'Automatic platform detection',
      'Fallback options',
      'Installation instructions'
    ]
  }
}