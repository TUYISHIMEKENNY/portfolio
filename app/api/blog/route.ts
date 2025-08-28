import { type NextRequest, NextResponse } from "next/server"
import { getAllItems, saveData } from "@/lib/file-storage"
import { logActivity } from "@/lib/activity-logger"
import slugify from "slugify"
import { sendNewsletterToAll } from "@/lib/email"
import { buildSearchIndex } from "@/lib/search-index"

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const posts = await getAllItems("blog")
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Generate a slug if not provided
    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true })
    }

    // Ensure required fields
    if (!data.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Add metadata for SEO
    data.keywords = data.tags || []
    if (!data.keywords.includes(data.category) && data.category) {
      data.keywords.push(data.category)
    }

    // Add timestamps
    data.createdAt = new Date().toISOString()
    data.updatedAt = new Date().toISOString()

    // Save the blog post
    const id = await saveData("blog", data)

    // Log the activity
    await logActivity("created", "blog", id, data.title)

    try {
      await buildSearchIndex()
      console.log("Search index updated after creating new blog post")
    } catch (indexError) {
      console.error("Error updating search index:", indexError)
      // Continue even if search index update fails
    }

    // Send notification to subscribers about new blog post
    try {
      const subject = `New Blog Post: ${data.title}`
      const content = `
        <p>Hello,</p>
        <p>A new blog post has been published on Ngoma Benjamin's portfolio website:</p>
        <h2>${data.title}</h2>
        <p>${data.excerpt}</p>
        <p>Click the button below to read the full article:</p>
      `

      // Send newsletter with the new blog post
      await sendNewsletterToAll(subject, content, [data])
    } catch (emailError) {
      console.error("Error sending blog post notification:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
