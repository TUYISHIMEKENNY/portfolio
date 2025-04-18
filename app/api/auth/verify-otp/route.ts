import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// OTP file path
const OTP_DIR = path.join(process.cwd(), "uploads", "auth")
const OTP_FILE = path.join(OTP_DIR, "otp.json")

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Check if OTP file exists
    if (!fs.existsSync(OTP_FILE)) {
      return NextResponse.json({ error: "No OTP has been generated" }, { status: 400 })
    }

    // Read OTP data
    const otpData = JSON.parse(fs.readFileSync(OTP_FILE, "utf-8"))

    // Check if there's an OTP for this email
    if (!otpData[email]) {
      return NextResponse.json({ error: "No OTP found for this email" }, { status: 400 })
    }

    const { otp: storedOtp, expires } = otpData[email]

    // Check if OTP has expired
    if (Date.now() > expires) {
      // Remove expired OTP
      delete otpData[email]
      fs.writeFileSync(OTP_FILE, JSON.stringify(otpData, null, 2))
      return NextResponse.json({ error: "OTP has expired. Please request a new one" }, { status: 400 })
    }

    // Check if OTP matches
    if (otp !== storedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid, remove it to prevent reuse
    delete otpData[email]
    fs.writeFileSync(OTP_FILE, JSON.stringify(otpData, null, 2))

    // Return success
    return NextResponse.json({ success: true, message: "OTP verified successfully" })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
