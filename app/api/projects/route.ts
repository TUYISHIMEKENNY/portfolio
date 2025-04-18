import { type NextRequest, NextResponse } from "next/server"
import { getAllItems, saveData } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const projects = await getAllItems("projects")
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 })
    }

    const id = await saveData("projects", data)

    // Log the activity
    await logActivity("created", "project", id, data.title)

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
