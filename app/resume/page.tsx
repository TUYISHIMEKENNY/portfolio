"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Briefcase, GraduationCap, Award, ArrowRight } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function ResumePage() {
  const [activeResume, setActiveResume] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // Fetch the active resume
    const fetchActiveResume = async () => {
      try {
        const response = await fetch("/api/resume?active=true")
        if (response.ok) {
          const data = await response.json()
          if (!data.error) {
            setActiveResume(data)
          }
        }
      } catch (error) {
        console.error("Error fetching active resume:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActiveResume()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">My Resume</h1>
          <p className="mt-4 text-xl text-muted-foreground">Professional experience, education, and achievements</p>
          {activeResume && activeResume.filePath ? (
            <Button className="mt-6" size="lg" asChild>
              <a href={activeResume.filePath} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </a>
            </Button>
          ) : (
            <Button className="mt-6" size="lg">
              <Download className="mr-2 h-4 w-4" /> Download Resume
            </Button>
          )}
        </div>

        <Tabs defaultValue="experience" className="mb-20">
          <TabsList className="mb-8 flex w-full flex-wrap justify-center gap-2">
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Skills & Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience">
            <div className="space-y-8">
              {[
                {
                  title: "Senior Full-Stack Developer",
                  company: "Tech Innovations Inc.",
                  period: "2021 - Present",
                  location: "San Francisco, CA",
                  description:
                    "Leading development of enterprise web applications using React, Node.js, and PostgreSQL. Mentoring junior developers and implementing CI/CD pipelines.",
                  responsibilities: [
                    "Architected and developed scalable web applications serving 100,000+ users",
                    "Led a team of 5 developers, implementing Agile methodologies",
                    "Reduced application load time by 40% through performance optimization",
                    "Implemented automated testing, achieving 90% code coverage",
                    "Collaborated with product managers to define and prioritize features",
                  ],
                  technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "CI/CD"],
                },
                {
                  title: "Frontend Developer",
                  company: "Digital Solutions Ltd.",
                  period: "2018 - 2021",
                  location: "Boston, MA",
                  description:
                    "Developed responsive web applications using React and Redux. Collaborated with designers to implement pixel-perfect UI components.",
                  responsibilities: [
                    "Built and maintained multiple client-facing web applications",
                    "Implemented responsive designs ensuring cross-browser compatibility",
                    "Developed reusable component library, improving development efficiency",
                    "Integrated RESTful APIs and implemented state management",
                    "Participated in code reviews and documentation",
                  ],
                  technologies: ["React", "Redux", "JavaScript", "SASS", "REST APIs", "Git"],
                },
                {
                  title: "Web Developer Intern",
                  company: "StartUp Ventures",
                  period: "2017 - 2018",
                  location: "Remote",
                  description:
                    "Assisted in developing and maintaining company websites and web applications. Gained hands-on experience with modern web technologies.",
                  responsibilities: [
                    "Developed and maintained company website using HTML, CSS, and JavaScript",
                    "Assisted senior developers with bug fixes and feature implementation",
                    "Created responsive email templates for marketing campaigns",
                    "Participated in daily stand-ups and sprint planning",
                  ],
                  technologies: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP"],
                },
              ].map((job, index) => (
                <Card key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {job.period}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>
                      </div>
                      <p>{job.description}</p>
                      <div>
                        <h4 className="mb-2 font-semibold">Key Responsibilities:</h4>
                        <ul className="ml-6 list-disc space-y-1">
                          {job.responsibilities.map((responsibility, i) => (
                            <li key={i}>{responsibility}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="space-y-8">
              {[
                {
                  degree: "BSc in Computer Science",
                  institution: "University of Technology",
                  period: "2014 - 2018",
                  location: "Cambridge, MA",
                  description:
                    "Graduated with honors. Specialized in web development and software engineering. Completed thesis on scalable web architectures.",
                  courses: [
                    "Data Structures and Algorithms",
                    "Web Development",
                    "Database Systems",
                    "Software Engineering",
                    "Computer Networks",
                    "Operating Systems",
                  ],
                  achievements: [
                    "Dean's List for Academic Excellence (2016-2018)",
                    "Best Final Year Project Award",
                    "President of Computer Science Society",
                  ],
                },
                {
                  degree: "Associate Degree in Programming",
                  institution: "Community College",
                  period: "2012 - 2014",
                  location: "Portland, OR",
                  description:
                    "Foundations in programming languages, algorithms, and data structures. Participated in coding competitions.",
                  courses: [
                    "Introduction to Programming",
                    "Web Design Fundamentals",
                    "Object-Oriented Programming",
                    "Database Fundamentals",
                    "System Analysis and Design",
                  ],
                  achievements: ["First Place in College Coding Competition", "Peer Tutor for Programming Courses"],
                },
              ].map((education, index) => (
                <Card key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="text-xl font-bold">{education.degree}</h3>
                          <p className="text-muted-foreground">{education.institution}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {education.period}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{education.location}</p>
                        </div>
                      </div>
                      <p>{education.description}</p>
                      <div>
                        <h4 className="mb-2 font-semibold">Relevant Courses:</h4>
                        <ul className="ml-6 list-disc space-y-1">
                          {education.courses.map((course, i) => (
                            <li key={i}>{course}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">Achievements:</h4>
                        <ul className="ml-6 list-disc space-y-1">
                          {education.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-8">
              <Card data-aos="fade-up">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Technical Skills</h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 font-semibold">Frontend</h4>
                      <ul className="ml-6 list-disc space-y-1">
                        <li>HTML5, CSS3, JavaScript (ES6+)</li>
                        <li>React.js, Next.js</li>
                        <li>Redux, Context API</li>
                        <li>Tailwind CSS, SASS</li>
                        <li>TypeScript</li>
                        <li>Responsive Design</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Backend</h4>
                      <ul className="ml-6 list-disc space-y-1">
                        <li>Node.js, Express</li>
                        <li>Python, Django</li>
                        <li>RESTful APIs</li>
                        <li>GraphQL</li>
                        <li>Authentication & Authorization</li>
                        <li>Serverless Architecture</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Database</h4>
                      <ul className="ml-6 list-disc space-y-1">
                        <li>MongoDB</li>
                        <li>PostgreSQL</li>
                        <li>MySQL</li>
                        <li>Firebase</li>
                        <li>Redis</li>
                        <li>ORM (Mongoose, Prisma)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">DevOps & Tools</h4>
                      <ul className="ml-6 list-disc space-y-1">
                        <li>Git, GitHub</li>
                        <li>Docker, Kubernetes</li>
                        <li>CI/CD Pipelines</li>
                        <li>AWS, Vercel, Netlify</li>
                        <li>Testing (Jest, Cypress)</li>
                        <li>Webpack, Babel</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Design</h4>
                      <ul className="ml-6 list-disc space-y-1">
                        <li>Figma</li>
                        <li>Adobe XD</li>
                        <li>UI/UX Principles</li>
                        <li>Wireframing</li>
                        <li>Prototyping</li>
                        <li>Accessibility Standards</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">Other</h4>
                      <ul className="ml-6 list-disc space-y-1">
                        <li>SEO Optimization</li>
                        <li>Performance Optimization</li>
                        <li>Web Security</li>
                        <li>Responsive Design</li>
                        <li>Progressive Web Apps</li>
                        <li>Cross-Browser Compatibility</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="100">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Certifications</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      {
                        name: "AWS Certified Developer - Associate",
                        issuer: "Amazon Web Services",
                        date: "2022",
                        description:
                          "Validates technical expertise in developing and maintaining applications on the AWS platform.",
                      },
                      {
                        name: "Professional Web Developer",
                        issuer: "Frontend Masters",
                        date: "2021",
                        description:
                          "Comprehensive certification covering modern frontend development technologies and best practices.",
                      },
                      {
                        name: "React Developer Certification",
                        issuer: "Meta (formerly Facebook)",
                        date: "2020",
                        description:
                          "Advanced certification for building complex applications with React and related technologies.",
                      },
                      {
                        name: "Full-Stack JavaScript Techdegree",
                        issuer: "Treehouse",
                        date: "2019",
                        description: "Comprehensive program covering both frontend and backend JavaScript development.",
                      },
                    ].map((cert, index) => (
                      <div key={index} className="space-y-2 rounded-lg border p-4">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">{cert.name}</h4>
                          <Badge variant="outline">{cert.date}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Issued by: {cert.issuer}</p>
                        <p className="text-sm">{cert.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="200">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Soft Skills</h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[
                      "Problem Solving",
                      "Communication",
                      "Teamwork",
                      "Time Management",
                      "Leadership",
                      "Adaptability",
                      "Critical Thinking",
                      "Attention to Detail",
                      "Project Management",
                      "Client Relations",
                      "Mentoring",
                      "Conflict Resolution",
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="300">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-bold">Languages</h3>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">English</h4>
                        <span className="text-sm text-muted-foreground">Native</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Spanish</h4>
                        <span className="text-sm text-muted-foreground">Intermediate</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">French</h4>
                        <span className="text-sm text-muted-foreground">Basic</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <section className="rounded-2xl bg-muted p-8 text-center md:p-12" data-aos="fade-up">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Interested in Working Together?</h2>
            <p className="text-muted-foreground">
              If my experience and skills match your project needs, I'd love to hear from you!
            </p>
            <Link href="/contact">
              <Button size="lg" className="mt-2">
                Contact Me <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
