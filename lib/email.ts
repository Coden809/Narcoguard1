import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

/**
 * Send an email using the configured email provider
 * @param options Email options including recipient, subject, and content
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    // Create a transporter using environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "user@example.com",
        pass: process.env.EMAIL_PASS || "password",
      },
    })

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Narcoguard <no-reply@narcoguard.org>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}

// Enhanced email template with better styling
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Narcoguard</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
      padding: 20px 0;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo { 
      width: 80px; 
      height: 80px; 
      border-radius: 50%; 
      margin-bottom: 15px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #6366f1;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 10px 0;
    }
    .button:hover {
      background-color: #5855eb;
    }
    .instructions {
      background-color: #f8fafc;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #6366f1;
    }
    .footer { 
      margin-top: 40px; 
      text-align: center; 
      font-size: 12px; 
      color: #666; 
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
    .warning {
      background-color: #fef3cd;
      border: 1px solid #fde047;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png" alt="Narcoguard Logo" class="logo">
      <h1 style="margin: 0; color: #1f2937;">Narcoguard</h1>
      <p style="margin: 5px 0 0 0; color: #6b7280;">Protecting Lives, Preventing Overdose</p>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} Narcoguard. All rights reserved.</p>
      <p>Contact: narcoguard607@gmail.com | (607) 484-7605</p>
      <p>Binghamton, NY, USA</p>
    </div>
  </div>
</body>
</html>
`

/**
 * Enhanced download email with platform-specific instructions
 */
export async function sendDownloadEmail(
  email: string,
  downloadUrl: string,
  platform: string,
  fallbackUrl?: string,
  instructions?: string,
): Promise<void> {
  // Map platform to display name
  const platformNames: Record<string, string> = {
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
    web: "Web App",
    desktop: "Desktop",
  }

  const platformName = platformNames[platform] || "Narcoguard"
  const isStoreDownload = downloadUrl.includes('apps.apple.com') || downloadUrl.includes('play.google.com')

  // Create email content
  const subject = `Your Narcoguard Download for ${platformName}`

  const html = emailTemplate(`
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your Download is Ready!</h2>
    
    <p>Thank you for downloading Narcoguard for ${platformName}. Your download link is ready below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${downloadUrl}" class="button">
        ${isStoreDownload ? `Open ${platformName} Store` : `Download Narcoguard for ${platformName}`}
      </a>
    </div>
    
    ${instructions ? `
      <div class="instructions">
        <h3 style="margin-top: 0; color: #374151;">Installation Instructions:</h3>
        <div style="white-space: pre-line; font-size: 14px; line-height: 1.5;">
${instructions}
        </div>
      </div>
    ` : ''}
    
    <div class="warning">
      <p style="margin: 0; font-weight: 600; color: #92400e;">⚠️ Important Security Notice</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #92400e;">
        This download link will expire in 24 hours for security reasons. 
        If you didn't request this download, please ignore this email.
      </p>
    </div>
    
    ${fallbackUrl ? `
      <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px;">
        <h3 style="margin-top: 0; color: #374151;">Having trouble with the download?</h3>
        <p>If the main download link doesn't work, please try our alternative option:</p>
        <div style="text-align: center;">
          <a href="${fallbackUrl}" class="button" style="background-color: #6b7280;">
            Alternative Download
          </a>
        </div>
      </div>
    ` : ''}
    
    <div style="margin: 30px 0; padding: 20px; background-color: #ecfdf5; border-radius: 6px; border-left: 4px solid #10b981;">
      <h3 style="margin-top: 0; color: #065f46;">About Narcoguard</h3>
      <p style="margin-bottom: 0; color: #065f46;">
        Narcoguard is a life-saving application designed to prevent overdose fatalities through 
        real-time monitoring, community response, and cutting-edge technology. Our mission is to 
        save lives and help people recover from addiction.
      </p>
    </div>
    
    <p style="margin-top: 30px;">
      Need help? Contact our support team at 
      <a href="mailto:narcoguard607@gmail.com" style="color: #6366f1;">narcoguard607@gmail.com</a>
    </p>
  `)

  const text = `
Your Narcoguard Download for ${platformName}

Thank you for downloading Narcoguard. Your download link is ready:

${downloadUrl}

${instructions ? `\nInstallation Instructions:\n${instructions}\n` : ''}

This link will expire in 24 hours for security reasons.

${fallbackUrl ? `\nHaving trouble? Try our alternative download link: ${fallbackUrl}` : ''}

Narcoguard is a life-saving application designed to prevent overdose fatalities. Our mission is to save lives and help people recover from addiction.

For support, please contact narcoguard607@gmail.com

© ${new Date().getFullYear()} Narcoguard. All rights reserved.
  `

  // Send the email
  await sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}

/**
 * Send a contact form submission confirmation email
 */
export async function sendContactConfirmationEmail(email: string, name: string, message: string): Promise<void> {
  const subject = "We've Received Your Message - Narcoguard"

  const html = emailTemplate(`
    <h2 style="color: #1f2937;">Hello ${name},</h2>
    
    <p>Thank you for contacting Narcoguard. We've received your message and will respond as soon as possible, typically within 24-48 hours.</p>
    
    <div class="instructions">
      <p><strong>Your message:</strong></p>
      <p style="font-style: italic;">${message.replace(/\n/g, "<br>")}</p>
    </div>
    
    <p>If your inquiry is urgent, please call our support line at (607) 484-7605.</p>
  `)

  const text = `
We've Received Your Message - Narcoguard

Hello ${name},

Thank you for contacting Narcoguard. We've received your message and will respond as soon as possible, typically within 24-48 hours.

Your message:
${message}

If your inquiry is urgent, please call our support line at (607) 484-7605.

Narcoguard is a life-saving application designed to prevent overdose fatalities. Our mission is to save lives and help people recover from addiction.

© ${new Date().getFullYear()} Narcoguard. All rights reserved.
  `

  // Send the email
  await sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}

/**
 * Send an emergency notification email
 */
export async function sendEmergencyEmail(
  email: string,
  userName: string,
  location: string,
  emergencyType: string,
): Promise<void> {
  const subject = "🚨 EMERGENCY ALERT - Narcoguard User Needs Help"

  const html = emailTemplate(`
    <div style="background-color: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <h2 style="color: #dc2626; margin-top: 0;">🚨 EMERGENCY ALERT</h2>
      <p style="color: #dc2626; font-weight: 600; margin-bottom: 0;">
        ${userName} may be experiencing a ${emergencyType} and needs immediate help.
      </p>
    </div>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Location:</strong> ${location}</p>
      <p style="margin: 10px 0 0 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background-color: #fef3cd; border: 1px solid #fde047; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">⚡ IMMEDIATE ACTION REQUIRED</p>
      <p style="margin: 5px 0 0 0; color: #92400e;">
        Please contact emergency services (911) and provide assistance as soon as possible.
      </p>
    </div>
  `)

  const text = `
🚨 EMERGENCY ALERT - Narcoguard User Needs Help

This is an emergency alert from Narcoguard. ${userName} may be experiencing a ${emergencyType} and needs immediate help.

Location: ${location}
Time: ${new Date().toLocaleString()}

⚡ IMMEDIATE ACTION REQUIRED
Please contact emergency services (911) and provide assistance as soon as possible.

Narcoguard is a life-saving application designed to prevent overdose fatalities. Our mission is to save lives and help people recover from addiction.

© ${new Date().getFullYear()} Narcoguard. All rights reserved.
  `

  // Send the email
  await sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}