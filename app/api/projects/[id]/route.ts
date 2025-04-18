import { type NextRequest, NextResponse } from "next/server"
import { getItemById, saveData, deleteItem } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"

// GET /api/projects/[id] - Get a specific project
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await getItemById("projects", params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingProject = await getItemById("projects", params.id)

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const data = await request.json()
    const updatedProject = { ...existingProject, ...data, id: params.id }

    await saveData("projects", updatedProject)

    // Log the activity
    await logActivity("updated", "project", params.id, updatedProject.title)

    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await getItemById("projects", params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const success = await deleteItem("projects", params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }

    // Log the activity
    await logActivity("deleted", "project", params.id, project.title)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
