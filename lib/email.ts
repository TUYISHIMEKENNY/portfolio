import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
import { ensureDirectoriesExist } from "./file-storage"

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com"
const EMAIL_PORT = Number.parseInt(process.env.EMAIL_PORT || "587", 10)
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true"
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD,
  },
})

// Newsletter subscribers storage
const SUBSCRIBERS_DIR = path.join(process.cwd(), "uploads", "newsletter")
const SUBSCRIBERS_FILE = path.join(SUBSCRIBERS_DIR, "subscribers.json")

// Ensure the newsletter directory exists
export function ensureNewsletterDirectoryExists() {
  ensureDirectoriesExist()
  if (!fs.existsSync(SUBSCRIBERS_DIR)) {
    fs.mkdirSync(SUBSCRIBERS_DIR, { recursive: true })
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]))
  }
}

// Get all subscribers
export async function getSubscribers() {
  ensureNewsletterDirectoryExists()
  const data = await fs.promises.readFile(SUBSCRIBERS_FILE, "utf-8")
  return JSON.parse(data)
}

// Add a new subscriber
export async function addSubscriber(email: string) {
  ensureNewsletterDirectoryExists()
  const subscribers = await getSubscribers()

  // Check if email already exists
  if (subscribers.some((sub) => sub.email === email)) {
    return { success: false, message: "Email already subscribed" }
  }

  // Add new subscriber
  const newSubscriber = {
    id: Date.now().toString(),
    email,
    subscribed: true,
    subscribedAt: new Date().toISOString(),
  }

  subscribers.push(newSubscriber)
  await fs.promises.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))

  // Send welcome email
  await sendWelcomeEmail(email)

  return { success: true, message: "Successfully subscribed" }
}

// Remove a subscriber
export async function removeSubscriber(id: string) {
  ensureNewsletterDirectoryExists()
  const subscribers = await getSubscribers()
  const updatedSubscribers = subscribers.filter((sub) => sub.id !== id)
  await fs.promises.writeFile(SUBSCRIBERS_FILE, JSON.stringify(updatedSubscribers, null, 2))
  return { success: true, message: "Successfully unsubscribed" }
}

