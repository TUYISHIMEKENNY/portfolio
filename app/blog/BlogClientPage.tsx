"use client"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsletterForm from "@/components/newsletter-form"
import AdvancedSearchBox from "@/components/AdvancedSearchBox"
import SearchResultsList from "@/components/SearchResultsList"
import { useEffect, useState } from "react"

interface BlogPageProps {
  searchParams?: {
    q?: string
    page?: string
    category?: string
  }
}

const POSTS_PER_PAGE = 10

export default function BlogClientPage({ searchParams }: BlogPageProps) {
  const searchQuery = searchParams?.q || ""
  const currentPage = Number.parseInt(searchParams?.page || "1", 10)
  const categoryFilter = searchParams?.category || ""

  const useAdvancedSearch = searchQuery.length > 0

  const [posts, setPosts] = useState<any[]>([])
  const [sortedPosts, setSortedPosts] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [relatedSearches, setRelatedSearches] = useState<string[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([])
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [paginatedPosts, setPaginatedPosts] = useState<any[]>([])
  const [totalPosts, setTotalPosts] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const postsResponse = await fetch("/api/blog", { cache: "no-store" })
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch blog posts")
        }
        const fetchedPosts = await postsResponse.json()
        setPosts(fetchedPosts)

        // Sort posts by date (newest first)
        const sorted = [...fetchedPosts].sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt || 0)
          const dateB = new Date(b.date || b.createdAt || 0)
          return dateB.getTime() - dateA.getTime()
        })
        setSortedPosts(sorted)

        let searchResults: any[] = []
        let relatedSearches: string[] = []

        if (useAdvancedSearch) {
          try {
            const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`, {
              cache: "no-store",
            })

            if (searchResponse.ok) {
              const searchData = await searchResponse.json()
              searchResults = searchData.results || []
            }

            const relatedResponse = await fetch(
              `/api/search?type=related&q=${encodeURIComponent(searchQuery)}&limit=5`,
              { cache: "no-store" },
            )

            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              relatedSearches = relatedData.related || []
            }
          } catch (error) {
            console.error("Search API error:", error)
            // Fallback to basic search
            searchResults = []
          }
        }

        setSearchResults(searchResults)
        setRelatedSearches(relatedSearches)

        // Filter posts by search query and category (fallback for basic search)
        let filtered = sorted

        if (searchQuery && !useAdvancedSearch) {
          filtered = filtered.filter(
            (post) =>
              post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
              post.category?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        if (categoryFilter) {
          filtered = filtered.filter((post) => post.category?.toLowerCase() === categoryFilter.toLowerCase())
        }

        setFilteredPosts(filtered)

        const total = useAdvancedSearch ? searchResults.length : filtered.length
        setTotalPosts(total)

        const totalPages = Math.ceil(total / POSTS_PER_PAGE)
        setTotalPages(totalPages)

        const startIndex = (currentPage - 1) * POSTS_PER_PAGE
        const endIndex = startIndex + POSTS_PER_PAGE
        const paginated = useAdvancedSearch ? searchResults : filtered.slice(startIndex, endIndex)
        setPaginatedPosts(paginated)

        // Get featured posts
        const featured = sorted.filter((post) => post.featured)
        setFeaturedPosts(featured)

        // Get categories with counts
        const categoriesWithCounts = Array.from(new Set(sorted.map((post) => post.category)))
          .filter(Boolean)
          .map((category) => ({
            name: category,
            count: sorted.filter((post) => post.category === category).length,
          }))
        setCategoriesWithCounts(categoriesWithCounts)

        // Get unique categories for tabs
        const categories = Array.from(new Set(sorted.map((post) => post.category))).filter(Boolean)
        setCategories(categories)

        // Get popular tags
        const allTags = sorted.flatMap((post) => post.tags || [])
        const popularTags = Array.from(new Set(allTags)).slice(0, 10)
        setPopularTags(popularTags)
      } catch (error) {
        console.error("Error fetching blog data:", error)
        // Set empty states on error
        setPosts([])
        setSortedPosts([])
        setSearchResults([])
        setRelatedSearches([])
        setFilteredPosts([])
        setFeaturedPosts([])
        setCategoriesWithCounts([])
        setCategories([])
        setPopularTags([])
        setPaginatedPosts([])
        setTotalPosts(0)
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, categoryFilter, useAdvancedSearch, currentPage])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
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
              <AdvancedSearchBox initialQuery={searchQuery} placeholder="Search articles, topics, or categories..." />
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
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
              <AdvancedSearchBox initialQuery={searchQuery} placeholder="Search articles, topics, or categories..." />
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
                  {useAdvancedSearch && searchResults.length > 0 ? (
                    <SearchResultsList
                      results={searchResults}
                      query={searchQuery}
                      total={totalPosts}
                      relatedSearches={relatedSearches}
                      onRelatedSearch={(query) => {
                        const params = new URLSearchParams(window.location.search)
                        params.set("q", query)
                        window.location.href = `/blog?${params.toString()}`
                      }}
                    />
                  ) : (
                    <>
                      <h2 className="mb-4 text-2xl font-bold">
                        Search Results for "{searchQuery}" ({totalPosts})
                      </h2>
                      {totalPosts === 0 && (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-4 text-lg font-medium">No results found</p>
                          <p className="text-muted-foreground mb-4">
                            Try searching with different keywords or browse all posts below
                          </p>
                          {relatedSearches.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                              {relatedSearches.map((related, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-muted"
                                  onClick={() => {
                                    window.location.href = `/blog?q=${encodeURIComponent(related)}`
                                  }}
                                >
                                  {related}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Featured Posts */}
              {!searchQuery && featuredPosts.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold tracking-tight mb-6">Featured Articles</h2>
                  <div className="relative">
                    <div className="overflow-x-auto scrollbar-hide pb-4">
                      <div className="flex gap-6 w-max">
                        {featuredPosts.map((post) => (
                          <Card
                            key={post.id}
                            className="overflow-hidden flex-shrink-0 w-[320px] md:w-[400px] hover:shadow-lg transition-all duration-300 group"
                          >
                            <div className="relative h-[240px]">
                              <Image
                                src={
                                  post.imagePath ||
                                  post.image ||
                                  "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized={post.imagePath?.startsWith("/uploads/")}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 p-4 text-white">
                                <Badge className="mb-2 bg-primary text-primary-foreground">{post.category}</Badge>
                                <h3 className="text-lg font-bold mb-1 line-clamp-2">{post.title}</h3>
                                <p className="text-white/80 mb-2 line-clamp-2 text-sm">{post.excerpt}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  <span>{post.author || "Ngoma Benjamin"}</span>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{post.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CardFooter className="p-3 bg-muted/30">
                              <Button
                                asChild
                                size="sm"
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                              >
                                <Link href={`/blog/${post.id || post.slug}`}>
                                  Read Article <ArrowRight className="ml-2 h-3 w-3" />
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-full bg-gradient-to-r from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-full bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </section>
              )}

              {/* Tabs for Categories */}
              <section className="mb-12">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    {categories.slice(0, 3).map((category) => (
                      <TabsTrigger className="truncate" key={category} value={category.toLowerCase()}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="all">
                    <BlogPostsList
                      posts={searchQuery || categoryFilter ? paginatedPosts : sortedPosts}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      searchParams={searchParams}
                    />
                  </TabsContent>
                  {categories.slice(0, 3).map((category) => (
                    <TabsContent key={category} value={category.toLowerCase()}>
                      <BlogPostsList
                        posts={filteredPosts.filter((post) => post.category === category)}
                        currentPage={1}
                        totalPages={1}
                        searchParams={searchParams}
                      />
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
                          href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
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
                              src={
                                post.imagePath ||
                                post.image ||
                                "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
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
                      Full-stack developer with expertise in modern web technologies. Passionate about sharing knowledge
                      and helping developers grow.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
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
  currentPage?: number
  totalPages?: number
  searchParams?: any
}

function BlogPostsList({ posts, currentPage = 1, totalPages = 1, searchParams }: BlogPostsListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => {
        // Alternate between landscape and compact (Reddit-style) layouts
        const isLandscape = index % 3 === 0

        if (isLandscape) {
          return (
            <article
              key={post.id}
              className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="relative h-[200px] md:h-[160px] md:w-[240px] overflow-hidden rounded-lg flex-shrink-0">
                <Image
                  src={
                    post.imagePath ||
                    post.image ||
                    "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=240&h=160&fit=crop" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized={post.imagePath?.startsWith("/uploads/")}
                />
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                  {post.category}
                </Badge>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span>{post.author || "Ngoma Benjamin"}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime || "5 min read"}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.id || post.slug}`}>
                      Read More <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          )
        } else {
          // Reddit-style compact layout
          return (
            <article key={post.id} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={
                    post.imagePath ||
                    post.image ||
                    "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized={post.imagePath?.startsWith("/uploads/")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">
                  <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm line-clamp-1 mb-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.author || "Ngoma Benjamin"}</span>
                    <span>•</span>
                    <span>{post.readTime || "5 min read"}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
                    <Link href={`/blog/${post.id || post.slug}`}>
                      Read <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          )
        }
      })}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found in this category.</p>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/blog?${new URLSearchParams({
                      ...searchParams,
                      page: (currentPage - 1).toString(),
                    }).toString()}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`/blog?${new URLSearchParams({
                      ...searchParams,
                      page: page.toString(),
                    }).toString()}`}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`/blog?${new URLSearchParams({
                      ...searchParams,
                      page: (currentPage + 1).toString(),
                    }).toString()}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
