import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, name, githubUsername, githubToken, geminiKey } = await req.json()

    const { error } = await supabase.from("users").insert([
      { email, name, github_username: githubUsername, github_token: githubToken, gemini_key: geminiKey },
    ])

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
