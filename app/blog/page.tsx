import type { Metadata } from "next"
import { getAllItems } from "@/lib/file-storage"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsletterForm from "@/components/newsletter-form"
import SearchBlog from "@/components/search-blog"

export const metadata: Metadata = {
  title: "Blog | Ngoma Benjamin - Web Development & Programming Insights",
  description:
    "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc. Stay updated with the latest trends and best practices.",
  keywords: [
    "ngoma benjamin blog",
    "ngoma301 articles",
    "301Inc blog",
    "web development tutorials",
    "programming insights",
    "javascript tutorials",
    "react development",
    "next.js guides",
    "full stack development",
    "software engineering",
    "tech insights",
    "coding best practices"
  ],
  openGraph: {
    title: "Blog | Ngoma Benjamin - Web Development & Programming Insights",
    description:
      "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
    type: "website",
    url: "https://ngomabenjamin.com/blog",
    siteName: "Ngoma Benjamin",
    images: [
      {
        url: "https://ngomabenjamin.com/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Ngoma Benjamin Blog - Web Development Insights"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Ngoma Benjamin - Web Development & Programming Insights",
    description:
      "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
    images: ["https://ngomabenjamin.com/og-blog.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://ngomabenjamin.com/blog"
  }
}

export default async function BlogPage({ searchParams }: { searchParams?: { q?: string } }) {
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

  // Get categories with counts
  const categoriesWithCounts = Array.from(new Set(sortedPosts.map((post) => post.category))).filter(Boolean).map(category => ({
    name: category,
    count: sortedPosts.filter(post => post.category === category).length
  }))

  // Get unique categories for tabs
  const categories = Array.from(new Set(sortedPosts.map((post) => post.category))).filter(Boolean)

  // Get popular tags
  const allTags = sortedPosts.flatMap(post => post.tags || [])
  const popularTags = Array.from(new Set(allTags)).slice(0, 10)

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "Ngoma Benjamin's Blog",
    description:
      "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
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
      
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          <Image
            src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920&h=400&fit=crop"
            alt="Web development and programming blog"
            fill
            className="object-cover"
            priority
          />
          <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
              Development Insights
            </h1>
            <p className="mt-4 max-w-[700px] text-lg text-white/90 md:text-xl">
              Expert advice, tutorials, and insights on web development, programming, and technology
            </p>
            <div className="mt-8 w-full max-w-md">
              <SearchBlog initialQuery={searchQuery} />
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
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

              {/* Featured Posts */}
              {!searchQuery && featuredPosts.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold tracking-tight mb-6">Featured Articles</h2>
                  <div className="grid grid-cols-1 gap-8">
                    {featuredPosts.slice(0, 1).map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="relative h-[400px]">
                          <Image 
                            src={post.imagePath || post.image || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"} 
                            alt={post.title} 
                            fill 
                            className="object-cover" 
                            unoptimized={post.imagePath?.startsWith("/uploads/")}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-6 text-white">
                            <Badge className="mb-3 bg-primary text-primary-foreground">{post.category}</Badge>
                            <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                            <p className="text-white/80 mb-4 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-4">
                              <span>{post.author || "Ngoma Benjamin"}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTime || "5 min read"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardFooter className="p-4 bg-muted/30">
                          <Button asChild className="w-full">
                            <Link href={`/blog/${post.id || post.slug}`}>
                              Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredPosts.slice(1, 3).map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                          <div className="relative h-[200px]">
                            <Image
                              src={post.imagePath || post.image || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600&h=200&fit=crop"}
                              alt={post.title}
                              fill
                              className="object-cover"
                              unoptimized={post.imagePath?.startsWith("/uploads/")}
                            />
                            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                              {post.category}
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                            <p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{post.author || "Ngoma Benjamin"}</span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{post.date}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="ghost" size="sm" className="ml-auto" asChild>
                              <Link href={`/blog/${post.id || post.slug}`}>
                                Read More <ChevronRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Tabs for Categories */}
              <section className="mb-12">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    {categories.slice(0, 3).map((category) => (
                      <TabsTrigger key={category} value={category.toLowerCase()}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="all">
                    <BlogPostsList posts={searchQuery ? filteredPosts : sortedPosts.filter((post) => !post.featured || searchQuery)} />
                  </TabsContent>
                  {categories.slice(0, 3).map((category) => (
                    <TabsContent key={category} value={category.toLowerCase()}>
                      <BlogPostsList posts={filteredPosts.filter((post) => post.category === category)} />
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

              {/* Newsletter Signup */}
              <section className="rounded-lg bg-muted p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:flex-1">
                    <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
                    <p className="mt-2 text-muted-foreground">
                      Stay updated with the latest web development trends, tutorials, and programming insights.
                    </p>
                  </div>
                  <div className="md:flex-1">
                    <NewsletterForm />
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* About the Blog */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Blog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sharing insights, tutorials, and best practices in web development, programming, and technology. 
                    Learn from real-world experiences and stay updated with the latest trends.
                  </p>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categoriesWithCounts.map((category, index) => (
                      <li key={index}>
                        <Link
                          href={`/blog?category=${category.name.toLowerCase()}`}
                          className="flex items-center justify-between py-2 hover:text-primary"
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </Link>
                        {index < categoriesWithCounts.length - 1 && <Separator />}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <Link key={index} href={`/blog?q=${encodeURIComponent(tag)}`}>
                          <Badge variant="outline" className="hover:bg-muted">
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
                    {sortedPosts.slice(0, 4).map((post, index) => (
                      <div key={post.id}>
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <Image 
                              src={post.imagePath || post.image || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop"} 
                              alt={post.title} 
                              fill 
                              className="object-cover"
                              unoptimized={post.imagePath?.startsWith("/uploads/")}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium line-clamp-2">
                              <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary">
                                {post.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                          </div>
                        </div>
                        {index < 3 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Author */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full">
                      <Image
                        src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                        alt="Ngoma Benjamin"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-4 font-semibold">Ngoma Benjamin</h3>
                    <p className="text-sm text-muted-foreground">Founder of 301Inc</p>
                    <p className="mt-2 text-sm">
                      Full-stack developer with expertise in modern web technologies. 
                      Passionate about sharing knowledge and helping developers grow.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href="/about">View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface BlogPostsListProps {
  posts: any[]
}

function BlogPostsList({ posts }: BlogPostsListProps) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.id} className="flex flex-col md:flex-row gap-6 border-b pb-8">
          <div className="relative h-[200px] md:h-[180px] md:w-[280px] overflow-hidden rounded-lg">
            <Image 
              src={post.imagePath || post.image || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=280&h=180&fit=crop"} 
              alt={post.title} 
              fill 
              className="object-cover"
              unoptimized={post.imagePath?.startsWith("/uploads/")}
            />
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{post.category}</Badge>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h3>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>{post.author || "Ngoma Benjamin"}</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{post.readTime || "5 min read"}</span>
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" className="mt-4" asChild>
              <Link href={`/blog/${post.id || post.slug}`}>
                Read More <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>
      ))}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found in this category.</p>
        </div>
      )}
      {posts.length > 6 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load More Articles</Button>
        </div>
      )}
    </div>
  )
}