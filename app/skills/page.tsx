"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Globe, Server, Wrench, Users } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function SkillsPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  const skillCategories = [
    {
      id: "frontend",
      label: "Frontend",
      icon: <Globe className="h-5 w-5" />,
      skills: [
        { name: "HTML/CSS", level: 95 },
        { name: "JavaScript", level: 90 },
        { name: "React.js", level: 92 },
        { name: "Next.js", level: 88 },
        { name: "TypeScript", level: 85 },
        { name: "Tailwind CSS", level: 90 },
        { name: "Redux", level: 82 },
        { name: "Responsive Design", level: 95 },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      icon: <Server className="h-5 w-5" />,
      skills: [
        { name: "Node.js", level: 88 },
        { name: "Express.js", level: 85 },
        { name: "Python", level: 75 },
        { name: "Django", level: 70 },
        { name: "RESTful APIs", level: 90 },
        { name: "GraphQL", level: 78 },
        { name: "Authentication", level: 85 },
        { name: "Serverless", level: 80 },
      ],
    },
    {
      id: "database",
      label: "Database",
      icon: <Database className="h-5 w-5" />,
      skills: [
        { name: "MongoDB", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "MySQL", level: 75 },
        { name: "Firebase", level: 85 },
        { name: "Redis", level: 70 },
        { name: "ORM (Mongoose, Prisma)", level: 82 },
        { name: "Database Design", level: 85 },
        { name: "Data Modeling", level: 80 },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      icon: <Wrench className="h-5 w-5" />,
      skills: [
        { name: "Git/GitHub", level: 90 },
        { name: "Docker", level: 75 },
        { name: "CI/CD", level: 80 },
        { name: "AWS", level: 75 },
        { name: "Vercel", level: 90 },
        { name: "Jest/Testing", level: 82 },
        { name: "Webpack", level: 78 },
        { name: "VS Code", level: 95 },
      ],
    },
    {
      id: "soft",
      label: "Soft Skills",
      icon: <Users className="h-5 w-5" />,
      skills: [
        { name: "Communication", level: 90 },
        { name: "Problem Solving", level: 95 },
        { name: "Teamwork", level: 92 },
        { name: "Time Management", level: 85 },
        { name: "Adaptability", level: 88 },
        { name: "Leadership", level: 80 },
        { name: "Attention to Detail", level: 90 },
        { name: "Critical Thinking", level: 92 },
      ],
    },
    {
      id: "coding",
      label: "Coding",
      icon: <Code className="h-5 w-5" />,
      skills: [
        { name: "Clean Code", level: 90 },
        { name: "Algorithms", level: 85 },
        { name: "Data Structures", level: 82 },
        { name: "Design Patterns", level: 80 },
        { name: "Code Optimization", level: 85 },
        { name: "Debugging", level: 92 },
        { name: "Code Review", level: 88 },
        { name: "Documentation", level: 85 },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">My Skills</h1>
          <p className="mt-4 text-xl text-muted-foreground">A comprehensive overview of my technical and soft skills</p>
        </div>

        <Tabs defaultValue="frontend" className="mb-20">
          <TabsList className="mb-8 flex w-full flex-wrap justify-center gap-2">
            {skillCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {skillCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-6 md:grid-cols-2">
                {category.skills.map((skill, index) => (
                  <Card key={index} data-aos="fade-up" data-aos-delay={index * 50}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{skill.name}</h3>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Skill Overview */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">Skill Overview</h2>
            <p className="mt-2 text-muted-foreground">My expertise at a glance</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, index) => (
              <Card key={index} className="overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="bg-primary p-4 text-primary-foreground">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <h3 className="font-bold">{category.label}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    {category.skills.slice(0, 4).map((skill, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning Journey */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">My Learning Journey</h2>
            <p className="mt-2 text-muted-foreground">Always growing and improving</p>
          </div>

          <div className="space-y-6" data-aos="fade-up">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Continuous Learning</h3>
                  <p className="text-muted-foreground">
                    I believe in lifelong learning and constantly updating my skills to stay current with the latest
                    technologies and best practices in web development. Here's how I stay up-to-date:
                  </p>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Online courses and certifications</li>
                    <li>Technical books and documentation</li>
                    <li>Developer conferences and meetups</li>
                    <li>Open source contributions</li>
                    <li>Building personal projects</li>
                    <li>Following industry leaders and blogs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Currently Learning */}
        <section>
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">Currently Learning</h2>
            <p className="mt-2 text-muted-foreground">Skills I'm currently developing</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-aos="fade-up">
            {[
              { name: "Web3 Development", progress: 60 },
              { name: "Machine Learning", progress: 45 },
              { name: "Mobile Development", progress: 70 },
              { name: "UI/UX Design", progress: 65 },
              { name: "Cloud Architecture", progress: 55 },
              { name: "Cybersecurity", progress: 50 },
            ].map((skill, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <Progress value={skill.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">In progress - {skill.progress}%</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
