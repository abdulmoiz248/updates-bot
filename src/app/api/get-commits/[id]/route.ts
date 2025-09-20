import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { GoogleGenAI } from "@google/genai"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!


async function summarizeWithGemini(progressText: string, geminiKey: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: geminiKey })

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        parts: [
          {
            text: `You are Abdul Moiz's professional assistant. Write today's progress **in Abdul's voice**, as if he is reporting what he accomplished. 
- Use a professional but direct tone (first person, e.g. "I added...", "I fixed..."). 
- Rely only on the provided commit messages and repository names. 
- Expand short commit messages into clear, professional descriptions of what was done. 
- If multiple commits exist, merge them into a smooth summary of work. 
- Output 3–5 sentences max. 
- Do not mention "commits", "repository", "test commit", or "bot validation". 
- Just describe the actual work done and outcomes as if Abdul himself is explaining.

Here are the updates to base the report on:
${progressText}`,
          },
        ],
      },
    ],
  })

  const summary = res?.text?.trim()
  return summary && summary.length > 0 ? summary : null
}



export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const userId = id

    const { data: user, error } = await supabase
      .from("users")
      .select("github_token, github_username, email, name, gemini_key")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("❌ Supabase error:", error)
    }
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const githubToken = user.github_token
    const githubUser = user.github_username || user.email
    const geminiKey = user.gemini_key

   const today = new Date().toISOString().split("T")[0]


    const apiUrl = `https://api.github.com/search/commits?q=author:${githubUser}+committer-date:${today}`

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.cloak-preview+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: `GitHub API error: ${text}` },
        { status: 500 }
      )
    }

    const data = await res.json()
    const commits: string[] = []
    const repos: string[] = []

    if (data.items) {
      for (const item of data.items) {
        commits.push(item.commit.message)
        repos.push(item.repository.full_name.split("/").pop())
      }
    }

    const uniqueRepos = [...new Set(repos)]

    const progressText =
      commits.length > 0
        ? `Commits made today:\n${commits.join("\n")}\n\nProjects worked on:\n${uniqueRepos.join(
            "\n"
          )}`
        : "No commits today."

    const summary = await summarizeWithGemini(progressText, geminiKey)
    if (!summary) {
      return NextResponse.json(
        { error: "Summary generation failed" },
        { status: 500 }
      )
    }

    const todayFormatted = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const workingOn =
      uniqueRepos.length > 0
        ? `💼 **Working On:** ${uniqueRepos.join(", ")}`
        : ""

    const payload = {
      content: `📅 **Date:** ${todayFormatted}

👤 **Name:** ${user.name || githubUser}

🎯 **Outcome Completed:**
${summary}

${workingOn}
`,
    }

    const discordRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!discordRes.ok) {
      return NextResponse.json(
        { error: "Failed to send to Discord" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, commits, repos: uniqueRepos })
  } catch (err: any) {
    console.error("💥 Server error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
