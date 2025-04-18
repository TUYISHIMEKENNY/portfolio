"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, Send, Trash2, Users } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newsletterData, setNewsletterData] = useState({
    subject: "",
    content: "",
    includeBlogPosts: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/newsletter")
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch subscribers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch subscribers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewsletterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setNewsletterData((prev) => ({ ...prev, includeBlogPosts: checked }))
  }

  const handleRemoveSubscriber = async (id) => {
    try {
      const response = await fetch(`/api/newsletter?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSubscribers((prev) => prev.filter((sub) => sub.id !== id))
        toast({
          title: "Success",
          description: "Subscriber removed successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to remove subscriber",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error removing subscriber:", error)
      toast({
        title: "Error",
        description: "Failed to remove subscriber",
        variant: "destructive",
      })
    }
  }

  const handleSendNewsletter = async (e) => {
    e.preventDefault()

    if (!newsletterData.subject || !newsletterData.content) {
      toast({
        title: "Error",
        description: "Subject and content are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsletterData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send newsletter")
      }

      toast({
        title: "Success",
        description: data.message || "Newsletter sent successfully",
      })

      setNewsletterData({
        subject: "",
        content: "",
        includeBlogPosts: true,
      })
    } catch (error) {
      console.error("Error sending newsletter:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send newsletter",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="mb-8 inline-flex items-center text-sm font-medium" data-aos="fade-up">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 text-center" data-aos="fade-up">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Newsletter Management</h1>
          <p className="mt-2 text-muted-foreground">Manage your newsletter subscribers and send newsletters</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Subscribers List */}
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Subscribers ({subscribers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Mail className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No subscribers yet</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  <ul className="space-y-2">
                    {subscribers.map((subscriber) => (
                      <li key={subscriber.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Subscribed on {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSubscriber(subscriber.id)}
                          title="Remove subscriber"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Send Newsletter */}
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendNewsletter} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Newsletter subject"
                    value={newsletterData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Newsletter content"
                    rows={8}
                    value={newsletterData.content}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeBlogPosts"
                    checked={newsletterData.includeBlogPosts}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="includeBlogPosts">Include recent blog posts</Label>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || subscribers.length === 0}>
                  {isSubmitting ? "Sending..." : "Send Newsletter"}
                </Button>
                {subscribers.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    You need subscribers before you can send a newsletter
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Templates */}
        <Card className="mt-8" data-aos="fade-up">
          <CardHeader>
            <CardTitle>Newsletter Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() =>
                  setNewsletterData({
                    subject: "Latest Updates from Ngoma Benjamin",
                    content: `Hello,

I hope this newsletter finds you well. I wanted to share some updates on my recent projects and blog posts.

I've been working on some exciting new projects and have published new content that I think you'll find valuable.

Check out my latest work and let me know what you think!

Best regards,
Ngoma Benjamin
Founder, 301Inc`,
                    includeBlogPosts: true,
                  })
                }
              >
                <h3 className="mb-1 text-left font-bold">Latest Updates</h3>
                <p className="text-xs text-muted-foreground">
                  Share your recent projects and blog posts with subscribers
                </p>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() =>
                  setNewsletterData({
                    subject: "New Tutorial: Web Development Best Practices",
                    content: `Hello,

I've just published a new tutorial on web development best practices that I'm excited to share with you.

In this guide, I cover:
- Modern coding standards
- Performance optimization techniques
- Accessibility considerations
- Security best practices

I hope you find this information helpful for your projects!

Best regards,
Ngoma Benjamin
Founder, 301Inc`,
                    includeBlogPosts: false,
                  })
                }
              >
                <h3 className="mb-1 text-left font-bold">Tutorial Announcement</h3>
                <p className="text-xs text-muted-foreground">Announce a new tutorial or educational content</p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
