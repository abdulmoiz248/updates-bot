import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: users, error } = await supabase.from("users").select("id")

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    for (const user of users ?? []) {
      try {
        await fetch(`https://updates-bot.vercel.app/api/get-commits/${user.id}`, {
          method: "GET",
        })
      } catch (err) {
        console.error(`Failed for user ${user.id}`, err)
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
