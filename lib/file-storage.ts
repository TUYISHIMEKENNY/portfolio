import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Define base upload directory
const UPLOAD_DIR = path.join(process.cwd(), "uploads")

// Ensure upload directories exist
export function ensureDirectoriesExist() {
  const directories = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, "projects"),
    path.join(UPLOAD_DIR, "blog"),
    path.join(UPLOAD_DIR, "resume"),
    path.join(UPLOAD_DIR, "images"),
  ]

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

// Ensure the uploads directory is accessible from the public directory
export function ensurePublicUploadsSymlink() {
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads")

  // Create public/uploads directory if it doesn't exist
  if (!fs.existsSync(publicUploadsDir)) {
    try {
      // First ensure the public directory exists
      const publicDir = path.join(process.cwd(), "public")
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }

      // Create uploads directory in public
      fs.mkdirSync(publicUploadsDir, { recursive: true })

      // Copy files from uploads to public/uploads
      fs.cpSync(UPLOAD_DIR, publicUploadsDir, { recursive: true })
    } catch (error) {
      console.error("Error creating public uploads directory:", error)
    }
  }
}

// Generic function to save data to a JSON file
export async function saveData(type: "projects" | "blog" | "resume", data: any): Promise<string> {
  ensureDirectoriesExist()
  ensurePublicUploadsSymlink()

  // Generate a unique ID if one doesn't exist
  if (!data.id) {
    data.id = uuidv4()
  }

  // Add timestamps
  if (!data.createdAt) {
    data.createdAt = new Date().toISOString()
  }
  data.updatedAt = new Date().toISOString()

  const filePath = path.join(UPLOAD_DIR, type, `${data.id}.json`)

  // Write the data to the file
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2))

  // Update the index file
  await updateIndex(type, data)

  return data.id
}

// Update the index file that contains a list of all items
async function updateIndex(type: "projects" | "blog" | "resume", data: any) {
  const indexPath = path.join(UPLOAD_DIR, type, "index.json")
  let index: any[] = []

  // Read existing index if it exists
  if (fs.existsSync(indexPath)) {
    const indexContent = await fs.promises.readFile(indexPath, "utf-8")
    index = JSON.parse(indexContent)
  }

  // Create a summary object with essential fields
  const summary = {
    id: data.id,
    title: data.title || data.name || "Untitled",
    slug: data.slug || data.id,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }

  // Update or add to the index
  const existingIndex = index.findIndex((item) => item.id === data.id)
  if (existingIndex >= 0) {
    index[existingIndex] = { ...index[existingIndex], ...summary }
  } else {
    index.push(summary)
  }

  // Sort by updatedAt (newest first)
  index.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  // Write the updated index
  await fs.promises.writeFile(indexPath, JSON.stringify(index, null, 2))
}

// Get all items of a specific type
export async function getAllItems(type: "projects" | "blog" | "resume"): Promise<any[]> {
  ensureDirectoriesExist()

  const indexPath = path.join(UPLOAD_DIR, type, "index.json")

  // Return empty array if index doesn't exist
  if (!fs.existsSync(indexPath)) {
    return []
  }

  // Read and parse the index
  const indexContent = await fs.promises.readFile(indexPath, "utf-8")
  const index = JSON.parse(indexContent)

  // For each item in the index, read the full data
  const items = await Promise.all(
    index.map(async (item: any) => {
      const filePath = path.join(UPLOAD_DIR, type, `${item.id}.json`)
      if (fs.existsSync(filePath)) {
        const content = await fs.promises.readFile(filePath, "utf-8")
        return JSON.parse(content)
      }
      return null
    }),
  )

  // Filter out any null items (in case a file was missing)
  return items.filter((item) => item !== null)
}

// Get a single item by ID
export async function getItemById(type: "projects" | "blog" | "resume", id: string): Promise<any | null> {
  const filePath = path.join(UPLOAD_DIR, type, `${id}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const content = await fs.promises.readFile(filePath, "utf-8")
  return JSON.parse(content)
}

// Get a blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<any | null> {
  const posts = await getAllItems("blog")
  return posts.find((post) => post.slug === slug) || null
}

// Delete an item
export async function deleteItem(type: "projects" | "blog" | "resume", id: string): Promise<boolean> {
  const filePath = path.join(UPLOAD_DIR, type, `${id}.json`)

  if (!fs.existsSync(filePath)) {
    return false
  }

  // Delete the file
  await fs.promises.unlink(filePath)

  // Update the index
  const indexPath = path.join(UPLOAD_DIR, type, "index.json")
  if (fs.existsSync(indexPath)) {
    const indexContent = await fs.promises.readFile(indexPath, "utf-8")
    let index = JSON.parse(indexContent)

    // Remove the item from the index
    index = index.filter((item: any) => item.id !== id)

    // Write the updated index
    await fs.promises.writeFile(indexPath, JSON.stringify(index, null, 2))
  }

  return true
}

// Save an uploaded image
export async function saveImage(file: File): Promise<string> {
  ensureDirectoriesExist()
  ensurePublicUploadsSymlink()

  const fileId = uuidv4()
  const fileExtension = file.name.split(".").pop() || "jpg"
  const fileName = `${fileId}.${fileExtension}`
  const filePath = path.join(UPLOAD_DIR, "images", fileName)
  const publicFilePath = path.join(process.cwd(), "public", "uploads", "images", fileName)

  // Convert file to buffer and save
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Save to uploads directory
  await fs.promises.writeFile(filePath, buffer)

  // Ensure public/uploads/images directory exists
  const publicImagesDir = path.join(process.cwd(), "public", "uploads", "images")
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true })
  }

  // Copy to public directory
  await fs.promises.writeFile(publicFilePath, buffer)

  // Return the path relative to the public directory
  return `/uploads/images/${fileName}`
}

// Save a resume file
export async function saveResume(file: File, metadata: any): Promise<string> {
  ensureDirectoriesExist()

  const fileId = uuidv4()
  const fileExtension = file.name.split(".").pop() || "pdf"
  const fileName = `${fileId}.${fileExtension}`
  const filePath = path.join(UPLOAD_DIR, "resume", fileName)

  // Convert file to buffer and save
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fs.promises.writeFile(filePath, buffer)

  // Create metadata with file info
  const data = {
    ...metadata,
    id: fileId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    filePath: `/uploads/resume/${fileName}`,
    isActive: metadata.isActive || false,
  }

  // Save metadata
  await saveData("resume", data)

  // If this resume is set as active, deactivate others
  if (data.isActive) {
    await setActiveResume(fileId)
  }

  return fileId
}

// Set a resume as the active one
export async function setActiveResume(id: string): Promise<void> {
  const resumes = await getAllItems("resume")

  for (const resume of resumes) {
    if (resume.id === id) {
      resume.isActive = true
    } else {
      resume.isActive = false
    }
    await saveData("resume", resume)
  }
}

// Get the active resume
export async function getActiveResume(): Promise<any | null> {
  const resumes = await getAllItems("resume")
  return resumes.find((resume) => resume.isActive) || (resumes.length > 0 ? resumes[0] : null)
}



