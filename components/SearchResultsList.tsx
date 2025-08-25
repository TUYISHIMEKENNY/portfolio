"use client"

import { useState } from "react"
import SearchResultCard from "./SearchResultCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search, Grid, List, TrendingUp, Hash, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

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
}

interface SearchResultsListProps {
  results: SearchResult[]
  query: string
  total: number
  isLoading?: boolean
  relatedSearches?: string[]
  onRelatedSearch?: (query: string) => void
}

type SortOption = "relevance" | "date" | "title"
type ViewMode = "list" | "compact"

export default function SearchResultsList({
  results,
  query,
  total,
  isLoading = false,
  relatedSearches = [],
  onRelatedSearch,
}: SearchResultsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [filterByType, setFilterByType] = useState<string>("all")

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.score - a.score
      case "date":
        const dateA = new Date(a.post.date || a.post.createdAt || 0)
        const dateB = new Date(b.post.date || b.post.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      case "title":
        return (a.post.title || "").localeCompare(b.post.title || "")
      default:
        return 0
    }
  })

  const filteredResults =
    filterByType === "all" ? sortedResults : sortedResults.filter((result) => result.matchType === filterByType)

  const matchTypeStats = results.reduce(
    (acc, result) => {
      acc[result.matchType] = (acc[result.matchType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
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
        {relatedSearches.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3">Try these related searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {relatedSearches.map((related, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>
          <p className="text-muted-foreground">
            Found {total} result{total !== 1 ? "s" : ""}
            {filteredResults.length !== total && ` (${filteredResults.length} shown)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "compact" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("compact")}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border rounded-lg text-sm bg-background"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Match Type Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
        <Badge
          variant={filterByType === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilterByType("all")}
        >
          All Results ({total})
        </Badge>
        {Object.entries(matchTypeStats).map(([type, count]) => (
          <Badge
            key={type}
            variant={filterByType === type ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterByType(type)}
          >
            <MatchTypeIcon type={type} className="w-3 h-3 mr-1" />
            {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
          </Badge>
        ))}
      </div>

      <Separator />

      {/* Search Results */}
      <div className={cn("space-y-6", viewMode === "compact" && "space-y-4")}>
        {filteredResults.map((result, index) => (
          <SearchResultCard
            key={`${result.post.id}-${index}`}
            result={result}
            query={query}
            compact={viewMode === "compact"}
            showSnippets={true}
          />
        ))}
      </div>

      {/* Related Searches */}
      {relatedSearches.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Related Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((related, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onRelatedSearch?.(related)}
                >
                  {related}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MatchTypeIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "title":
      return <BookOpen className={className} />
    case "category":
      return <Hash className={className} />
    case "tags":
      return <Hash className={className} />
    case "content":
      return <BookOpen className={className} />
    default:
      return <Search className={className} />
  }
}
