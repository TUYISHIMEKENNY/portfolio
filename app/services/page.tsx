"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight, Code, Database, Globe, Layout, Server, Smartphone, Zap } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function ServicesPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  const services = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Web Development",
      description:
        "Custom websites and web applications built with modern technologies and best practices. From simple landing pages to complex web applications.",
      features: [
        "Responsive design",
        "Cross-browser compatibility",
        "SEO optimization",
        "Performance optimization",
        "Accessibility compliance",
      ],
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Frontend Development",
      description:
        "Creating beautiful, interactive user interfaces with React and related technologies. Focus on user experience and performance.",
      features: [
        "React/Next.js applications",
        "State management",
        "UI/UX implementation",
        "Animation and interactions",
        "Frontend architecture",
      ],
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: "Backend Development",
      description:
        "Robust server-side solutions with Node.js and Express. APIs, authentication, and database integration for your applications.",
      features: [
        "RESTful API development",
        "Authentication & authorization",
        "Server-side rendering",
        "Microservices architecture",
        "Performance optimization",
      ],
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Database Design",
      description:
        "Efficient database design and implementation for your applications. SQL and NoSQL solutions based on your specific needs.",
      features: [
        "Schema design",
        "Data modeling",
        "Query optimization",
        "Migration strategies",
        "Database administration",
      ],
    },
    {
      icon: <Layout className="h-10 w-10 text-primary" />,
      title: "UI/UX Consulting",
      description:
        "Improving user experience and interface design of your applications. Making your products more intuitive and user-friendly.",
      features: [
        "User flow analysis",
        "Interface audits",
        "Accessibility improvements",
        "Design system implementation",
        "Usability testing",
      ],
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Performance Optimization",
      description:
        "Improving the speed and efficiency of your existing web applications. Making your sites faster and more responsive.",
      features: [
        "Load time reduction",
        "Code optimization",
        "Caching strategies",
        "Asset optimization",
        "Core Web Vitals improvement",
      ],
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Code Review & Refactoring",
      description:
        "Improving existing codebases through careful review and refactoring. Making your code more maintainable and efficient.",
      features: [
        "Code quality assessment",
        "Technical debt reduction",
        "Architecture improvements",
        "Best practices implementation",
        "Documentation",
      ],
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "E-commerce Solutions",
      description:
        "Building online stores and e-commerce platforms with secure payment processing, product management, and order tracking.",
      features: [
        "Shopping cart implementation",
        "Payment gateway integration",
        "Product catalog management",
        "Order processing systems",
        "Customer account management",
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">My Services</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Professional web development services tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col" data-aos="fade-up" data-aos-delay={index * 50}>
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4">{service.icon}</div>
                <h2 className="mb-2 text-xl font-bold">{service.title}</h2>
                <p className="mb-6 flex-1 text-muted-foreground">{service.description}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold">Features:</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm">
                    {service.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href="/contact" className="w-full">
                  <Button className="w-full">Request Service</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">My Work Process</h2>
            <p className="mt-2 text-muted-foreground">How I approach each project</p>
          </div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-muted md:before:mx-auto md:before:ml-0">
            {[
              {
                title: "Discovery & Planning",
                description:
                  "I begin by understanding your business goals, target audience, and project requirements. This phase includes research, planning, and defining the project scope.",
              },
              {
                title: "Design & Prototyping",
                description:
                  "Based on the requirements, I create wireframes and prototypes to visualize the user interface and experience. This iterative process ensures we're aligned before development begins.",
              },
              {
                title: "Development",
                description:
                  "I write clean, maintainable code following best practices and industry standards. Regular updates and milestone reviews keep you informed throughout the development process.",
              },
              {
                title: "Testing & Quality Assurance",
                description:
                  "Rigorous testing ensures your application works flawlessly across devices and browsers. I test for functionality, performance, security, and accessibility.",
              },
              {
                title: "Deployment",
                description:
                  "Once approved, I deploy your application to your chosen hosting environment, ensuring a smooth transition from development to production.",
              },
              {
                title: "Support & Maintenance",
                description:
                  "I provide ongoing support and maintenance to keep your application running smoothly, implementing updates and improvements as needed.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-start md:flex-row md:items-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2 md:-translate-x-1/2">
                  {index + 1}
                </div>
                <div className="ml-20 md:ml-0 md:w-1/2 md:pr-8 md:text-right">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <div className="ml-20 md:ml-0 md:w-1/2 md:pl-8">
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">Pricing</h2>
            <p className="mt-2 text-muted-foreground">Flexible options to suit your needs</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Basic",
                price: "$1,000 - $3,000",
                description: "Perfect for small businesses and startups",
                features: [
                  "Responsive website design",
                  "Up to 5 pages",
                  "Basic SEO setup",
                  "Contact form",
                  "Mobile optimization",
                  "1 month of support",
                ],
                popular: false,
              },
              {
                title: "Standard",
                price: "$3,000 - $8,000",
                description: "Ideal for growing businesses",
                features: [
                  "Everything in Basic",
                  "Custom design",
                  "Up to 10 pages",
                  "Content management system",
                  "E-commerce functionality",
                  "Performance optimization",
                  "3 months of support",
                ],
                popular: true,
              },
              {
                title: "Premium",
                price: "$8,000+",
                description: "For complex web applications",
                features: [
                  "Everything in Standard",
                  "Custom web application",
                  "Advanced functionality",
                  "Database integration",
                  "User authentication",
                  "API development",
                  "6 months of support",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`flex flex-col ${plan.popular ? "border-primary" : ""}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {plan.popular && (
                  <div className="bg-primary px-3 py-1 text-center text-sm font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardContent className={`flex flex-1 flex-col p-6 ${plan.popular ? "pt-4" : ""}`}>
                  <h3 className="mb-1 text-2xl font-bold">{plan.title}</h3>
                  <div className="mb-4 text-3xl font-bold">{plan.price}</div>
                  <p className="mb-6 text-muted-foreground">{plan.description}</p>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-primary"
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href="/contact" className="w-full">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="mb-10 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">Answers to common questions about my services</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2" data-aos="fade-up">
            {[
              {
                question: "How long does it take to complete a project?",
                answer:
                  "Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, while a complex web application could take 2-3 months or more. I'll provide a detailed timeline during the planning phase.",
              },
              {
                question: "Do you offer maintenance services after the project is completed?",
                answer:
                  "Yes, I offer ongoing maintenance and support services to ensure your website or application continues to run smoothly. Maintenance packages can be customized based on your specific needs.",
              },
              {
                question: "What is your payment structure?",
                answer:
                  "I typically require a 50% deposit to begin work, with the remaining 50% due upon project completion. For larger projects, I can arrange milestone-based payments. All payment terms are clearly outlined in the project contract.",
              },
              {
                question: "Do you work with clients remotely?",
                answer:
                  "Yes, I work with clients worldwide. Communication is maintained through regular video calls, emails, and project management tools to ensure clear and consistent updates throughout the development process.",
              },
              {
                question: "Can you help with an existing website or application?",
                answer:
                  "I offer services for improving, updating, or refactoring existing websites and applications. I'll begin with a thorough assessment to identify areas for improvement and develop a plan to enhance your digital presence.",
              },
              {
                question: "What technologies do you specialize in?",
                answer:
                  "I specialize in modern web technologies including React, Next.js, Node.js, and various databases like MongoDB and PostgreSQL. I stay up-to-date with the latest developments to ensure your project uses the most appropriate and effective technologies.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-2xl bg-muted p-8 text-center md:p-12" data-aos="fade-up">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground">
              Contact me today to discuss your project requirements and how I can help bring your vision to life.
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
