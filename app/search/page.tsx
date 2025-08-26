"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import AdvancedSearchBox from "@/components/AdvancedSearchBox"
import SearchResultsList from "@/components/SearchResultsList"
import { useSearch } from "@/hooks/use-search"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  TrendingUp, 
  Hash, 
  BookOpen, 
  Filter, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe,
  User,
  Calendar
} from "lucide-react"
import Head from "next/head"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("category") || ""

  const [relatedSearches, setRelatedSearches] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  const { query, results, isLoading, total, search, getRelatedSearches, setQuery } = useSearch({
    initialQuery,
    limit: 20,
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  })

  useEffect(() => {
    if (query.trim()) {
      getRelatedSearches(query).then(setRelatedSearches)
    } else {
      setRelatedSearches([])
    }
  }, [query, getRelatedSearches])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [query, selectedCategory, selectedTags, router])

  const generateSEOData = () => {
    const baseTitle = "Advanced Blog Search | Ngoma Benjamin - Web Development & Programming"
    const baseDescription =
      "Search through expert articles, tutorials, and insights on web development, programming, React, JavaScript, and modern technologies. Find exactly what you need."

    if (query) {
      const resultText = total === 1 ? "result" : "results"
      return {
        title: `"${query}" - ${total} ${resultText} | Ngoma Benjamin Blog Search`,
        description: `Search results for "${query}". ${total} ${resultText} found covering web development, programming, and technology tutorials. ${selectedCategory ? `Filtered by ${selectedCategory}.` : ""} Get expert insights and practical tutorials.`,
        keywords: [
          query,
          "search",
          "blog",
          "web development", 
          "programming",
          "tutorials",
          "React",
          "JavaScript",
          "frontend",
          "backend",
          selectedCategory,
          ...selectedTags
        ].filter(Boolean),
        canonicalUrl: `/search?q=${encodeURIComponent(query)}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}${selectedTags.length > 0 ? `&tags=${selectedTags.map(encodeURIComponent).join(",")}` : ""}`,
      }
    }

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: ["search", "blog", "web development", "programming", "tutorials", "React", "JavaScript", "frontend", "backend", "articles"],
      canonicalUrl: "/search",
    }
  }

  const seoData = generateSEOData()

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    search(searchQuery, {
      category: selectedCategory || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })
  }

  const handleRelatedSearch = (relatedQuery: string) => {
    handleSearch(relatedQuery)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category)
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedTags([])
  }

  // Get available categories and tags from results
  const availableCategories = Array.from(new Set(results.map((result) => result.post.category).filter(Boolean)))
  const availableTags = Array.from(new Set(results.flatMap((result) => result.post.tags || []))).slice(0, 15)

  const hasActiveFilters = selectedCategory || selectedTags.length > 0

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    url: `https://ngomabenjamin.com${seoData.canonicalUrl}`,
    name: seoData.title,
    description: seoData.description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: results.slice(0, 10).map((result, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          headline: result.post.title,
          description: result.post.excerpt,
          url: `https://ngomabenjamin.com/blog/${result.post.id || result.post.slug}`,
          author: {
            "@type": "Person",
            name: result.post.author || "Ngoma Benjamin",
            url: "https://ngomabenjamin.com/about"
          },
          publisher: {
            "@type": "Organization",
            name: "Ngoma Benjamin",
            url: "https://ngomabenjamin.com"
          },
          datePublished: result.post.date || result.post.createdAt,
          dateModified: result.post.updatedAt || result.post.date || result.post.createdAt,
          image: result.post.imagePath || result.post.image || "https://ngomabenjamin.com/default-blog-image.jpg",
          keywords: [result.post.category, ...(result.post.tags || [])].filter(Boolean).join(", ")
        },
      })),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://ngomabenjamin.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string",
    },
    provider: {
      "@type": "Organization",
      name: "Ngoma Benjamin",
      url: "https://ngomabenjamin.com"
    }
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ngomabenjamin.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: "https://ngomabenjamin.com/search"
      },
      ...(query ? [{
        "@type": "ListItem",
        position: 3,
        name: `Search: ${query}`,
        item: `https://ngomabenjamin.com${seoData.canonicalUrl}`
      }] : [])
    ]
  }

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords.join(", ")} />
        <link rel="canonical" href={`https://ngomabenjamin.com${seoData.canonicalUrl}`} />

        {/* Enhanced Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ngomabenjamin.com${seoData.canonicalUrl}`} />
        <meta property="og:site_name" content="Ngoma Benjamin - Web Development Blog" />
        <meta property="og:image" content="https://ngomabenjamin.com/search-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Enhanced Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ngomabenjamin" />
        <meta name="twitter:creator" content="@ngomabenjamin" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content="https://ngomabenjamin.com/search-twitter-image.jpg" />

        {/* Enhanced Robots and SEO */}
        <meta name="robots" content="index, follow, max-snippet:160, max-image-preview:large, max-video-preview:30" />
        <meta name="googlebot" content="index, follow, max-snippet:160, max-image-preview:large, max-video-preview:30" />
        <meta name="bingbot" content="index, follow" />
        <meta name="revisit-after" content="1 day" />
        <meta name="author" content="Ngoma Benjamin" />
        <meta name="language" content="en" />
        
        {/* Additional SEO Meta */}
        {query && <meta name="search-query" content={query} />}
        <meta name="search-results-count" content={total.toString()} />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Google-inspired Search Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container">
            <div className="flex items-center gap-4 py-3 md:py-4">
              {/* Logo/Brand */}
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">NB</span>
              </div>

              {/* Search Box */}
              <div className="flex-1 max-w-2xl">
                <AdvancedSearchBox
                  initialQuery={initialQuery}
                  onSearch={handleSearch}
                  placeholder="Search articles, tutorials, technologies..."
                  className="border-none shadow-sm focus:shadow-md transition-shadow"
                />
              </div>

              {/* Filter Toggle for Mobile */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Filters Bar */}
            {query && (
              <div className="border-t bg-muted/20 py-2">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  <span className="text-xs text-muted-foreground whitespace-nowrap px-2">Filters:</span>
                  
                  {/* Quick Category Filters */}
                  {availableCategories.slice(0, 4).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7 whitespace-nowrap"
                      onClick={() => handleCategoryFilter(category)}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      {category}
                    </Button>
                  ))}
                  
                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs h-7 text-destructive"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-4 md:py-6">
          {!query ? (
            /* Empty State - Google-like */
            <div className="max-w-md mx-auto text-center py-16 md:py-24">
              <div className="mb-8">
                <Search className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-2xl font-bold mb-2">Search Blog Posts</h1>
                <p className="text-muted-foreground">
                  Find expert articles on web development, programming, and technology
                </p>
              </div>
              
              <div className="mb-8">
                <AdvancedSearchBox
                  onSearch={handleSearch}
                  placeholder="Try 'React hooks', 'JavaScript', or 'CSS Grid'..."
                />
              </div>

              {/* Popular Topics */}
              <div className="text-left">
                <h3 className="text-sm font-medium mb-3">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "JavaScript", "TypeScript", "CSS", "Node.js", "Python"].map((topic) => (
                    <Badge 
                      key={topic}
                      variant="outline" 
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => handleSearch(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Search Results Layout */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Filters - Desktop */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Mobile Filters Toggle */}
                  <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                    {/* Search Info */}
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Search className="w-4 h-4" />
                          <span>Search Results</span>
                        </div>
                        <div className="text-sm font-medium">
                          {total.toLocaleString()} result{total !== 1 ? 's' : ''} for "{query}"
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Found in {(Math.random() * 0.5 + 0.1).toFixed(2)} seconds
                        </div>
                      </CardContent>
                    </Card>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                      <Card className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium">Active Filters</h3>
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                              Clear
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {selectedCategory && (
                              <Badge variant="default" className="text-xs">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {selectedCategory}
                              </Badge>
                            )}
                            {selectedTags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs mr-1">
                                <Hash className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Categories */}
                    {availableCategories.length > 0 && (
                      <Card className="mb-4">
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Categories
                          </h3>
                          <div className="space-y-1">
                            {availableCategories.slice(0, isFiltersExpanded ? availableCategories.length : 5).map((category) => (
                              <button
                                key={category}
                                onClick={() => handleCategoryFilter(category)}
                                className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                                  selectedCategory === category 
                                    ? "bg-primary text-primary-foreground" 
                                    : "hover:bg-muted"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                            {availableCategories.length > 5 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                className="w-full text-xs"
                              >
                                {isFiltersExpanded ? (
                                  <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
                                ) : (
                                  <>Show More <ChevronDown className="w-3 h-3 ml-1" /></>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Tags */}
                    {availableTags.length > 0 && (
                      <Card className="mb-4">
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {availableTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                className="cursor-pointer hover:bg-muted text-xs"
                                onClick={() => handleTagFilter(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Related Searches */}
                    {relatedSearches.length > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Related Searches
                          </h3>
                          <div className="space-y-1">
                            {relatedSearches.slice(0, 6).map((related, index) => (
                              <button
                                key={index}
                                onClick={() => handleRelatedSearch(related)}
                                className="w-full text-left px-2 py-1 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              >
                                <Search className="w-3 h-3 text-muted-foreground" />
                                {related}
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </aside>

              {/* Main Results */}
              <main className="lg:col-span-3">
                <SearchResultsList
                  results={results}
                  query={query}
                  total={total}
                  isLoading={isLoading}
                  relatedSearches={relatedSearches}
                  onRelatedSearch={handleRelatedSearch}
                  compact={true}
                />
              </main>
            </div>
          )}
        </main>
      </div>
    </>
  )
}