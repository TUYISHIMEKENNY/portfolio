import { type NextRequest, NextResponse } from "next/server"
import { getRecentActivities } from "@/lib/activity-logger"

// GET /api/activity - Get recent activities
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limitParam = url.searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10

    const activities = await getRecentActivities(limit)
    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
