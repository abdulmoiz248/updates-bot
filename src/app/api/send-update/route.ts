import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai";






const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!

async function summarizeWithGemini(progressText: string): Promise<string | null> {

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

  const res = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: [
      {
        parts: [
          {
       
       text: `You are Abdul Moiz's professional assistant. He will provide updates in an informal or chaotic tone. Your task is to rephrase the message in a **clear, professional tone** in exactly **3 to 4 concise sentences**, summarizing only the key progress or actions taken. **Do not include greetings, context, or unnecessary explanation and dont include anything about what is done if not provided just tell done this.** Just summarize directly. Here is the update:\n${progressText}`
 },
        ],
      },
    ],
  })

  const summary = res?.text?.trim()
  return summary && summary.length > 0 ? summary : null
}

export async function POST(req: NextRequest) {
  try {
    const { progress, project } = await req.json()

    if (!progress) {
      return NextResponse.json({ error: 'Missing progress' }, { status: 400 })
    }

    const summary = await summarizeWithGemini(progress)
    if (!summary) {
      return NextResponse.json({ error: 'Summary generation failed' }, { status: 500 })
    }

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const name = 'Abdul Moiz'
    const workingOn = project ? `💼 **Working On:** ${project}\n\n` : ''

    const payload = {
      content: `📅 **Date:** ${today}

👤 **Name:** ${name}

🎯 **Outcome Completed:**
${summary}

${workingOn}
`,
    }

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to send to Discord' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