// Send contact form email
export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: `Contact Form: ${data.subject}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h2 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Contact Form Submission</h2>
  <p><strong>From:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
  </div>
  <p style="margin-top: 20px; font-size: 12px; color: #777;">This email was sent from your portfolio website contact form.</p>
</div>
      `,
    })

    // Send confirmation to the sender
    await transporter.sendMail({
      from: `"Ngoma Benjamin" <${EMAIL_USER}>`,
      to: data.email,
      subject: `Thank you for your message: ${data.subject}`,
      text: `
Dear ${data.name},

Thank you for contacting me. I have received your message and will get back to you as soon as possible.

Best regards,
Ngoma Benjamin
Founder, 301Inc
      `,
      html: getConfirmationEmailTemplate(data.name),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Send welcome email to new subscribers
export async function sendWelcomeEmail(email: string) {
  try {
    await transporter.sendMail({
      from: `"Ngoma Benjamin" <${EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Ngoma Benjamin's Newsletter!",
      text: `
Thank you for subscribing to my newsletter!

You'll now receive updates on my latest projects, blog posts, and insights on web development.

If you ever want to unsubscribe, simply click the unsubscribe link at the bottom of any newsletter email.

Best regards,
Ngoma Benjamin
Founder, 301Inc
      `,
      html: getWelcomeEmailTemplate(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error: error.message }
  }
}

// Send newsletter to all subscribers
export async function sendNewsletterToAll(subject: string, content: string, blogPosts = []) {
  try {
    const subscribers = await getSubscribers()

    if (subscribers.length === 0) {
      return { success: false, message: "No subscribers found" }
    }

    // Send to each subscriber
    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: `"Ngoma Benjamin" <${EMAIL_USER}>`,
        to: subscriber.email,
        subject: subject,
        text: content,
        html: getNewsletterTemplate(subject, content, blogPosts, subscriber.id),
      })
    }

    return { success: true, message: `Newsletter sent to ${subscribers.length} subscribers` }
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return { success: false, error: error.message }
  }
}

// Email Templates
function getConfirmationEmailTemplate(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Message</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px; }
    .header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #4a6cf7; }
    .content { padding: 20px 0; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
    .button { display: inline-block; background-color: #4a6cf7; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Ngoma Benjamin</div>
      <div>Founder, 301Inc</div>
    </div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to me through my portfolio website. I've received your message and will review it promptly.</p>
      <p>I typically respond within 24-48 hours during business days. If your matter is urgent, please feel free to connect with me directly through my social media channels.</p>
      <p>In the meantime, feel free to explore more of my work and blog posts on my website.</p>
      <p>Best regards,<br>Ngoma Benjamin</p>
      <center><a href="https://ngomabenjamin.com" class="button">Visit My Portfolio</a></center>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Ngoma Benjamin (ngoma301). All rights reserved.</p>
      <p>This is an automated response to your contact form submission.</p>
    </div>
  </div>
</body>
</html>
  `
}

function getWelcomeEmailTemplate() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Ngoma Benjamin's Newsletter</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px; }
    .header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #4a6cf7; }
    .content { padding: 20px 0; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
    .button { display: inline-block; background-color: #4a6cf7; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
    .social { text-align: center; margin-top: 20px; }
    .social a { display: inline-block; margin: 0 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Ngoma Benjamin</div>
      <div>Founder, 301Inc</div>
    </div>
    <div class="content">
      <h2>Welcome to My Newsletter!</h2>
      <p>Thank you for subscribing to my newsletter. I'm excited to share my journey, insights, and latest projects with you.</p>
      <p>Here's what you can expect:</p>
      <ul>
        <li>Weekly updates on my latest projects and work</li>
        <li>Tutorials and guides on web development</li>
        <li>Insights into the tech industry</li>
        <li>Tips and tricks I've learned along the way</li>
      </ul>
      <p>Stay tuned for my first newsletter coming your way soon!</p>
      <center><a href="https://ngomabenjamin.com/blog" class="button">Check Out My Blog</a></center>
      
      <div class="social">
        <p>Connect with me:</p>
        <a href="https://github.com/ngoma301">GitHub</a> | 
        <a href="https://linkedin.com/in/ngomabenjamin">LinkedIn</a> | 
        <a href="https://twitter.com/ngoma301">Twitter</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Ngoma Benjamin (ngoma301). All rights reserved.</p>
      <p>You're receiving this email because you subscribed to my newsletter. If you'd like to unsubscribe, click <a href="https://ngomabenjamin.com/unsubscribe">here</a>.</p>
    </div>
  </div>
</body>
</html>
  `
}

function getNewsletterTemplate(subject: string, content: string, blogPosts = [], subscriberId: string) {
  const blogPostsHTML =
    blogPosts.length > 0
      ? `
      <h3>Latest Blog Posts</h3>
      <ul style="padding-left: 20px;">
        ${blogPosts
          .map(
            (post) => `
          <li style="margin-bottom: 15px;">
            <a href="https://ngomabenjamin.com/blog/${post.slug}" style="color: #4a6cf7; font-weight: bold; text-decoration: none;">${post.title}</a>
            <p style="margin: 5px 0;">${post.excerpt}</p>
          </li>
        `,
          )
          .join("")}
      </ul>
    `
      : ""

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { border: 1px solid #e0e0e0; border-radius: 5px; padding: 20px; }
    .header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #4a6cf7; }
    .content { padding: 20px 0; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; }
    .button { display: inline-block; background-color: #4a6cf7; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
    .social { text-align: center; margin-top: 20px; }
    .social a { display: inline-block; margin: 0 10px; }
    .blog-posts { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Ngoma Benjamin</div>
      <div>Founder, 301Inc</div>
    </div>
    <div class="content">
      <h2>${subject}</h2>
      <div>${content.replace(/\n/g, "<br>")}</div>
      
      ${blogPosts.length > 0 ? `<div class="blog-posts">${blogPostsHTML}</div>` : ""}
      
      <center><a href="https://ngomabenjamin.com" class="button">Visit My Portfolio</a></center>
      
      <div class="social">
        <p>Connect with me:</p>
        <a href="https://github.com/ngoma301">GitHub</a> | 
        <a href="https://linkedin.com/in/ngomabenjamin">LinkedIn</a> | 
        <a href="https://twitter.com/ngoma301">Twitter</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Ngoma Benjamin (ngoma301). All rights reserved.</p>
      <p>You're receiving this email because you subscribed to my newsletter. If you'd like to unsubscribe, click <a href="https://ngomabenjamin.com/api/newsletter/unsubscribe?id=${subscriberId}">here</a>.</p>
    </div>
  </div>
</body>
</html>
  `
}

export default transporter
