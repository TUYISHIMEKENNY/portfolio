import { type NextRequest, NextResponse } from "next/server"
import { getAllItems, getActiveResume, setActiveResume } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"

// GET /api/resume - Get all resumes or active resume
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const active = url.searchParams.get("active")

    if (active === "true") {
      const resume = await getActiveResume()
      return NextResponse.json(resume || { error: "No active resume found" })
    } else {
      const resumes = await getAllItems("resume")
      return NextResponse.json(resumes)
    }
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 })
  }
}

// PUT /api/resume/active - Set active resume
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 })
    }

    await setActiveResume(data.id)

    // Log the activity
    await logActivity("updated", "resume", data.id, "Resume set as active")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting active resume:", error)
    return NextResponse.json({ error: "Failed to set active resume" }, { status: 500 })
  }
}
