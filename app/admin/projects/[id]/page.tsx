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
import { ArrowLeft, Plus, Upload, X } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function EditProjectPage({ params }) {
  const projectId = params.id
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    category: "",
    imagePath: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "published", // Add this line
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // Fetch project data
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (response.ok) {
          const data = await response.json()
          setProjectData({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            imagePath: data.imagePath || "",
            liveUrl: data.liveUrl || "",
            githubUrl: data.githubUrl || "",
            featured: data.featured || false,
            status: data.status || "published",
          })
          setTags(data.technologies || [])
          if (data.imagePath) {
            setImagePreview(data.imagePath)
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch project data",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to fetch project data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setProjectData((prev) => ({ ...prev, featured: checked }))
  }

  const handleSelectChange = (value) => {
    setProjectData((prev) => ({ ...prev, category: value }))
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
    if (!imageFile) return projectData.imagePath

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
      return projectData.imagePath
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First upload the image if there is one
      let imagePath = projectData.imagePath
      if (imageFile) {
        imagePath = await uploadImage()
      }

      // Prepare the project data
      const projectToSave = {
        ...projectData,
        imagePath,
        technologies: tags,
      }

      // Update the project
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectToSave),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      toast({
        title: "Success",
        description: "Project updated successfully!",
      })

      // Redirect to the admin dashboard
      router.push("/admin?tab=projects")
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
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
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin?tab=projects"
          className="mb-8 inline-flex items-center text-sm font-medium"
          data-aos="fade-up"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mb-8 text-center" data-aos="fade-up">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Edit Project</h1>
          <p className="mt-2 text-muted-foreground">Update your project details</p>
        </div>

        <Card data-aos="fade-up">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter project title"
                  value={projectData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter project description"
                  value={projectData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={projectData.category} onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullstack">Full-Stack</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
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
                    placeholder="Add technology (e.g., React, Node.js)"
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
                <Label htmlFor="image">Project Image</Label>
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
                          setProjectData((prev) => ({ ...prev, imagePath: "" }))
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Drag and drop your project image here</p>
                      <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP (Max 5MB)</p>
                      <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById("image").click()}
                      >
                        Select Image
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live Demo URL</Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    placeholder="https://example.com"
                    value={projectData.liveUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    placeholder="https://github.com/username/repo"
                    value={projectData.githubUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={projectData.featured} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="featured">Feature this project on the homepage</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <Select
                  value={projectData.status}
                  onValueChange={(value) => setProjectData((prev) => ({ ...prev, status: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Live Project</SelectItem>
                    <SelectItem value="upcoming">Upcoming (No Preview)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin?tab=projects">
                  <Button variant="outline" className="flex-1">
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
