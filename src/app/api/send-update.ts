

import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL! 

export async function POST(req: NextRequest) {
  try {
    const { progress, project } = await req.json()

    if (!progress || !project) {
      return NextResponse.json({ error: 'Missing progress or project' }, { status: 400 })
    }

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const payload = {
      content: `📅 **Daily Update - ${today}**

🔧 **Project:** ${project}

✅ **Progress:**
${progress}

🧑‍💻 _Sent via internal tool_`,
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
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
