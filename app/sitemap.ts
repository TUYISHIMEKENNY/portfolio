import type { MetadataRoute } from "next"
import { getAllItems } from "@/lib/file-storage"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = "https://ngomabenjamin.com"

  // Get all blog posts
  let blogPosts = []
  try {
    blogPosts = await getAllItems("blog")
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error)
  }

  // Get all projects
  let projects = []
  try {
    projects = await getAllItems("projects")
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error)
  }

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Add blog posts to sitemap
  const blogPostsRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id || post.slug}`,
    lastModified: new Date(post.updatedAt || post.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Add projects to sitemap
  const projectsRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id || project.slug}`,
    lastModified: new Date(project.updatedAt || project.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const categories = Array.from(new Set(blogPosts.map((post) => post.category).filter(Boolean)))
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...routes, ...blogPostsRoutes, ...projectsRoutes, ...categoryRoutes]
}
