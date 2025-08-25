import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface Comment {
  id: string
  postId: string
  author: string
  content: string
  timestamp: string
  replies: Reply[]
}

interface Reply {
  id: string
  author: string
  content: string
  timestamp: string
}

interface CommentsData {
  [postId: string]: Comment[]
}

const COMMENTS_DIR = path.join(process.cwd(), "data", "comments")
const COMMENTS_FILE = path.join(COMMENTS_DIR, "comments.json")

// Ensure comments directory and file exist
async function ensureCommentsFile() {
  try {
    await fs.access(COMMENTS_DIR)
  } catch {
    await fs.mkdir(COMMENTS_DIR, { recursive: true })
  }

  try {
    await fs.access(COMMENTS_FILE)
  } catch {
    await fs.writeFile(COMMENTS_FILE, JSON.stringify({}))
  }
}

// Read comments from JSON file
async function readComments(): Promise<CommentsData> {
  await ensureCommentsFile()
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Write comments to JSON file
async function writeComments(comments: CommentsData): Promise<void> {
  await ensureCommentsFile()
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2))
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .slice(0, 1000)
}

// GET - Fetch comments for a post
export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params
    const allComments = await readComments()
    const postComments = allComments[postId] || []

    return NextResponse.json({
      success: true,
      comments: postComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 })
  }
}

// POST - Add a new comment
export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params
    const body = await request.json()
    const { author, content } = body

    // Validate input
    if (!author?.trim() || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Author and content are required" }, { status: 400 })
    }

    // Sanitize input
    const sanitizedAuthor = sanitizeInput(author)
    const sanitizedContent = sanitizeInput(content)

    if (!sanitizedAuthor || !sanitizedContent) {
      return NextResponse.json({ success: false, error: "Invalid input provided" }, { status: 400 })
    }

    // Create new comment
    const newComment: Comment = {
      id: generateId(),
      postId,
      author: sanitizedAuthor,
      content: sanitizedContent,
      timestamp: new Date().toISOString(),
      replies: [],
    }

    // Read existing comments
    const allComments = await readComments()
    if (!allComments[postId]) {
      allComments[postId] = []
    }

    // Add new comment
    allComments[postId].push(newComment)

    // Save comments
    await writeComments(allComments)

    // Return updated comments
    return NextResponse.json({
      success: true,
      comments: allComments[postId].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ success: false, error: "Failed to add comment" }, { status: 500 })
  }
}
