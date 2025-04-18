"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // Fetch projects from the API
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          console.error("Failed to fetch projects")
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : activeCategory === "featured"
        ? projects.filter((project) => project.featured)
        : projects.filter((project) => project.category === activeCategory)

  // If no projects are loaded yet, show placeholder projects
  const displayProjects =
    loading || projects.length === 0
      ? [
          {
            id: 1,
            title: "E-Commerce Platform",
            description:
              "A full-stack e-commerce platform with product management, cart functionality, and payment processing.",
            image: "/placeholder.svg?height=400&width=600&text=E-Commerce",
            category: "fullstack",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
          },
          {
            id: 2,
            title: "Task Management App",
            description:
              "A productivity app for managing tasks, projects, and team collaboration with real-time updates.",
            image: "/placeholder.svg?height=400&width=600&text=Task+App",
            category: "fullstack",
            technologies: ["React", "Firebase", "Material UI", "Redux"],
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
          },
          {
            id: 3,
            title: "Portfolio Website",
            description: "A responsive portfolio website showcasing projects and skills with a modern design.",
            image: "/placeholder.svg?height=400&width=600&text=Portfolio",
            category: "frontend",
            technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
            liveUrl: "#",
            githubUrl: "#",
            featured: true,
          },
        ]
      : filteredProjects

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">My Projects</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            A showcase of my web development work and personal projects
          </p>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-20">
          <TabsList className="mb-8 flex w-full flex-wrap justify-center gap-2">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="fullstack">Full-Stack</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory}>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : displayProjects.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <h3 className="text-lg font-semibold">No projects found</h3>
                <p className="mt-2 text-muted-foreground">
                  No projects in this category yet. Check back later or try another category.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Project Process */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">My Development Process</h2>
            <p className="mt-2 text-muted-foreground">How I approach each project</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Discovery",
                description: "Understanding requirements and project goals through research and planning.",
              },
              {
                step: "2",
                title: "Design",
                description: "Creating wireframes and prototypes to visualize the user interface and experience.",
              },
              {
                step: "3",
                title: "Development",
                description: "Building the application with clean, maintainable code and best practices.",
              },
              {
                step: "4",
                title: "Deployment",
                description: "Testing, optimizing, and launching the project with ongoing support.",
              },
            ].map((process, index) => (
              <Card key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-2xl bg-muted p-8 text-center md:p-12" data-aos="fade-up">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Have a Project in Mind?</h2>
            <p className="text-muted-foreground">
              I'm always open to discussing new projects and creative ideas. Let's build something amazing together!
            </p>
            <Link href="/contact">
              <Button size="lg" className="mt-2">
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }) {
  const isUpcoming = project.status === "upcoming"

  return (
    <Card className="overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
      <div className="aspect-video relative">
        {isUpcoming ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-center text-muted-foreground">No Preview Available</p>
          </div>
        ) : (
          <Image
            src={project.imagePath || project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
        {isUpcoming && (
          <div className="absolute right-2 top-2">
            <Badge variant="secondary">Upcoming</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).map((tech, i) => (
              <Badge key={i} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            {!isUpcoming && project.liveUrl && (
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </Button>
              </Link>
            )}
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1">
                  <Github className="h-4 w-4" /> GitHub
                </Button>
              </Link>
            )}
            {isUpcoming && (
              <Button variant="outline" size="sm" className="gap-1" disabled>
                <ExternalLink className="h-4 w-4" /> Coming Soon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
