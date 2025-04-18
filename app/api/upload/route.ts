import { type NextRequest, NextResponse } from "next/server"
import { saveImage, saveResume, ensureDirectoriesExist, ensurePublicUploadsSymlink } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"

// POST /api/upload - Handle file uploads
export async function POST(request: NextRequest) {
  try {
    ensurePublicUploadsSymlink()
    ensureDirectoriesExist()

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!type) {
      return NextResponse.json({ error: "File type not specified" }, { status: 400 })
    }

    let result

    if (type === "image") {
      // Handle image upload
      const imagePath = await saveImage(file)
      result = { path: imagePath }

      // Log the activity
      await logActivity("uploaded", "project", "image", file.name)
    } else if (type === "resume") {
      // Handle resume upload
      const metadata = {
        title: (formData.get("title") as string) || file.name,
        description: (formData.get("description") as string) || "",
        isActive: formData.get("isActive") === "true",
      }

      const resumeId = await saveResume(file, metadata)
      result = { id: resumeId }

      // Log the activity
      await logActivity("uploaded", "resume", resumeId, metadata.title || file.name)
    } else {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
