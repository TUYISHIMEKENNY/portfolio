"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Bold, Italic, LinkIcon, List, ListOrdered, Plus, Upload, X } from "lucide-react"
import { MarkdownContentWithCopy } from "@/components/MarkdownContentWithCopy"
import AOS from "aos"
import "aos/dist/aos.css"

export default function EditBlogPostPage({ params }) {
  const postId = params.id
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    imagePath: "",
    featured: false,
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // Fetch blog post data
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setPostData({
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: data.category || "",
            imagePath: data.imagePath || "",
            featured: data.featured || false,
          })
          setTags(data.tags || [])
          if (data.imagePath) {
            setImagePreview(data.imagePath)
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch blog post data",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        toast({
          title: "Error",
          description: "Failed to fetch blog post data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId, toast])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Auto-generate slug from title if slug is empty
    if (name === "title" && !postData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      setPostData((prev) => ({ ...prev, [name]: value, slug }))
    } else {
      setPostData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (checked) => {
    setPostData((prev) => ({ ...prev, featured: checked }))
  }

  const handleSelectChange = (value) => {
    setPostData((prev) => ({ ...prev, category: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return postData.imagePath

    const formData = new FormData()
    formData.append("file", imageFile)
    formData.append("type", "image")

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.path
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return postData.imagePath
    }
  }

  const insertFormatting = (format) => {
    const textarea = document.getElementById("content")
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    let newText = ""
    let newCursorPos = 0

    switch (format) {
      case "bold":
        newText = text.substring(0, start) + "**" + text.substring(start, end) + "**" + text.substring(end)
        newCursorPos = end + 4
        break
      case "italic":
        newText = text.substring(0, start) + "*" + text.substring(start, end) + "*" + text.substring(end)
        newCursorPos = end + 2
        break
      case "link":
        newText = text.substring(0, start) + "[" + text.substring(start, end) + "](url)" + text.substring(end)
        newCursorPos = end + 6
        break
      case "ul":
        newText = text.substring(0, start) + "\n- " + text.substring(start, end) + text.substring(end)
        newCursorPos = end + 3
        break
      case "ol":
        newText = text.substring(0, start) + "\n1. " + text.substring(start, end) + text.substring(end)
        newCursorPos = end + 4
        break
      case "h2":
        newText = text.substring(0, start) + "\n## " + text.substring(start, end) + text.substring(end)
        newCursorPos = end + 4
        break
      case "h3":
        newText = text.substring(0, start) + "\n### " + text.substring(start, end) + text.substring(end)
        newCursorPos = end + 5
        break
      case "code":
        newText = text.substring(0, start) + "\n```\n" + text.substring(start, end) + "\n```\n" + text.substring(end)
        newCursorPos = end + 7
        break
      default:
        return
    }

    setPostData((prev) => ({ ...prev, content: newText }))

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First upload the image if there is one
      let imagePath = postData.imagePath
      if (imageFile) {
        imagePath = await uploadImage()
      }

      // Prepare the blog post data
      const postToSave = {
        ...postData,
        imagePath,
        tags,
        author: "Ngoma Benjamin",
        authorImage: "/placeholder.svg?height=100&width=100&text=NB",
        authorBio: "Full-stack developer and founder of 301Inc with a passion for web technologies.",
      }

      // Update the blog post
      const response = await fetch(`/api/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postToSave),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update blog post")
      }

      toast({
        title: "Success",
        description: "Blog post updated successfully!",
      })

      // Redirect to the admin dashboard
      router.push("/admin?tab=blog")
    } catch (error) {
      console.error("Error updating blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin?tab=blog" className="mb-8 inline-flex items-center text-sm font-medium" data-aos="fade-up">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Posts
        </Link>

        <div className="mb-8 text-center" data-aos="fade-up">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Edit Blog Post</h1>
          <p className="mt-2 text-muted-foreground">Update your blog post content</p>
        </div>

        <Card data-aos="fade-up">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  value={postData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex">
                  <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                    /blog/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="your-post-title"
                    value={postData.slug}
                    onChange={handleChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The URL slug is automatically generated from the title, but you can edit it if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Brief summary of your post (appears in previews)"
                  value={postData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={postData.category} onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full p-1 hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag (e.g., React, Web Development)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <div className="rounded-lg border border-dashed p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto h-48 w-full max-w-md overflow-hidden rounded-lg">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(null)
                          setPostData((prev) => ({ ...prev, imagePath: "" }))
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Drag and drop your featured image here</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP (Max 5MB)</p>
                      <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => document.getElementById("image").click()}
                      >
                        Select Image
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => insertFormatting("bold")}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => insertFormatting("italic")}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => insertFormatting("link")}
                      title="Link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => insertFormatting("ul")}
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => insertFormatting("ol")}
                      title="Numbered List"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 bg-transparent"
                      onClick={() => insertFormatting("h2")}
                      title="Heading 2"
                    >
                      H2
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 bg-transparent"
                      onClick={() => insertFormatting("h3")}
                      title="Heading 3"
                    >
                      H3
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 bg-transparent"
                      onClick={() => insertFormatting("code")}
                      title="Code Block"
                    >
                      Code
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your blog post content here... (Supports Markdown)"
                  value={postData.content}
                  onChange={handleChange}
                  rows={15}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Use Markdown for formatting or the toolbar buttons above. Preview will be shown below as you type.
                </p>
              </div>

              {postData.content && (
                <div className="space-y-2 border-t pt-6">
                  <Label>Content Preview</Label>
                  <div className="rounded-md border bg-muted/50 p-4">
                    <MarkdownContentWithCopy content={postData.content} />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={postData.featured} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="featured">Feature this post on the blog homepage</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin?tab=blog">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
