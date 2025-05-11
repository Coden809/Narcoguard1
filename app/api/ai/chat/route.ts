import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { rateLimit } from "@/lib/rate-limit"

// Knowledge base for the AI guide
const KNOWLEDGE_BASE = `
Narcoguard is a revolutionary app designed to prevent opioid overdose deaths through real-time monitoring, community response, and cutting-edge technology.

Key features:
1. Real-time vital sign monitoring
2. Automatic overdose detection
3. Emergency contact notification
4. GPS location sharing
5. Integration with medical records
6. Hero Network community response
7. Naloxone locator
8. CPR and naloxone administration tutorials

How to set up emergency contacts:
1. Go to the "Emergency Contacts" section in settings
2. Add contact information for people who should be notified in case of emergency
3. Choose notification methods (call, text, email)
4. Optionally enable Hero Network to allow nearby volunteers to assist

What to do in case of an overdose:
1. Call 911 immediately
2. Check for responsiveness
3. Administer naloxone if available
4. Perform rescue breathing
5. Place the person in recovery position if breathing
6. Stay with the person until help arrives

The Hero Network is a community of volunteers trained in overdose response who have opted in to receive alerts about nearby emergencies. Heroes receive notifications, location information, and the person's vital signs.

Narcoguard 2 will be an upcoming smartwatch with auto-injecting naloxone technology.
`

// Create system prompt once (immutable)
const SYSTEM_PROMPT = `
You are Guardian AI, the helpful assistant for Narcoguard, a revolutionary app designed to prevent opioid overdose deaths.
You are knowledgeable, compassionate, and focused on providing accurate information about Narcoguard's features and overdose prevention.
For medical emergencies, always emphasize the importance of calling 911.

Use this knowledge base to inform your responses:
${KNOWLEDGE_BASE}

Answer questions briefly and clearly. If you don't know something or if it's outside the scope of Narcoguard, acknowledge that and offer to help with something else.
For medical advice questions, remind the user that you are not a medical professional and they should consult with healthcare providers.
`

// Create a rate limiter - 20 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 100, // Max 100 users per second
  limit: 20, // 20 requests per interval
})

export async function POST(request: Request) {
  // Extract client IP for rate limiting
  const ip = request.headers.get("x-forwarded-for") || "anonymous"

  try {
    // Apply rate limiting
    await limiter.check(5, ip) // 5 requests per minute per IP

    // Parse request body
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate AI response with timeout handling
    const responsePromise = generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Set a timeout for the AI request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI response timeout")), 10000)
    })

    // Race between AI response and timeout
    const { text } = (await Promise.race([responsePromise, timeoutPromise])) as { text: string }

    // Log the interaction (sanitized)
    console.log(
      `User: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}\nAI: ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`,
    )

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI chat:", error)

    // Handle rate limiting errors
    if (error.message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Handle timeout errors
    if (error.message === "AI response timeout") {
      return NextResponse.json({ error: "Request timed out. Please try again." }, { status: 408 })
    }

    // Handle other errors
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
