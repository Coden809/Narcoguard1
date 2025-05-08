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
    const transporter = nodemailer.createTransport({
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

// Update the email template to include the new logo
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Narcoguard</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { width: 100px; height: 100px; border-radius: 50%; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png" alt="Narcoguard Logo" class="logo">
      <h1>Narcoguard</h1>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} Narcoguard. All rights reserved.</p>
      <p>Contact: narcoguard607@gmail.com | (607) 484-7605</p>
    </div>
  </div>
</body>
</html>
`

/**
 * Send a download email with links to the requested platform
 * @param email Recipient email address
 * @param downloadUrl Download URL for the requested platform
 * @param platform Platform identifier
 * @param fallbackUrl Optional fallback download URL
 */
export async function sendDownloadEmail(
  email: string,
  downloadUrl: string,
  platform: string,
  fallbackUrl?: string,
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

  // Create email content
  const subject = `Your Narcoguard Download for ${platformName}`

  const html = emailTemplate(`
      
      <p>Thank you for downloading Narcoguard for ${platformName}. Your download link is ready below:</p>
      
      <p style="text-align: center;">
        <a href="${downloadUrl}" class="button">Download Narcoguard for ${platformName}</a>
      </p>
      
      <p>This link will expire in 24 hours for security reasons. If you didn't request this download, please ignore this email.</p>
      
      ${
        fallbackUrl
          ? `
      
        <p><strong>Having trouble with the download?</strong></p>
        <p>If the main download link doesn't work, please try our alternative download:</p>
        <p style="text-align: center;">
          <a href="${fallbackUrl}" class="button" style="background-color: #666;">Alternative Download</a>
        </p>
      
      `
          : ""
      }
      
      
  `)

  const text = `
Your Narcoguard Download for ${platformName}

Thank you for downloading Narcoguard. Your download link is ready:

${downloadUrl}

This link will expire in 24 hours for security reasons.

${fallbackUrl ? `\nHaving trouble? Try our alternative download link: ${fallbackUrl}` : ""}

Narcoguard is a life-saving application designed to prevent overdose fatalities. Our mission is to save lives and help people recover from addiction.

For support, please contact support@narcoguard.org

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
 * @param email Recipient email address
 * @param name Name of the person who submitted the form
 * @param message Message content from the contact form
 */
export async function sendContactConfirmationEmail(email: string, name: string, message: string): Promise<void> {
  const subject = "We've Received Your Message - Narcoguard"

  const html = emailTemplate(`
      
      <p>Hello ${name},</p>
      
      <p>Thank you for contacting Narcoguard. We've received your message and will respond as soon as possible, typically within 24-48 hours.</p>
      
      
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      
      
      <p>If your inquiry is urgent, please call our support line at (555) 123-4567.</p>
      
      
  `)

  const text = `
We've Received Your Message - Narcoguard

Hello ${name},

Thank you for contacting Narcoguard. We've received your message and will respond as soon as possible, typically within 24-48 hours.

Your message:
${message}

If your inquiry is urgent, please call our support line at (555) 123-4567.

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
 * @param email Recipient email address
 * @param userName Name of the user experiencing the emergency
 * @param location Location of the emergency
 * @param emergencyType Type of emergency
 */
export async function sendEmergencyEmail(
  email: string,
  userName: string,
  location: string,
  emergencyType: string,
): Promise<void> {
  const subject = "EMERGENCY ALERT - Narcoguard User Needs Help"

  const html = emailTemplate(`
      
      <p>This is an emergency alert from Narcoguard. ${userName} may be experiencing a ${emergencyType} and needs immediate help.</p>
      
      <p>Location: <span class="location">${location}</span></p>
      
      <p>Please contact emergency services and provide assistance as soon as possible.</p>
      
      
  `)

  const text = `
EMERGENCY ALERT - Narcoguard User Needs Help

This is an emergency alert from Narcoguard. ${userName} may be experiencing a ${emergencyType} and needs immediate help.

Location: ${location}

Please contact emergency services and provide assistance as soon as possible.

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
