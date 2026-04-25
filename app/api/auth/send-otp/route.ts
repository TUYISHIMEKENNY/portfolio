import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import transporter from "@/lib/email"

// Ensure the OTP directory exists
const OTP_DIR = path.join(process.cwd(), "uploads", "auth")
const OTP_FILE = path.join(OTP_DIR, "otp.json")

function ensureOtpDirectoryExists() {
  if (!fs.existsSync(OTP_DIR)) {
    fs.mkdirSync(OTP_DIR, { recursive: true })
  }
  if (!fs.existsSync(OTP_FILE)) {
    fs.writeFileSync(OTP_FILE, JSON.stringify({}))
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    // Store OTP with expiration (10 minutes from now)
    ensureOtpDirectoryExists()
    const otpData = JSON.parse(fs.readFileSync(OTP_FILE, "utf-8"))

    otpData[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    }

    fs.writeFileSync(OTP_FILE, JSON.stringify(otpData, null, 2))

    // Send OTP email
    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP Code",
      text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
      html: getOtpEmailTemplate(otp),
    })

    return NextResponse.json({ success: true, message: "OTP sent successfully" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}

function getOtpEmailTemplate(otp: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Login OTP Code</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px; }
    .header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #4a6cf7; }
    .content { padding: 20px 0; }
    .otp-code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0; color: #4a6cf7; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TUYISHIME KENNY ARAFAT</div>
      <div>Portfolio Admin Access</div>
    </div>
    <div class="content">
      <h2>Your One-Time Password</h2>
      <p>You requested to log in to the admin dashboard. Please use the following OTP code to complete your login:</p>
      <div class="otp-code">${otp}</div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email or contact us if you have concerns.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} TUYISHIME KENNY ARAFAT (KENNYDEV). All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `
}
