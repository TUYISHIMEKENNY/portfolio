import type { Metadata } from "next"
import { getAllItems } from "@/lib/file-storage"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: { category: string }
  searchParams?: { page?: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ')
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
  
  return {
    title: `${formattedCategory} Articles | Ngoma Benjamin Blog`,
    description: `Browse all ${formattedCategory.toLowerCase()} articles and tutorials by Ngoma Benjamin. Expert insights on web development, programming, and technology.`,
    keywords: [
      formattedCategory.toLowerCase(),
      "ngoma benjamin",
      "web development",
      "programming",
      "technology blog",
      "tutorials"
    ],
    openGraph: {
      title: `${formattedCategory} Articles | Ngoma Benjamin Blog`,
      description: `Browse all ${formattedCategory.toLowerCase()} articles and tutorials by Ngoma Benjamin.`,
      type: "website",
      url: `https://ngomabenjamin.com/blog/category/${params.category}`,
    }
  }
}

export async function generateStaticParams() {
  const posts = await getAllItems("blog")
  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)))
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, '-')
  }))
}

const POSTS_PER_PAGE = 10

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const categorySlug = params.category
  const categoryName = decodeURIComponent(categorySlug).replace(/-/g, ' ')
  
  // Get all posts
  const allPosts = await getAllItems("blog")
  
  // Filter posts by category (case-insensitive)
  const categoryPosts = allPosts.filter(post => 
    post.category?.toLowerCase() === categoryName.toLowerCase()
  )
  
  if (categoryPosts.length === 0) {
    notFound()
  }
  
  // Sort by date
  const sortedPosts = categoryPosts.sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt || 0)
    const dateB = new Date(b.date || b.createdAt || 0)
    return dateB.getTime() - dateA.getTime()
  })
  
  // Calculate pagination
  const totalPosts = sortedPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex)
  
  // Get category stats
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10" />
        <Image
          src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920&h=300&fit=crop"
          alt={`${formattedCategory} articles`}
          fill
          className="object-cover"
          priority
        />
        <div className="container relative z-20 flex h-full flex-col justify-center">
          <Link
            href="/blog"
            className="mb-4 inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
            {formattedCategory}
          </h1>
          <p className="mt-4 text-lg text-white/90">
            {totalPosts} article{totalPosts !== 1 ? 's' : ''} in this category
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Posts Grid */}
            <div className="space-y-8">
              {paginatedPosts.map((post) => (
                <article key={post.id} className="flex flex-col md:flex-row gap-6 border-b pb-8 last:border-b-0">
                  <div className="relative h-[200px] md:h-[180px] md:w-[280px] overflow-hidden rounded-lg">
                    <Image 
                      src={post.imagePath || post.image || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=280&h=180&fit=crop"} 
                      alt={post.title} 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      unoptimized={post.imagePath?.startsWith("/uploads/")}
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">
                      <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
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
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.id || post.slug}`}>
                        Read More <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href={`/blog/category/${categorySlug}?page=${currentPage - 1}`}
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href={`/blog/category/${categorySlug}?page=${page}`}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href={`/blog/category/${categorySlug}?page=${currentPage + 1}`}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Category Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {formattedCategory}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore our collection of {totalPosts} article{totalPosts !== 1 ? 's' : ''} about {formattedCategory.toLowerCase()}. 
                  From beginner guides to advanced techniques, find everything you need to know.
                </p>
              </CardContent>
            </Card>

            {/* All Categories */}
            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(allPosts.map(post => post.category).filter(Boolean))).map((cat) => {
                    const catSlug = cat.toLowerCase().replace(/\s+/g, '-')
                    const count = allPosts.filter(post => post.category === cat).length
                    return (
                      <Link
                        key={cat}
                        href={`/blog/category/${catSlug}`}
                        className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                          cat.toLowerCase() === categoryName.toLowerCase() 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <span>{cat}</span>
                        <Badge variant={cat.toLowerCase() === categoryName.toLowerCase() ? "secondary" : "outline"}>
                          {count}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allPosts.slice(0, 4).map((post, index) => (
                    <div key={post.id}>
                      <div className="flex gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                          <Image 
                            src={post.imagePath || post.image || "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop"} 
                            alt={post.title} 
                            fill 
                            className="object-cover"
                            unoptimized={post.imagePath?.startsWith("/uploads/")}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary">
                              {post.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                      </div>
                      {index < 3 && <div className="border-b mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
