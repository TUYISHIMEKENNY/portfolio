import { type NextRequest, NextResponse } from "next/server"
import { generateAndPublishBlogPost } from "@/lib/scheduled-tasks"

// POST /api/cron - Handle scheduled tasks
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a legitimate source (e.g., Vercel Cron)
    // You might want to add additional security checks here

    // Get the current hour to determine if it's morning or evening
    const currentHour = new Date().getHours()
    const timeOfDay = currentHour < 12 ? "morning" : "evening"

    // Generate and publish a blog post
    const result = await generateAndPublishBlogPost(timeOfDay)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to generate blog post" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated and published a ${timeOfDay} blog post`,
      id: result.id,
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ error: "Failed to execute cron job" }, { status: 500 })
  }
}

// GET /api/cron - For testing the cron job manually
export async function GET(request: NextRequest) {
  try {
    // Get the time of day from the query parameter or determine based on current hour
    const timeOfDayParam = request.nextUrl.searchParams.get("timeOfDay")
    let timeOfDay: "morning" | "evening"

    if (timeOfDayParam === "morning" || timeOfDayParam === "evening") {
      timeOfDay = timeOfDayParam
    } else {
      const currentHour = new Date().getHours()
      timeOfDay = currentHour < 12 ? "morning" : "evening"
    }

    // Generate and publish a blog post
    const result = await generateAndPublishBlogPost(timeOfDay)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to generate blog post" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated and published a ${timeOfDay} blog post`,
      id: result.id,
    })
  } catch (error) {
    console.error("Error in manual cron execution:", error)
    return NextResponse.json({ error: "Failed to execute cron job manually" }, { status: 500 })
  }
}
