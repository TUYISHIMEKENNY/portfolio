"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Target,
  Lightbulb,
  TrendingUp,
  Search,
  CheckCircle,
  Hash,
  Filter,
  Sparkles,
  Users,
  Eye,
} from "lucide-react"

interface SearchResult {
  post: any
  score: number
  matchType: "title" | "content" | "category" | "tags"
  snippets: Array<{
    text: string
    highlighted: string
    context: string
  }>
  matchedHeadings: Array<{
    level: number
    text: string
    id: string
  }>
  searchType?: "exact_title_match" | "title_match" | "heading_match" | "content_match" | "general_match"
  relevanceScore?: number
  readingTime?: number
}

interface SmartSearchResultsProps {
  results: SearchResult[]
  titleMatches: SearchResult[]
  contentMatches: SearchResult[]
  query: string
  total: number
  isLoading?: boolean
  relatedSearches?: string[]
  onRelatedSearch?: (query: string) => void
  searchAnalytics?: {
    totalTitleMatches: number
    totalContentMatches: number
    avgScore: number
  }
}

export default function SmartSearchResults({
  results,
  titleMatches,
  contentMatches,
  query,
  total,
  isLoading = false,
  relatedSearches = [],
  onRelatedSearch,
  searchAnalytics,
}: SmartSearchResultsProps) {
  const [showAllContent, setShowAllContent] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Check if we have an exact title match
  const exactTitleMatch = titleMatches.find((result) => result.post.title.toLowerCase() === query.toLowerCase())

  const allCategories = Array.from(
    new Set([...titleMatches, ...contentMatches].map((result) => result.post.category).filter(Boolean)),
  ).map((category) => ({
    name: category,
    count: [...titleMatches, ...contentMatches].filter((result) => result.post.category === category).length,
  }))

  const allTags = Array.from(
    new Set([...titleMatches, ...contentMatches].flatMap((result) => result.post.tags || [])),
  ).slice(0, 10)

  const generateIntelligentSuggestions = () => {
    const suggestions = new Set<string>()

    // Add category-based suggestions
    allCategories.forEach((cat) => {
      if (cat.name.toLowerCase() !== query.toLowerCase()) {
        suggestions.add(`${query} ${cat.name}`)
        suggestions.add(cat.name)
      }
    })

    // Add tag-based suggestions
    allTags.slice(0, 5).forEach((tag) => {
      if (tag.toLowerCase() !== query.toLowerCase()) {
        suggestions.add(`${query} ${tag}`)
        suggestions.add(tag)
      }
    })

    // Add semantic variations
    const semanticVariations = [
      `${query} tutorial`,
      `${query} guide`,
      `${query} examples`,
      `${query} best practices`,
      `how to ${query}`,
      `${query} tips`,
    ]

    semanticVariations.forEach((variation) => suggestions.add(variation))

    return Array.from(suggestions).slice(0, 12)
  }

  const intelligentSuggestions = generateIntelligentSuggestions()

  const filteredTitleMatches = selectedCategory
    ? titleMatches.filter((result) => result.post.category === selectedCategory)
    : titleMatches

  const filteredContentMatches = selectedCategory
    ? contentMatches.filter((result) => result.post.category === selectedCategory)
    : contentMatches

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-muted rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search terms or browse our categories</p>
        {(relatedSearches.length > 0 || intelligentSuggestions.length > 0) && (
          <div className="space-y-4">
            <p className="text-sm font-medium mb-3">Try these related searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[...relatedSearches, ...intelligentSuggestions].slice(0, 8).map((related, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="search-filter-chip"
                  onClick={() => onRelatedSearch?.(related)}
                >
                  {related}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>
          <p className="text-muted-foreground">
            Found {total} result{total !== 1 ? "s" : ""}
            {searchAnalytics && (
              <span className="ml-2 text-sm">
                • {searchAnalytics.totalTitleMatches} title matches • {searchAnalytics.totalContentMatches} content
                matches
              </span>
            )}
          </p>
        </div>

        {/* Search Analytics */}
        {searchAnalytics && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Avg. Relevance: {Math.round(searchAnalytics.avgScore)}%</span>
            </div>
          </div>
        )}
      </div>

      {allCategories.length > 0 && (
        <Card className="bg-search-filter-bg border-search-result-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`search-filter-chip ${!selectedCategory ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Results ({total})
              </button>
              {allCategories.map((category, index) => (
                <button
                  key={index}
                  className={`search-filter-chip ${selectedCategory === category.name ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exact Title Match - Special Treatment */}
      {exactTitleMatch && (
        <Card className="border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Perfect Match</Badge>
            </div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              Everything you need is in this article!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              We found an article that exactly matches your search. This comprehensive guide should have all the
              information you're looking for.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ExactMatchCard result={exactTitleMatch} query={query} />
          </CardContent>
        </Card>
      )}

      {/* Title Matches Section */}
      {filteredTitleMatches.length > 0 && !exactTitleMatch && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Articles matching your search</h3>
            <Badge variant="secondary">{filteredTitleMatches.length}</Badge>
            {selectedCategory && (
              <Badge variant="outline" className="text-xs">
                in {selectedCategory}
              </Badge>
            )}
          </div>
          <div className="space-y-4">
            {filteredTitleMatches.map((result, index) => (
              <TitleMatchCard key={`title-${result.post.id}-${index}`} result={result} query={query} />
            ))}
          </div>
        </div>
      )}

      {/* Content Matches Section */}
      {filteredContentMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Related content and insights</h3>
              <Badge variant="secondary">{filteredContentMatches.length}</Badge>
              {selectedCategory && (
                <Badge variant="outline" className="text-xs">
                  in {selectedCategory}
                </Badge>
              )}
            </div>
            {filteredContentMatches.length > 3 && (
              <Button variant="outline" size="sm" onClick={() => setShowAllContent(!showAllContent)}>
                {showAllContent ? "Show Less" : `Show All ${filteredContentMatches.length}`}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            These articles contain relevant information about your search topic with highlighted sections.
          </p>
          <div className="space-y-4">
            {(showAllContent ? filteredContentMatches : filteredContentMatches.slice(0, 3)).map((result, index) => (
              <ContentMatchCard key={`content-${result.post.id}-${index}`} result={result} query={query} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Related Searches */}
        {(relatedSearches.length > 0 || intelligentSuggestions.length > 0) && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Related Searches
              </h3>
              <div className="space-y-3">
                {relatedSearches.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Popular</p>
                    <div className="flex flex-wrap gap-2">
                      {relatedSearches.slice(0, 6).map((related, index) => (
                        <button key={index} className="search-filter-chip" onClick={() => onRelatedSearch?.(related)}>
                          <Users className="w-3 h-3 mr-1" />
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {intelligentSuggestions.length > 0 && (
                  <div>
                    <Separator className="my-3" />
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Suggested</p>
                    <div className="flex flex-wrap gap-2">
                      {intelligentSuggestions.slice(0, 6).map((suggestion, index) => (
                        <button
                          key={index}
                          className="search-filter-chip"
                          onClick={() => onRelatedSearch?.(suggestion)}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Tags */}
        {allTags.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <button key={index} className="search-filter-chip" onClick={() => onRelatedSearch?.(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Search Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Refine your search:</p>
              <ul className="space-y-1">
                <li>• Use quotes for exact phrases: "web development"</li>
                <li>• Try different keywords or synonyms</li>
                <li>• Use category filters above</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Popular searches:</p>
              <div className="flex flex-wrap gap-1">
                {["React", "JavaScript", "CSS", "Next.js", "TypeScript"].map((term, index) => (
                  <button
                    key={index}
                    className="text-xs bg-background border border-border rounded px-2 py-1 hover:bg-accent transition-colors"
                    onClick={() => onRelatedSearch?.(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component for exact title matches
function ExactMatchCard({ result, query }: { result: SearchResult; query: string }) {
  const { post } = result

  return (
    <div className="flex gap-4">
      <div className="relative w-40 h-28 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={
            post.imagePath ||
            post.image ||
            "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=160&h=112&fit=crop" ||
            "/placeholder.svg" ||
            "/placeholder.svg"
          }
          alt={post.title}
          fill
          className="object-cover"
          unoptimized={post.imagePath?.startsWith("/uploads/")}
        />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-lg mb-2">
          <Link href={`/blog/${post.id || post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span>{post.author || "Ngoma Benjamin"}</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{result.readingTime || 5} min read</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary">{post.category}</Badge>
            {post.tags?.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button asChild size="sm">
            <Link href={`/blog/${post.id || post.slug}`}>
              Read Article
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component for title matches
function TitleMatchCard({ result, query }: { result: SearchResult; query: string }) {
  const { post, score, relevanceScore } = result
  const highlightedTitle = highlightText(post.title || "", query)

  return (
    <Card className="search-result-card border-l-4 border-l-blue-200 hover:border-l-blue-400">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={
                post.imagePath ||
                post.image ||
                "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=96&h=80&fit=crop" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={post.imagePath?.startsWith("/uploads/")}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold line-clamp-2">
                <Link
                  href={`/blog/${post.id || post.slug}`}
                  className="search-result-title"
                  dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                />
              </h4>
              {relevanceScore && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {Math.round(relevanceScore)}% match
                </Badge>
              )}
            </div>
            <p className="search-result-snippet text-sm line-clamp-2 mb-3">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.author || "Ngoma Benjamin"}</span>
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/blog/${post.id || post.slug}`}>
                  Read More
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for content matches with highlighted snippets
function ContentMatchCard({ result, query }: { result: SearchResult; query: string }) {
  const { post, snippets, matchedHeadings, relevanceScore } = result
  const highlightedTitle = highlightText(post.title || "", query)
  const bestSnippets = snippets.slice(0, 2)

  return (
    <Card className="search-result-card border-l-4 border-l-orange-200 hover:border-l-orange-400">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={
                post.imagePath ||
                post.image ||
                "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=80&h=64&fit=crop" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={post.imagePath?.startsWith("/uploads/")}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm line-clamp-1">
                <Link
                  href={`/blog/${post.id || post.slug}`}
                  className="search-result-title"
                  dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                />
              </h4>
              {relevanceScore && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {Math.round(relevanceScore)}% match
                </Badge>
              )}
            </div>

            {/* Highlighted Snippets */}
            {bestSnippets.length > 0 && (
              <div className="space-y-2 mb-3">
                {bestSnippets.map((snippet, index) => (
                  <div key={index} className="bg-search-match-bg p-2 rounded text-xs leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: snippet.highlighted }} />
                  </div>
                ))}
              </div>
            )}

            {/* Matched Headings */}
            {matchedHeadings.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {matchedHeadings.slice(0, 2).map((heading, index) => (
                    <Link
                      key={index}
                      href={`/blog/${post.id || post.slug}#${heading.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 bg-primary/10 px-2 py-1 rounded transition-colors"
                    >
                      <span>H{heading.level}</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(heading.text, query),
                        }}
                      />
                      <ExternalLink className="w-2 h-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                {snippets.length > 2 && <span>+{snippets.length - 2} more matches</span>}
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/blog/${post.id || post.slug}`}>
                  View Article
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function highlightText(text: string, query: string): string {
  if (!query.trim() || !text) return text

  const queryTerms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1)
  let highlightedText = text

  queryTerms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegex(term)})`, "gi")
    highlightedText = highlightedText.replace(regex, '<span class="search-highlight">$1</span>')
  })

  return highlightedText
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
