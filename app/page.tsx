"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Database, Globe, Server, ExternalLink, Github } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          // Filter for featured projects
          setProjects(data.filter((p: any) => p.featured))
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-muted/50 to-background py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center space-y-4" data-aos="fade-right">
              <div className="space-y-2">
                <Badge className="px-3 py-1 text-sm" variant="secondary">
                  Full-Stack Web & Mobile App Developer
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Hi, I'm <span className="text-primary font-quicksand">TUYISHIME KENNY ARAFAT</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Founder of iNkodeInc. I build exceptional digital experiences that make people's lives easier.
                  Specializing in modern web technologies and user-centric design.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[300px]:flex-row">
                <Link href="/projects">
                  <Button size="lg" className="gap-1">
                    View My Work <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center" data-aos="fade-left">
              <div className="relative h-[350px] w-[350px] overflow-hidden rounded-full border-4 border-primary/20 bg-muted p-2">
                <Image
                  src="/inkodeInc.png"
                  alt="iNkode Portrait"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Tech Stack</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The technologies I use to build amazing web applications
            </p>
          </div>
          <div
            className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 lg:gap-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-bold">Frontend</h3>
                <p className="text-sm text-muted-foreground">React, Next.js, Tailwind CSS</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Server className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-bold">Backend</h3>
                <p className="text-sm text-muted-foreground">Node.js, Express, Python</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Database className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-bold">Database</h3>
                <p className="text-sm text-muted-foreground">MongoDB, PostgreSQL, Firebase</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Code className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-bold">DevOps</h3>
                <p className="text-sm text-muted-foreground">Git, Docker, AWS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Projects</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out some of my recent work
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full rounded-lg border p-8 text-center">
                <h3 className="text-lg font-semibold">No featured projects found</h3>
              </div>
            ) : (
              projects.slice(0, 3).map((project, index) => (
                <Card key={project.id} className="overflow-hidden flex flex-col h-full text-left" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="aspect-video relative">
                    <Image
                      src={project.imagePath || project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || []).map((tech: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      {project.liveUrl && (
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
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <Link href="/projects" className="pt-6" data-aos="fade-up">
            <Button size="lg">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2" data-aos="fade-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Clients Say</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Testimonials from people I've worked with
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((testimonial) => (
                <Card key={testimonial} className="text-left" data-aos="fade-up" data-aos-delay={testimonial * 100}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="italic text-muted-foreground">
                        "Kenny is an exceptional developer who delivered our project on time and exceeded our
                        expectations. His attention to detail and problem-solving skills are impressive."
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                          <Image
                            src={`/placeholder.svg?height=40&width=40&text=C${testimonial}`}
                            alt="Client"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">Client Name</p>
                          <p className="text-sm text-muted-foreground">Company {testimonial}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div
          className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-muted p-8 text-center md:p-12"
          data-aos="fade-up"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Your Project?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Let's work together to bring your ideas to life
            </p>
          </div>
          <Link href="/contact">
            <Button size="lg">
              Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
