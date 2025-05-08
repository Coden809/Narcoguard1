import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

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

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Create system prompt
    const systemPrompt = `
      You are Guardian AI, the helpful assistant for Narcoguard, a revolutionary app designed to prevent opioid overdose deaths.
      You are knowledgeable, compassionate, and focused on providing accurate information about Narcoguard's features and overdose prevention.
      For medical emergencies, always emphasize the importance of calling 911.
      
      Use this knowledge base to inform your responses:
      ${KNOWLEDGE_BASE}
      
      Answer questions briefly and clearly. If you don't know something or if it's outside the scope of Narcoguard, acknowledge that and offer to help with something else.
      For medical advice questions, remind the user that you are not a medical professional and they should consult with healthcare providers.
    `

    // Generate AI response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Log the interaction
    console.log(`User: ${message}\nAI: ${text}`)

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
