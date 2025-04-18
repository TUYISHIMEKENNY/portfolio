import { NextResponse } from "next/server"
import { addSubscriber, removeSubscriber, getSubscribers } from "@/lib/email"
import { logActivity } from "@/lib/activity-logger"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate email
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Add subscriber
    const result = await addSubscriber(data.email)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to subscribe" }, { status: 400 })
    }

    // Log activity
    await logActivity({
      type: "newsletter",
      action: "subscribe",
      details: `New newsletter subscription: ${data.email}`,
    })

    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error in newsletter API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const subscribers = await getSubscribers()
    return NextResponse.json(subscribers)
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 })
    }

    const result = await removeSubscriber(id)

    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to unsubscribe" }, { status: 400 })
    }

    // Log activity
    await logActivity({
      type: "newsletter",
      action: "unsubscribe",
      details: `Newsletter unsubscription: ID ${id}`,
    })

    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error in newsletter unsubscribe API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
