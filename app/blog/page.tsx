import type { Metadata } from "next"
import { getAllItems } from "@/lib/file-storage"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Clock, Search } from "lucide-react"
import NewsletterForm from "@/components/newsletter-form"
import SearchBlog from "@/components/search-blog"

export const metadata: Metadata = {
  title: "Blog | Ngoma Benjamin",
  description:
    "Articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
  keywords: [
    "ngoma benjamin blog",
    "ngoma301 articles",
    "301Inc blog",
    "web development tutorials",
    "programming insights",
  ],
  openGraph: {
    title: "Blog | Ngoma Benjamin",
    description:
      "Articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
    type: "website",
  },
}

export default async function BlogPage({ searchParams }) {
  // Get search query from URL
  const searchQuery = searchParams?.q || ""

  // Fetch blog posts
  const posts = await getAllItems("blog")

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt || 0)
    const dateB = new Date(b.date || b.createdAt || 0)
    return dateB.getTime() - dateA.getTime()
  })

  // Filter posts by search query if present
  const filteredPosts = searchQuery
    ? sortedPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          post.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sortedPosts

  // Get featured posts
  const featuredPosts = sortedPosts.filter((post) => post.featured)

  // Get categories
  const categories = Array.from(new Set(sortedPosts.map((post) => post.category))).filter(Boolean)

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "Ngoma Benjamin's Blog",
    description:
      "Articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
    author: {
      "@type": "Person",
      name: "Ngoma Benjamin",
      url: "https://ngomabenjamin.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Ngoma Benjamin",
      logo: {
        "@type": "ImageObject",
        url: "https://ngomabenjamin.com/logo.png",
      },
    },
    blogPost: sortedPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date || post.createdAt,
      dateModified: post.updatedAt || post.date || post.createdAt,
      author: {
        "@type": "Person",
        name: post.author || "Ngoma Benjamin",
      },
      url: `https://ngomabenjamin.com/blog/${post.id || post.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Thoughts, tutorials, and insights on web development, programming, and technology.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBlog initialQuery={searchQuery} />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">
                Search Results for "{searchQuery}" ({filteredPosts.length})
              </h2>
              {filteredPosts.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">No results found</p>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or browse all posts below
                  </p>
                </div>
              )}
            </div>
          )}

          {!searchQuery && featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="mb-8 text-2xl font-bold">Featured Posts</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {featuredPosts.slice(0, 2).map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={post.imagePath || post.image || "/placeholder.svg?height=400&width=600&text=Featured+Post"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized={post.imagePath?.startsWith("/uploads/")}
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge>{post.category}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold">{post.title}</h3>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                        <Link href={`/blog/${post.id || post.slug}`}>
                          <Button>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Tabs defaultValue="all" className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{searchQuery ? "All Matching Posts" : "All Posts"}</h2>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={post.imagePath || post.image || "/placeholder.svg?height=200&width=300&text=Blog+Post"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized={post.imagePath?.startsWith("/uploads/")}
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge>{post.category}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <h3 className="font-bold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <Link href={`/blog/${post.id || post.slug}`}>
                          <Button variant="link" className="p-0">
                            Read More <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts
                    .filter((post) => post.category === category)
                    .map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <Image
                            src={post.imagePath || post.image || "/placeholder.svg?height=200&width=300&text=Blog+Post"}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized={post.imagePath?.startsWith("/uploads/")}
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge>{post.category}</Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                            </div>
                            <h3 className="font-bold">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                            <Link href={`/blog/${post.id || post.slug}`}>
                              <Button variant="link" className="p-0">
                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="rounded-lg bg-muted p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Subscribe to the Newsletter</h2>
                <p className="text-muted-foreground">
                  Get notified about new blog posts, tutorials, and updates. No spam, unsubscribe anytime.
                </p>
              </div>
              <div>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
