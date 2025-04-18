import { NextResponse } from "next/server"
import { sendNewsletterToAll } from "@/lib/email"
import { getAllItems } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.subject || !data.content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 })
    }

    // Get recent blog posts if needed
    let blogPosts = []
    if (data.includeBlogPosts) {
      blogPosts = await getAllItems("blog")
      blogPosts = blogPosts.slice(0, 3) // Get the 3 most recent posts
    }

    // Send newsletter
    const result = await sendNewsletterToAll(data.subject, data.content, blogPosts)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to send newsletter" }, { status: 500 })
    }

    // Log activity
    await logActivity({
      type: "newsletter",
      action: "send",
      details: `Newsletter sent: "${data.subject}" to ${result.message.split(" ")[3]} subscribers`,
    })

    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error in newsletter send API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
