import { type NextRequest, NextResponse } from "next/server"
import { getItemById, deleteItem } from "@/lib/file-storage"
import fs from "fs"
import path from "path"

// GET /api/resume/[id] - Get a specific resume
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resume = await getItemById("resume", params.id)

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
  }
}

// DELETE /api/resume/[id] - Delete a resume
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get resume data first to get the file path
    const resume = await getItemById("resume", params.id)

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Delete the resume metadata
    const success = await deleteItem("resume", params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete resume metadata" }, { status: 500 })
    }

    // Delete the actual file if it exists
    if (resume.filePath) {
      const filePath = path.join(process.cwd(), "public", resume.filePath)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
  }
}
