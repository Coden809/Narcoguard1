/**
 * Comprehensive test suite for cross-platform download system
 */

const { 
  detectPlatform, 
  validatePlatformCompatibility, 
  processDownloadRequest,
  PLATFORM_CONFIGS 
} = require('../lib/download-service')

describe('Cross-Platform Download System', () => {
  describe('Platform Detection', () => {
    test('should detect iOS from iPhone user agent', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
      expect(detectPlatform(userAgent)).toBe('ios')
    })

    test('should detect Android from Android user agent', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36'
      expect(detectPlatform(userAgent)).toBe('android')
    })

    test('should detect Windows from Windows user agent', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      expect(detectPlatform(userAgent)).toBe('windows')
    })

    test('should detect macOS from Mac user agent', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      expect(detectPlatform(userAgent)).toBe('mac')
    })

    test('should detect Linux from Linux user agent', () => {
      const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      expect(detectPlatform(userAgent)).toBe('linux')
    })

    test('should fallback to web for unknown user agent', () => {
      const userAgent = 'Unknown Browser'
      expect(detectPlatform(userAgent)).toBe('web')
    })
  })

  describe('Platform Compatibility Validation', () => {
    test('should validate compatible iOS device', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      const result = validatePlatformCompatibility('ios', userAgent)
      
      expect(result.compatible).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    test('should detect incompatible browser for Android', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36'
      const result = validatePlatformCompatibility('android', userAgent)
      
      // This should pass as it has webkit
      expect(result.compatible).toBe(true)
    })

    test('should handle unsupported platform', () => {
      const result = validatePlatformCompatibility('unsupported', 'any user agent')
      
      expect(result.compatible).toBe(false)
      expect(result.issues).toContain('Unsupported platform')
    })
  })

  describe('Download Request Processing', () => {
    test('should process valid iOS download request', async () => {
      const request = {
        email: 'test@example.com',
        platform: 'ios',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      }

      const result = await processDownloadRequest(request, 'https://test.com')
      
      expect(result.success).toBe(true)
      expect(result.platform).toBe('iOS')
      expect(result.downloadUrl).toContain('apps.apple.com')
    })

    test('should process valid Android download request', async () => {
      const request = {
        email: 'test@example.com',
        platform: 'android',
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B)'
      }

      const result = await processDownloadRequest(request, 'https://test.com')
      
      expect(result.success).toBe(true)
      expect(result.platform).toBe('Android')
      expect(result.downloadUrl).toContain('/api/download/files/android')
    })

    test('should reject invalid email', async () => {
      const request = {
        email: 'invalid-email',
        platform: 'ios',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      }

      const result = await processDownloadRequest(request, 'https://test.com')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Valid email address is required')
    })

    test('should reject unsupported platform', async () => {
      const request = {
        email: 'test@example.com',
        platform: 'unsupported',
        userAgent: 'Mozilla/5.0'
      }

      const result = await processDownloadRequest(request, 'https://test.com')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Valid platform is required')
    })
  })

  describe('Platform Configurations', () => {
    test('should have all required platform configs', () => {
      const requiredPlatforms = ['ios', 'android', 'windows', 'mac', 'linux', 'web']
      
      requiredPlatforms.forEach(platform => {
        expect(PLATFORM_CONFIGS[platform]).toBeDefined()
        expect(PLATFORM_CONFIGS[platform].name).toBe(platform)
        expect(PLATFORM_CONFIGS[platform].displayName).toBeTruthy()
        expect(PLATFORM_CONFIGS[platform].mimeType).toBeTruthy()
      })
    })

    test('should have proper store URLs for mobile platforms', () => {
      expect(PLATFORM_CONFIGS.ios.storeUrl).toContain('apps.apple.com')
      expect(PLATFORM_CONFIGS.android.storeUrl).toContain('play.google.com')
    })

    test('should have direct download enabled for desktop platforms', () => {
      expect(PLATFORM_CONFIGS.windows.directDownload).toBe(true)
      expect(PLATFORM_CONFIGS.mac.directDownload).toBe(true)
      expect(PLATFORM_CONFIGS.linux.directDownload).toBe(true)
    })
  })

  describe('Error Handling', () => {
    test('should handle missing email gracefully', async () => {
      const request = {
        email: '',
        platform: 'ios',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      }

      const result = await processDownloadRequest(request, 'https://test.com')
      
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    test('should handle missing platform gracefully', async () => {
      const request = {
        email: 'test@example.com',
        platform: '',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      }

      const result = await processDownloadRequest(request, 'https://test.com')
      
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })
})

// Integration tests for API endpoints
describe('Download API Integration', () => {
  test('should validate platform compatibility via API', async () => {
    const response = await fetch('/api/download/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'ios',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      })
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.valid).toBe(true)
    expect(data.platform).toBe('iOS')
  })

  test('should generate download link via API', async () => {
    const response = await fetch('/api/download/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        platform: 'android'
      })
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.downloadUrl).toBeTruthy()
    expect(data.data.platform).toBe('Android')
  })
})