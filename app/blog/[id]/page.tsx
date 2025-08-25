import type { Metadata } from "next"
import { getAllItems, getItemById } from "@/lib/file-storage"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Twitter, ChevronRight } from 'lucide-react'
import { parseMarkdown } from "@/lib/markdown"
import { notFound } from "next/navigation"
import { TableOfContents } from "@/components/table-of-contents"
import { addIdsToHeadings, extractTableOfContents } from "@/lib/table-of-contents"
import ClientMarkdownRenderer from "@/components/ClientMarkdownRenderer"
import CommentSystem from "@/components/CommentSystem"
import BlogLoadingState from "@/components/BlogLoadingState"
import { Suspense } from "react"

interface BlogPostPageProps {
  params: { id: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getItemById("blog", params.id)

    if (!post) {
      return {
        title: "Blog Post Not Found | Ngoma Benjamin",
        description: "The requested blog post could not be found.",
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ngomabenjamin.com"
    const postUrl = `${baseUrl}/blog/${post.id || post.slug}`
    const imageUrl = post.imagePath || post.image || `${baseUrl}/og-blog-default.jpg`

    return {
      title: `${post.title} | Ngoma Benjamin - Web Development Blog`,
      description:
        post.excerpt ||
        post.description ||
        `Read ${post.title} by Ngoma Benjamin. Expert insights on web development, programming, and technology.`,
      keywords: [
        post.title.toLowerCase(),
        ...(post.tags || []),
        post.category?.toLowerCase(),
        "ngoma benjamin",
        "web development",
        "programming",
        "technology blog",
        "software engineering",
        "full stack development",
      ].filter(Boolean),
      authors: [{ name: post.author || "Ngoma Benjamin" }],
      creator: post.author || "Ngoma Benjamin",
      publisher: "Ngoma Benjamin",
      openGraph: {
        title: post.title,
        description: post.excerpt || post.description,
        type: "article",
        url: postUrl,
        siteName: "Ngoma Benjamin",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: post.date || post.createdAt,
        modifiedTime: post.updatedAt || post.date || post.createdAt,
        authors: [post.author || "Ngoma Benjamin"],
        section: post.category,
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.description,
        images: [imageUrl],
        creator: "@ngoma301",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: postUrl,
      },
      other: {
        "article:author": post.author || "Ngoma Benjamin",
        "article:published_time": post.date || post.createdAt,
        "article:modified_time": post.updatedAt || post.date || post.createdAt,
        "article:section": post.category,
        "article:tag": post.tags?.join(", "),
      },
    }
  } catch (error) {
    return {
      title: "Blog Post | Ngoma Benjamin",
      description: "Read the latest insights on web development and programming.",
    }
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const posts = await getAllItems("blog")
    return posts.map((post) => ({
      id: post.slug || post.id,
    }))
  } catch (error) {
    return []
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogLoadingState />}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  let post

  try {
    post = await getItemById("blog", params.id)
  } catch (error) {
    console.error("Error fetching blog post:", error)
  }

  if (!post) {
    notFound()
  }

  // Get related posts
  const allPosts = await getAllItems("blog")
  const relatedPosts = allPosts
    .filter(
      (p) => p.id !== post.id && (p.category === post.category || p.tags?.some((tag) => post.tags?.includes(tag))),
    )
    .slice(0, 3)

  // Generate structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ngomabenjamin.com"
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.description,
    image: {
      "@type": "ImageObject",
      url: post.imagePath || post.image || `${baseUrl}/og-blog-default.jpg`,
      width: 1200,
      height: 630,
    },
    datePublished: post.date || post.createdAt,
    dateModified: post.updatedAt || post.date || post.createdAt,
    author: {
      "@type": "Person",
      name: post.author || "Ngoma Benjamin",
      url: `${baseUrl}/about`,
      image: `${baseUrl}/author-avatar.jpg`,
    },
    publisher: {
      "@type": "Organization",
      name: "Ngoma Benjamin",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.id || post.slug}`,
    },
    keywords: post.tags?.join(", ") || "",
    articleSection: post.category,
    wordCount: post.content?.split(/\s+/).length || 0,
    timeRequired: `PT${post.readTime || "5M"}`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    creativeWorkStatus: "Published",
  }

  // Parse the markdown content
  const parsedContent = parseMarkdown(post.content || "")
  const contentWithIds = addIdsToHeadings(post.content || "")

  // Extract table of contents
  const tocItems = extractTableOfContents(contentWithIds)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/80 to-black/40 z-10" />
          <Image
            src={
              post.imagePath ||
              post.image ||
              "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1920&h=500&fit=crop" ||
              "/placeholder.svg"
             || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized={post.imagePath?.startsWith("/uploads/")}
          />
          <div className="container relative z-20 flex h-full flex-col justify-end pb-12">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
                {post.tags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

              <p className="text-sm lg:text-lg md:text-xl text-white/90 mb-6 max-w-3xl">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
                    <Image
                      src={
                        post.authorImage ||
                        "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" ||
                        "/placeholder.svg"
                       || "/placeholder.svg"}
                      alt={post.author || "Ngoma Benjamin"}
                      fill
                      className="object-cover"
                      unoptimized={post.authorImage?.startsWith("/uploads/")}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{post.author || "Ngoma Benjamin"}</p>
                    <p className="text-sm text-white/70">Founder of 301Inc</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{post.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{post.readTime || "5 min read"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <ClientMarkdownRenderer htmlContent={parsedContent} rawMarkdown={post.content || ""} />

              <Separator className="my-12" />

              {/* Author Bio & Social Sharing */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={
                        post.authorImage ||
                        "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" ||
                        "/placeholder.svg"
                       || "/placeholder.svg"}
                      alt={post.author || "Ngoma Benjamin"}
                      fill
                      className="object-cover"
                      unoptimized={post.authorImage?.startsWith("/uploads/")}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{post.author || "Ngoma Benjamin"}</h3>
                    <p className="text-muted-foreground">
                      {post.authorBio ||
                        "Founder of 301Inc and full-stack developer with expertise in modern web technologies. Passionate about sharing knowledge and helping developers grow."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Share:</span>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        post.title,
                      )}&url=${encodeURIComponent(`${baseUrl}/blog/${post.id || post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `${baseUrl}/blog/${post.id || post.slug}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        `${baseUrl}/blog/${post.id || post.slug}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Comment System */}
              <Separator className="my-12" />
              <CommentSystem postId={post.id || post.slug || params.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Table of Contents */}
              <Card className="h-96 overflow-y-auto">
                <CardHeader>
                  <CardTitle>Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableOfContents items={tocItems} />
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full mb-4">
                      <Image
                        src={
                          post.authorImage ||
                          "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" ||
                          "/placeholder.svg"
                         || "/placeholder.svg"}
                        alt={post.author || "Ngoma Benjamin"}
                        fill
                        className="object-cover"
                        unoptimized={post.authorImage?.startsWith("/uploads/")}
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{post.author || "Ngoma Benjamin"}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Founder of 301Inc</p>
                    <p className="text-sm mb-4">
                      Full-stack developer with expertise in modern web technologies. Passionate about sharing knowledge
                      and helping developers grow.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/about">View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Link key={index} href={`/blog?q=${encodeURIComponent(tag)}`}>
                          <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allPosts.slice(0, 4).map((recentPost, index) => (
                      <div key={recentPost.id}>
                        <div className="flex gap-3">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={
                                recentPost.imagePath ||
                                recentPost.image ||
                                "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop" ||
                                "/placeholder.svg"
                               || "/placeholder.svg"}
                              alt={recentPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized={recentPost.imagePath?.startsWith("/uploads/")}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              <Link href={`/blog/${recentPost.id || recentPost.slug}`} className="hover:text-primary">
                                {recentPost.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-muted-foreground">{recentPost.date}</p>
                          </div>
                        </div>
                        {index < 3 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold tracking-tight mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative h-[200px]">
                      <Image
                        src={
                          relatedPost.imagePath ||
                          relatedPost.image ||
                          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" ||
                          "/placeholder.svg"
                         || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={relatedPost.imagePath?.startsWith("/uploads/")}
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        {relatedPost.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{relatedPost.title}</h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{relatedPost.author || "Ngoma Benjamin"}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{relatedPost.date}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="ghost" size="sm" className="ml-auto group-hover:text-primary" asChild>
                        <Link href={`/blog/${relatedPost.id || relatedPost.slug}`}>
                          Read More <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
