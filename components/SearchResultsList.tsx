"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Clock, 
  User, 
  Calendar, 
  ArrowRight,
  BookOpen,
  Hash,
  ExternalLink,
  Star,
  TrendingUp,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SearchResult {
  post: {
    id?: string
    slug?: string
    title: string
    excerpt?: string
    content?: string
    category?: string
    tags?: string[]
    author?: string
    date?: string
    createdAt?: string
    updatedAt?: string
    imagePath?: string
    image?: string
    readingTime?: number
    views?: number
    featured?: boolean
  }
  score: number
  matchType: "title" | "content" | "category" | "tags"
  snippets: Array<{
    text: string
    highlighted: string
    context: string
  }>
  matchedHeadings?: Array<{
    level: number
    text: string
    id: string
  }>
  searchType?: "exact_title_match" | "title_match" | "heading_match" | "content_match" | "general_match"
  relevanceScore?: number
  readingTime?: number
}

interface SearchResultsListProps {
  results: SearchResult[]
  query: string
  total: number
  isLoading?: boolean
  relatedSearches?: string[]
  onRelatedSearch?: (query: string) => void
  compact?: boolean
}

export default function SearchResultsList({
  results,
  query,
  total,
  isLoading = false,
  relatedSearches = [],
  onRelatedSearch,
  compact = false,
}: SearchResultsListProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!text || !searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm.split(' ').join('|')})`, 'gi')
    return text.split(regex).map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-muted rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="space-y-1">
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
        <h3 className="text-lg font-semibold mb-2">No results found for "{query}"</h3>
        <p className="text-muted-foreground mb-6">
          Try different keywords or check out these suggestions
        </p>
        {relatedSearches.length > 0 && (
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-medium mb-3">Try these searches:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {relatedSearches.map((related, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          About {total.toLocaleString()} results ({(Math.random() * 0.5 + 0.1).toFixed(2)} seconds)
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((result, index) => {
          const post = result.post
          const postUrl = `/blog/${post.id || post.slug}`
          
          return (
            <Card key={`${post.id || index}`} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  {(post.imagePath || post.image) && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={post.imagePath || post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* URL Bar */}
                    <div className="flex items-center gap-1 text-xs text-green-600 mb-1">
                      <span>ngomabenjamin.com</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="truncate">blog</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="truncate">{post.slug || post.id}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-medium text-blue-600 hover:underline mb-1 line-clamp-1">
                      <Link href={postUrl} className="group-hover:underline">
                        {highlightText(post.title, query)}
                      </Link>
                    </h2>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                      )}
                      {(post.date || post.createdAt) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.date || post.createdAt)}</span>
                        </div>
                      )}
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      )}
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views.toLocaleString()} views</span>
                        </div>
                      )}
                    </div>

                    {/* Excerpt/Snippet */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {result.snippets.length > 0 ? (
                        <span dangerouslySetInnerHTML={{ 
                          __html: result.snippets[0].highlighted 
                        }} />
                      ) : (
                        highlightText(post.excerpt || "", query)
                      )}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.featured && (
                        <Badge variant="default" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {post.category && (
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {post.category}
                        </Badge>
                      )}
                      {result.matchType === "title" && (
                        <Badge variant="secondary" className="text-xs">
                          Title Match
                        </Badge>
                      )}
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Hash className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Matched Headings */}
                    {result.matchedHeadings && result.matchedHeadings.length > 0 && (
                      <div className="mt-2 text-xs">
                        <span className="text-muted-foreground">Jump to: </span>
                        {result.matchedHeadings.slice(0, 2).map((heading, idx) => (
                          <Link
                            key={heading.id}
                            href={`${postUrl}#${heading.id}`}
                            className="text-blue-600 hover:underline mr-2"
                          >
                            {highlightText(heading.text, query)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Action */}
                  <div className="shrink-0">
                    <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={postUrl}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Related Searches at bottom for mobile */}
      {relatedSearches.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              People also search for
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedSearches.slice(0, 6).map((related, index) => (
                <button
                  key={index}
                  onClick={() => onRelatedSearch?.(related)}
                  className="text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center gap-2"
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
  )
}