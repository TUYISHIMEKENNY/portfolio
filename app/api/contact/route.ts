import { NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/email"
import { logActivity } from "@/lib/activity-logger"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json({ error: "Name, email, subject, and message are required" }, { status: 400 })
    }

    // Send email
    const result = await sendContactEmail(data)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }

    // Log activity
    await logActivity({
      type: "contact",
      action: "submit",
      details: `Contact form submitted by ${data.name} (${data.email})`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
