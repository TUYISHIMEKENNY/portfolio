"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import AdvancedSearchBox from "@/components/AdvancedSearchBox"
import SearchResultsList from "@/components/SearchResultsList"
import { useSearch } from "@/hooks/use-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Hash, BookOpen, Filter } from "lucide-react"
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
    const baseTitle = "Search Blog Posts | Ngoma Benjamin"
    const baseDescription =
      "Search through expert articles, tutorials, and insights on web development, programming, and technology."

    if (query) {
      return {
        title: `"${query}" Search Results | Ngoma Benjamin Blog`,
        description: `Find articles about ${query}. ${total} results found in web development, programming, and technology tutorials.`,
        keywords: [query, "search", "blog", "web development", "programming", "tutorials", selectedCategory].filter(
          Boolean,
        ),
        canonicalUrl: `/search?q=${encodeURIComponent(query)}${selectedCategory ? `&category=${selectedCategory}` : ""}`,
      }
    }

    return {
      title: baseTitle,
      description: baseDescription,
      keywords: ["search", "blog", "web development", "programming", "tutorials", "articles"],
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

  const availableTags = Array.from(new Set(results.flatMap((result) => result.post.tags || []))).slice(0, 20)

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
          },
          datePublished: result.post.date || result.post.createdAt,
          image: result.post.imagePath || result.post.image,
        },
      })),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ngomabenjamin.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords.join(", ")} />
        <link rel="canonical" href={`https://ngomabenjamin.com${seoData.canonicalUrl}`} />

        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ngomabenjamin.com${seoData.canonicalUrl}`} />
        <meta property="og:site_name" content="Ngoma Benjamin" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Search Header */}
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Search Blog Posts</h1>
              <p className="text-muted-foreground mb-6">
                Find articles, tutorials, and insights on web development and programming
              </p>
              <AdvancedSearchBox
                initialQuery={initialQuery}
                onSearch={handleSearch}
                placeholder="Search for articles, topics, categories, or tags..."
              />
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Filter Toggle for Mobile */}
                <div className="lg:hidden">
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                  {/* Active Filters */}
                  {(selectedCategory || selectedTags.length > 0) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Active Filters</CardTitle>
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {selectedCategory && (
                            <Badge variant="default" className="mr-2">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {selectedCategory}
                            </Badge>
                          )}
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="mr-2">
                              <Hash className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Categories Filter */}
                  {availableCategories.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Categories
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {availableCategories.map((category) => (
                            <button
                              key={category}
                              onClick={() => handleCategoryFilter(category)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags Filter */}
                  {availableTags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {availableTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => handleTagFilter(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Popular Searches */}
                  {relatedSearches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Related Searches
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {relatedSearches.map((related, index) => (
                            <button
                              key={index}
                              onClick={() => handleRelatedSearch(related)}
                              className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                            >
                              {related}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {query ? (
                <SearchResultsList
                  results={results}
                  query={query}
                  total={total}
                  isLoading={isLoading}
                  relatedSearches={relatedSearches}
                  onRelatedSearch={handleRelatedSearch}
                />
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Start Your Search</h2>
                  <p className="text-muted-foreground mb-6">
                    Enter keywords, topics, or categories to find relevant blog posts
                  </p>
                  <div className="max-w-md mx-auto">
                    <AdvancedSearchBox
                      onSearch={handleSearch}
                      placeholder="Try searching for 'React', 'JavaScript', or 'Web Development'..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
