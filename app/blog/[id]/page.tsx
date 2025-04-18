"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Twitter, ArrowRight } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function BlogPostPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const postId = unwrappedParams.id

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Set page title dynamically
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | Ngoma Benjamin`
    }
  }, [post?.title])

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // Scroll to top on page load
    window.scrollTo(0, 0)

    // Fetch the blog post by id
    const fetchPost = async () => {
      try {
        // First try to get all posts
        const response = await fetch("/api/blog")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }

        const posts = await response.json()

        // Try to find the post by ID first, then by slug if it's a string
        const foundPost = posts.find((p) => p.id === postId || (typeof postId === "string" && p.slug === postId))

        if (foundPost) {
          setPost(foundPost)

          // Add structured data for SEO
          addStructuredData(foundPost)
        } else {
          // If not found, use a placeholder post
          setPost({
            id: 2,
            slug: "understanding-react-hooks-a-comprehensive-guide",
            title: "Understanding React Hooks: A Comprehensive Guide",
            excerpt:
              "A deep dive into React Hooks, exploring how they work and how to use them effectively in your applications.",
            image: "/placeholder.svg?height=600&width=1200&text=React+Hooks",
            date: "April 22, 2023",
            readTime: "12 min read",
            author: "Ngoma Benjamin",
            authorImage: "/placeholder.svg?height=100&width=100&text=NB",
            authorBio:
              "Founder of 301Inc and full-stack developer with a passion for React and modern web technologies.",
            category: "react",
            tags: ["React", "JavaScript", "Hooks", "Frontend"],
            featured: true,
            content: `
              <h2>Introduction to React Hooks</h2>
              <p>React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They enable you to use state and other React features in functional components, making your code more concise and easier to understand.</p>
              
              <p>Before Hooks, if you wanted to add state to a component, you had to use a class component. With Hooks, you can add state to functional components, which are simpler and more lightweight.</p>
              
              <h2>Why Hooks?</h2>
              <p>The React team introduced Hooks to solve several problems they had observed in React codebases over the years:</p>
              
              <ul>
                <li><strong>Reusing stateful logic between components was difficult</strong>. Patterns like render props and higher-order components tried to solve this, but they made the code harder to follow.</li>
                <li><strong>Complex components became hard to understand</strong>. Lifecycle methods often contained unrelated logic, while related logic was split across different methods.</li>
                <li><strong>Classes confused both people and machines</strong>. They can be a barrier to learning React and can lead to bugs and inconsistencies.</li>
              </ul>
              
              <h2>The Basic Hooks</h2>
              
              <h3>useState</h3>
              <p>The useState Hook lets you add state to functional components. It returns a pair: the current state value and a function that lets you update it.</p>
              
              <pre><code>
              import React, { useState } from 'react';
              
              function Counter() {
                const [count, setCount] = useState(0);
                
                return (
                  <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                      Click me
                    </button>
                  </div>
                );
              }
              </code></pre>
              
              <h3>useEffect</h3>
              <p>The useEffect Hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.</p>
              
              <pre><code>
              import React, { useState, useEffect } from 'react';
              
              function Example() {
                const [count, setCount] = useState(0);
                
                // Similar to componentDidMount and componentDidUpdate:
                useEffect(() => {
                  // Update the document title using the browser API
                  document.title = \`You clicked \${count} times\`;
                });
                
                return (
                  <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                      Click me
                    </button>
                  </div>
                );
              }
              </code></pre>
            `,
            relatedPosts: [
              {
                id: 1,
                slug: "10-essential-tips-for-modern-web-development",
                title: "10 Essential Tips for Modern Web Development",
                excerpt:
                  "Discover the most important practices and tools that every web developer should know in today's fast-paced development environment.",
                image: "/placeholder.svg?height=200&width=300&text=Web+Dev+Tips",
                category: "Development",
              },
              {
                id: 5,
                slug: "introduction-to-typescript-for-javascript-developers",
                title: "Introduction to TypeScript for JavaScript Developers",
                excerpt:
                  "A beginner-friendly guide to TypeScript, explaining how it enhances JavaScript and improves developer experience.",
                image: "/placeholder.svg?height=200&width=300&text=TypeScript",
                category: "JavaScript",
              },
              {
                id: 7,
                slug: "getting-started-with-nextjs-the-react-framework",
                title: "Getting Started with Next.js: The React Framework",
                excerpt:
                  "An introduction to Next.js, explaining its benefits and how to build your first application with this powerful React framework.",
                image: "/placeholder.svg?height=200&width=300&text=Next.js",
                category: "React",
              },
            ],
          })
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId, router])

  // Add structured data for SEO
  const addStructuredData = (post) => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.imagePath || post.image,
      datePublished: post.date,
      dateModified: post.updatedAt || post.date,
      author: {
        "@type": "Person",
        name: post.author || "Ngoma Benjamin",
        url: `${process.env.WEB_BASE_URL}/about`,
      },
      publisher: {
        "@type": "Person",
        name: "Ngoma Benjamin",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.WEB_BASE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.WEB_BASE_URL}/blog/${post.id || post.slug}`,
      },
      keywords: post.tags ? post.tags.join(", ") : "",
    }

    // Add the structured data to the page
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center">
            <Skeleton className="h-8 w-24" />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <Skeleton className="aspect-video h-[400px] w-full rounded-xl" />

            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-lg border border-destructive p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Error Loading Blog Post</h1>
          <p className="mt-4">{error}</p>
          <Link href="/blog" className="mt-6 inline-block">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold">Blog Post Not Found</h1>
          <p className="mt-4">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog" className="mt-6 inline-block">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/blog" className="mb-8 inline-flex items-center text-sm font-medium" data-aos="fade-up">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article className="space-y-8">
          <div className="space-y-4" data-aos="fade-up">
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{post.category}</Badge>
              {post.tags &&
                post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={post.authorImage || "/placeholder.svg?height=40&width=40&text=NB"}
                    alt={post.author || "Ngoma Benjamin"}
                    width={40}
                    height={40}
                    unoptimized={post.authorImage?.startsWith("/uploads/")}
                  />
                </div>
                <span>{post.author || "Ngoma Benjamin"}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{post.date}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="aspect-video relative overflow-hidden rounded-xl" data-aos="fade-up">
            <Image
              src={post.imagePath || post.image || "/placeholder.svg?height=600&width=1200&text=Blog+Post"}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={post.imagePath?.startsWith("/uploads/")}
              priority
            />
          </div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            data-aos="fade-up"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          <Separator className="my-8" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between" data-aos="fade-up">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={post.authorImage || "/placeholder.svg?height=48&width=48&text=NB"}
                  alt={post.author || "Ngoma Benjamin"}
                  width={48}
                  height={48}
                  unoptimized={post.authorImage?.startsWith("/uploads/")}
                />
              </div>
              <div>
                <p className="font-semibold">{post.author || "Ngoma Benjamin"}</p>
                <p className="text-sm text-muted-foreground">
                  {post.authorBio || "Founder of 301Inc and full-stack developer with a passion for web technologies."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              
              <Button variant="outline" size="icon" aria-label="Share on Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Share on Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Share on LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>

        {post.relatedPosts && (
          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold" data-aos="fade-up">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {post.relatedPosts.map((relatedPost, index) => (
                <Card key={relatedPost.id} className="overflow-hidden" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="aspect-video relative">
                    <Image
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Badge className="capitalize">{relatedPost.category}</Badge>
                      <h3 className="font-bold">{relatedPost.title}</h3>
                      <p className="text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                      <Link href={`/blog/${relatedPost.id || relatedPost.slug}`}>
                        <Button variant="link" className="p-0">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// Helper function to properly format content that might be markdown or HTML
function formatContent(content) {
  if (!content) return ""

  // Check if content is already HTML (contains HTML tags)
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content)

  if (hasHtmlTags) {
    return content
  } else {
    // Enhanced markdown to HTML conversion for better formatting
    return (
      content
        // Headers
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        // Code blocks with syntax highlighting
        .replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
          return `<pre class="language-${lang || "text"}"><code>${code}</code></pre>`
        })
        // Inline code
        .replace(/`(.*?)`/gim, "<code>$1</code>")
        // Links - Fix the link pattern to use standard Markdown format
        .replace(/\[(.*?)\]$$(.*?)$$/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Lists
        .replace(/^\s*-\s*(.*$)/gim, "<ul><li>$1</li></ul>")
        .replace(/^\s*\d+\.\s*(.*$)/gim, "<ol><li>$1</li></ol>")
        // Paragraphs
        .replace(/^\s*(\n)?(.+)/gim, (m) =>
          /<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : "<p>" + m + "</p>",
        )
        // Line breaks
        .replace(/\n/gim, "<br>")
        // Fix nested lists
        .replace(/<\/ul>\s*<ul>/gim, "")
        .replace(/<\/ol>\s*<ol>/gim, "")
        // Images - Fix the image pattern to use standard Markdown format
        .replace(/!\[(.*?)\]$$(.*?)$$/gim, '<img src="$2" alt="$1" class="rounded-md my-4 max-w-full">')
    )
  }
}
