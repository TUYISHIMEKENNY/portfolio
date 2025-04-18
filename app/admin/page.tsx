"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FolderPlus, PenSquare, Plus, Upload, Download, Mail, Bot } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import AdminHeader from "@/components/admin-header"

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [resumes, setResumes] = useState([])
  const [activities, setActivities] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState({
    projects: true,
    blogPosts: true,
    resumes: true,
    activities: true,
    subscribers: true,
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // Set active tab from URL parameter if present
    if (tabParam && ["overview", "projects", "blog", "resume", "newsletter"].includes(tabParam)) {
      setActiveTab(tabParam)
    }

    // Fetch data based on active tab
    const fetchData = async () => {
      if (activeTab === "overview" || activeTab === "projects") {
        fetchProjects()
      }
      if (activeTab === "overview" || activeTab === "blog") {
        fetchBlogPosts()
      }
      if (activeTab === "overview" || activeTab === "resume") {
        fetchResumes()
      }
      if (activeTab === "overview") {
        fetchActivities()
      }
      if (activeTab === "newsletter") {
        fetchSubscribers()
      }
    }

    fetchData()
  }, [activeTab, tabParam])

  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }))
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }))
    }
  }

  const fetchBlogPosts = async () => {
    try {
      setLoading((prev) => ({ ...prev, blogPosts: true }))
      const response = await fetch("/api/blog")
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data)
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading((prev) => ({ ...prev, blogPosts: false }))
    }
  }

  const fetchResumes = async () => {
    try {
      setLoading((prev) => ({ ...prev, resumes: true }))
      const response = await fetch("/api/resume")
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
    } finally {
      setLoading((prev) => ({ ...prev, resumes: false }))
    }
  }

  const fetchActivities = async () => {
    try {
      setLoading((prev) => ({ ...prev, activities: true }))
      const response = await fetch("/api/activity")
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading((prev) => ({ ...prev, activities: false }))
    }
  }

  const fetchSubscribers = async () => {
    try {
      setLoading((prev) => ({ ...prev, subscribers: true }))
      const response = await fetch("/api/newsletter/subscribers")
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
    } finally {
      setLoading((prev) => ({ ...prev, subscribers: false }))
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Remove the project from the state
        setProjects(projects.filter((project) => project.id !== id))
        // Refresh activities if on overview tab
        if (activeTab === "overview") {
          fetchActivities()
        }
      } else {
        console.error("Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleDeleteBlogPost = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Remove the blog post from the state
        setBlogPosts(blogPosts.filter((post) => post.id !== id))
        // Refresh activities if on overview tab
        if (activeTab === "overview") {
          fetchActivities()
        }
      } else {
        console.error("Failed to delete blog post")
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
    }
  }

  const formatActivityType = (type) => {
    // Ensure type is a string
    const typeStr = String(type)

    switch (typeStr) {
      case "created":
        return "Created"
      case "updated":
        return "Updated"
      case "deleted":
        return "Deleted"
      case "uploaded":
        return "Uploaded"
      default:
        return typeStr
    }
  }

  const formatEntityType = (type) => {
    switch (type) {
      case "project":
        return "Project"
      case "blog":
        return "Blog Post"
      case "resume":
        return "Resume"
      default:
        return type
    }
  }

  const getActivityIcon = (entityType) => {
    switch (entityType) {
      case "blog":
        return <PenSquare className="h-5 w-5 text-primary" />
      case "project":
        return <FolderPlus className="h-5 w-5 text-primary" />
      case "resume":
        return <FileText className="h-5 w-5 text-primary" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <AdminHeader />
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Admin Dashboard</h1>
          <p className="mt-4 text-xl text-muted-foreground">Manage your portfolio content, blog posts, and resume</p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-20">
          <TabsList className="mb-8 flex w-full flex-wrap justify-center gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="auto-blog">Auto Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card data-aos="fade-up">
                <CardHeader className="pb-2">
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Manage your portfolio projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{loading.projects ? "..." : projects.length}</span>
                      <span className="text-sm text-muted-foreground">Total Projects</span>
                    </div>
                    <Link href="/admin/projects/new">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add New Project
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("projects")}>
                      Manage Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="100">
                <CardHeader className="pb-2">
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>Manage your blog content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{loading.blogPosts ? "..." : blogPosts.length}</span>
                      <span className="text-sm text-muted-foreground">Total Posts</span>
                    </div>
                    <Link href="/admin/blog/new">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Create New Post
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("blog")}>
                      Manage Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="200">
                <CardHeader className="pb-2">
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Manage your subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{loading.subscribers ? "..." : subscribers.length}</span>
                      <span className="text-sm text-muted-foreground">Subscribers</span>
                    </div>
                    <Link href="/admin/newsletter">
                      <Button className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Manage Newsletter
                      </Button>
                    </Link>
                    <Link href="/admin/newsletter">
                      <Button variant="outline" className="w-full">
                        Send Newsletter
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="250">
                <CardHeader className="pb-2">
                  <CardTitle>Auto Blog</CardTitle>
                  <CardDescription>Manage AI-generated blog posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Automatically generates web development tutorials
                      </span>
                    </div>
                    <Link href="/admin/auto-blog">
                      <Button className="w-full">
                        <Bot className="mr-2 h-4 w-4" /> Manage Auto Blog
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="300">
                <CardHeader className="pb-2">
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Update your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {loading.resumes
                          ? "Loading..."
                          : resumes.find((r) => r.isActive)
                            ? `Last updated: ${new Date(
                                resumes.find((r) => r.isActive).updatedAt,
                              ).toLocaleDateString()}`
                            : "No active resume"}
                      </span>
                    </div>
                    <Link href="/admin/resume">
                      <Button className="w-full">
                        <Upload className="mr-2 h-4 w-4" /> Upload New Resume
                      </Button>
                    </Link>
                    <Link href="/resume">
                      <Button variant="outline" className="w-full">
                        View Current Resume
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12" data-aos="fade-up">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest content updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.activities ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No recent activity</div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            {getActivityIcon(activity.entityType)}
                            <div>
                              <p className="font-medium">{activity.entityTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge type={typeof activity.type === "string" ? activity.type.toLowerCase() : "default"}>
                            {formatActivityType(activity.type)} {formatEntityType(activity.entityType)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Projects</h2>
              <Link href="/admin/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Project
                </Button>
              </Link>
            </div>
            {loading.projects ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {projects.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground">No projects found. Create your first project!</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-6 py-4 text-left font-medium">Title</th>
                            <th className="px-6 py-4 text-left font-medium">Category</th>
                            <th className="px-6 py-4 text-left font-medium">Date</th>
                            <th className="px-6 py-4 text-left font-medium">Status</th>
                            <th className="px-6 py-4 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project) => (
                            <tr key={project.id} className="border-b last:border-0">
                              <td className="px-6 py-4">{project.title}</td>
                              <td className="px-6 py-4 capitalize">{project.category}</td>
                              <td className="px-6 py-4">
                                {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "Unknown"}
                              </td>
                              <td className="px-6 py-4">
                                <Badge type={project.featured ? "published" : "drafted"}>
                                  {project.featured ? "Featured" : "Regular"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/admin/projects/${project.id}`}>
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleDeleteProject(project.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="blog">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
              <Link href="/admin/blog/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create New Post
                </Button>
              </Link>
            </div>
            {loading.blogPosts ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {blogPosts.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground">No blog posts found. Create your first post!</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-6 py-4 text-left font-medium">Title</th>
                            <th className="px-6 py-4 text-left font-medium">Category</th>
                            <th className="px-6 py-4 text-left font-medium">Date</th>
                            <th className="px-6 py-4 text-left font-medium">Status</th>
                            <th className="px-6 py-4 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogPosts.map((post) => (
                            <tr key={post.id} className="border-b last:border-0">
                              <td className="px-6 py-4">{post.title}</td>
                              <td className="px-6 py-4">{post.category}</td>
                              <td className="px-6 py-4">
                                {post.updatedAt
                                  ? new Date(post.updatedAt).toLocaleDateString()
                                  : post.date || "Unknown"}
                              </td>
                              <td className="px-6 py-4">
                                <Badge type={post.featured ? "published" : "drafted"}>
                                  {post.featured ? "Featured" : "Regular"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/admin/blog/${post.id}`}>
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleDeleteBlogPost(post.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resume">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Resume</h2>
              <Link href="/admin/resume">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload New Resume
                </Button>
              </Link>
            </div>
            <ResumeManager resumes={resumes} loading={loading.resumes} onRefresh={fetchResumes} />
          </TabsContent>

          <TabsContent value="newsletter">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Newsletter Management</h2>
              <Link href="/admin/newsletter">
                <Button>
                  <Mail className="mr-2 h-4 w-4" /> Manage Newsletter
                </Button>
              </Link>
            </div>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Manage your newsletter subscribers and send newsletters from the dedicated page.
              </p>
              <Link href="/admin/newsletter">
                <Button size="lg">Go to Newsletter Management</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="auto-blog">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Manage your AI-generated blog posts from the dedicated page.</p>
              <Link href="/admin/auto-blog">
                <Button size="lg">Go to Auto Blog Management</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Badge({ children, type }) {
  const getColor = () => {
    switch (type) {
      case "published":
      case "created":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "updated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "drafted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "uploaded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getColor()}`}>{children}</span>
}

function ResumeManager({ resumes, loading, onRefresh }) {
  const handleSetActive = async (id) => {
    try {
      const response = await fetch("/api/resume", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        // Refresh the resumes list
        onRefresh()
      } else {
        console.error("Failed to set active resume")
      }
    } catch (error) {
      console.error("Error setting active resume:", error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh the resumes list
        onRefresh()
      } else {
        console.error("Failed to delete resume")
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {resumes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No resumes uploaded yet. Upload your first resume!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resume History</h3>
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className={`h-8 w-8 ${resume.isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium">{resume.title || resume.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(resume.updatedAt).toLocaleDateString()} •{" "}
                        {((resume.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                        {resume.isActive && <span className="ml-2 text-primary">(Active)</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {resume.filePath && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={resume.filePath} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    )}
                    {!resume.isActive && (
                      <Button variant="outline" size="sm" onClick={() => handleSetActive(resume.id)}>
                        Set Active
                      </Button>
                    )}
                    {!resume.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(resume.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
