"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function ContactPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recipient: "Ngoma Benjamin", // Update recipient name
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send message")
      }

      toast({
        title: "Message sent!",
        description: "Thank you for your message. Ngoma Benjamin will get back to you soon.",
      })

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Have a question or want to work together? Feel free to contact me!
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8" data-aos="fade-right">
            <div>
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="mt-2 text-muted-foreground">Feel free to reach out through any of the following methods.</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">nibenjamin2020@gmail.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+250 (780) 925-937</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">Kigali, Rwanda</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold">Connect with Me</h3>
              <div className="flex gap-4">
                <Link
                  href="https://github.com/NGOMA301"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/ngoma-benjamin-408483336/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="https://x.com/NgomaFx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold">Office Hours</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div data-aos="fade-left">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-2xl font-bold">Send Me a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16" data-aos="fade-up">
          <h2 className="mb-6 text-2xl font-bold">Find Me Here</h2>
          <div className="h-[400px] overflow-hidden rounded-xl bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.553302774984!2d30.05080627480488!3d-1.9307115980517515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca3f7e2241529%3A0x927923c6c8724171!2sKG%20800%20St%2C%20Kigali!5e0!3m2!1sen!2srw!4v1744993262622!5m2!1sen!2srw"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16" data-aos="fade-up">
          <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "How quickly do you respond to inquiries?",
                answer:
                  "I typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate so in your message subject.",
              },
              {
                question: "Do you work with clients remotely?",
                answer:
                  "Yes, I work with clients worldwide. Communication is maintained through regular video calls, emails, and project management tools.",
              },
              {
                question: "What is your typical project process?",
                answer:
                  "My process includes discovery, planning, design, development, testing, and deployment phases. I maintain clear communication throughout to ensure your vision is realized.",
              },
              {
                question: "Do you offer maintenance services after project completion?",
                answer:
                  "Yes, I offer ongoing maintenance and support services to ensure your website or application continues to run smoothly.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
