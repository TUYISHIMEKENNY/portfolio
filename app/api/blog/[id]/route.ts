import { type NextRequest, NextResponse } from "next/server"
import { getItemById, saveData, deleteItem } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"

// GET /api/blog/[id] - Get a specific blog post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getItemById("blog", params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingPost = await getItemById("blog", params.id)

    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const data = await request.json()

    // Check if slug is already in use by another post
    if (data.slug && data.slug !== existingPost.slug) {
      const allPosts = await getAllItems("blog")
      const postWithSlug = allPosts.find((p) => p.slug === data.slug && p.id !== params.id)
      if (postWithSlug) {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 })
      }
    }

    const updatedPost = { ...existingPost, ...data, id: params.id }

    await saveData("blog", updatedPost)

    // Log the activity
    await logActivity("updated", "blog", params.id, updatedPost.title)

    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getItemById("blog", params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const success = await deleteItem("blog", params.id)

    if (!success) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Log the activity
    await logActivity("deleted", "blog", params.id, post.title)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}

// Import missing function
import { getAllItems } from "@/lib/file-storage"
