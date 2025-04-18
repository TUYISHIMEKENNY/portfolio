import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { ensureDirectoriesExist } from "./file-storage"

// Define the activity log file path
const ACTIVITY_LOG_PATH = path.join(process.cwd(), "uploads", "activity-log.json")

// Define activity types
export type ActivityType = "created" | "updated" | "deleted" | "uploaded"

// Define activity item interface
export interface ActivityItem {
  id: string
  type: ActivityType
  entityType: "project" | "blog" | "resume"
  entityId: string
  entityTitle: string
  timestamp: string
  userId?: string
  userName?: string
}

// Initialize the activity log file if it doesn't exist
export function initActivityLog() {
  ensureDirectoriesExist()

  if (!fs.existsSync(ACTIVITY_LOG_PATH)) {
    fs.writeFileSync(ACTIVITY_LOG_PATH, JSON.stringify([], null, 2))
  }
}

// Log an activity
export async function logActivity(
  type: ActivityType,
  entityType: "project" | "blog" | "resume",
  entityId: string,
  entityTitle: string,
  userId?: string,
  userName?: string,
): Promise<ActivityItem> {
  initActivityLog()

  // Add this line to ensure type is always a string
  const typeString = String(type)

  const activity: ActivityItem = {
    id: uuidv4(),
    type: typeString as ActivityType, // Use the string version
    entityType,
    entityId,
    entityTitle,
    timestamp: new Date().toISOString(),
    userId,
    userName: userName || "John Doe", // Default user name
  }

  // Read existing activities
  const activitiesJson = await fs.promises.readFile(ACTIVITY_LOG_PATH, "utf-8")
  const activities: ActivityItem[] = JSON.parse(activitiesJson)

  // Add new activity at the beginning
  activities.unshift(activity)

  // Keep only the latest 100 activities
  const trimmedActivities = activities.slice(0, 100)

  // Write back to file
  await fs.promises.writeFile(ACTIVITY_LOG_PATH, JSON.stringify(trimmedActivities, null, 2))

  return activity
}

// Get recent activities
export async function getRecentActivities(limit = 10): Promise<ActivityItem[]> {
  initActivityLog()

  try {
    const activitiesJson = await fs.promises.readFile(ACTIVITY_LOG_PATH, "utf-8")
    const activities: ActivityItem[] = JSON.parse(activitiesJson)
    return activities.slice(0, limit)
  } catch (error) {
    console.error("Error reading activity log:", error)
    return []
  }
}
