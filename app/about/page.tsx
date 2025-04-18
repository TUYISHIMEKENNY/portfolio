"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowRight, Briefcase, GraduationCap, Heart } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About Me</h1>
          <p className="mt-4 text-xl text-muted-foreground">Get to know me and my journey</p>
        </div>

        {/* Bio Section */}
        <section className="mb-20 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex items-center justify-center" data-aos="fade-right">
            <div className="relative h-[400px] w-[350px] overflow-hidden rounded-2xl">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Developer Portrait"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-6" data-aos="fade-left">
            <div className="space-y-2">
              <Badge className="px-3 py-1 text-sm" variant="secondary">
                Full-Stack Developer & Founder of 301Inc
              </Badge>
              <h2 className="text-3xl font-bold">Ngoma Benjamin</h2>
              <p className="text-muted-foreground">
                I'm a passionate full-stack developer with over 5 years of experience building web applications that
                solve real-world problems. Also known as ngoma301, I founded 301Inc to create innovative digital
                solutions.
              </p>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                My journey in web development began during my computer science studies when I built my first website.
                Since then, I've been hooked on creating digital experiences that are both functional and beautiful.
              </p>
              <p>
                I specialize in JavaScript ecosystems, particularly React and Node.js, but I'm always exploring new
                technologies to stay at the cutting edge of web development.
              </p>
              <p>
                When I'm not coding, you'll find me hiking in nature, reading sci-fi novels, or experimenting with new
                recipes in the kitchen.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4 sm:flex-row">
              <Link href="/contact">
                <Button size="lg" className="gap-1">
                  Contact Me <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </Button>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">My Journey</h2>
            <p className="mt-2 text-muted-foreground">Education and work experience</p>
          </div>

          <div className="space-y-8">
            {/* Work Experience */}
            <div
              className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted md:pl-12"
              data-aos="fade-up"
            >
              <div className="absolute left-[-8px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary md:left-[-10px]">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2021 - Present
                  </Badge>
                  <h3 className="text-xl font-bold">Senior Full-Stack Developer</h3>
                  <p className="text-muted-foreground">Tech Innovations Inc.</p>
                  <p>
                    Leading development of enterprise web applications using React, Node.js, and PostgreSQL. Mentoring
                    junior developers and implementing CI/CD pipelines.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2018 - 2021
                  </Badge>
                  <h3 className="text-xl font-bold">Frontend Developer</h3>
                  <p className="text-muted-foreground">Digital Solutions Ltd.</p>
                  <p>
                    Developed responsive web applications using React and Redux. Collaborated with designers to
                    implement pixel-perfect UI components.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div
              className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted md:pl-12"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute left-[-8px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary md:left-[-10px]">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2014 - 2018
                  </Badge>
                  <h3 className="text-xl font-bold">BSc in Computer Science</h3>
                  <p className="text-muted-foreground">University of Technology</p>
                  <p>
                    Graduated with honors. Specialized in web development and software engineering. Completed thesis on
                    scalable web architectures.
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    2012 - 2014
                  </Badge>
                  <h3 className="text-xl font-bold">Associate Degree in Programming</h3>
                  <p className="text-muted-foreground">Community College</p>
                  <p>
                    Foundations in programming languages, algorithms, and data structures. Participated in coding
                    competitions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hobbies & Interests */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">Hobbies & Interests</h2>
            <p className="mt-2 text-muted-foreground">What I enjoy outside of coding</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="100">
            {[
              { title: "Photography", description: "Capturing moments and landscapes" },
              { title: "Hiking", description: "Exploring nature trails and mountains" },
              { title: "Reading", description: "Science fiction and technology books" },
              { title: "Cooking", description: "Experimenting with international cuisines" },
              { title: "Chess", description: "Strategic thinking and competitions" },
              { title: "Travel", description: "Experiencing different cultures" },
            ].map((hobby, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Heart className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">{hobby.title}</h3>
                  <p className="text-muted-foreground">{hobby.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl bg-muted p-8 text-center md:p-12" data-aos="fade-up">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Let's Work Together</h2>
            <p className="text-muted-foreground">
              Interested in collaborating or have a project in mind? I'd love to hear from you!
            </p>
            <Link href="/contact">
              <Button size="lg" className="mt-2">
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
