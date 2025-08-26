"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Hash, Clock, Sparkles, Users, ArrowRight, RefreshCw, Zap } from "lucide-react"

interface RelatedSearchWidgetProps {
  currentQuery?: string
  onSearchSelect?: (query: string) => void
  categories?: Array<{ name: string; count: number }>
  tags?: string[]
  className?: string
}

export default function RelatedSearchWidget({
  currentQuery = "",
  onSearchSelect,
  categories = [],
  tags = [],
  className = "",
}: RelatedSearchWidgetProps) {
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }

    // Fetch trending searches
    fetchTrendingSearches()
  }, [])

  const fetchTrendingSearches = async () => {
    setIsLoading(true)
    try {
      // Simulate API call for trending searches
      // In a real app, this would fetch from analytics
      const mockTrending = [
        "React hooks",
        "Next.js 14",
        "TypeScript tips",
        "CSS Grid",
        "JavaScript ES2024",
        "Web performance",
        "API design",
        "Database optimization",
      ]

      setTimeout(() => {
        setTrendingSearches(mockTrending.slice(0, 6))
        setIsLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching trending searches:", error)
      setIsLoading(false)
    }
  }

  const generateSmartSuggestions = () => {
    if (!currentQuery) return []

    const suggestions = new Set<string>()

    // Add query variations
    suggestions.add(`${currentQuery} tutorial`)
    suggestions.add(`${currentQuery} guide`)
    suggestions.add(`${currentQuery} examples`)
    suggestions.add(`${currentQuery} best practices`)
    suggestions.add(`how to ${currentQuery}`)
    suggestions.add(`${currentQuery} tips`)

    // Add category combinations
    categories.slice(0, 3).forEach((cat) => {
      suggestions.add(`${currentQuery} ${cat.name}`)
    })

    return Array.from(suggestions).slice(0, 8)
  }

  const smartSuggestions = generateSmartSuggestions()

  const handleSearchClick = (query: string) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 10)
    setRecentSearches(updated.slice(0, 5))
    localStorage.setItem("recent-searches", JSON.stringify(updated))

    onSearchSelect?.(query)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Smart Suggestions - Only show when there's a current query */}
      {currentQuery && smartSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {smartSuggestions.map((suggestion, index) => (
                <button key={index} className="search-filter-chip" onClick={() => handleSearchClick(suggestion)}>
                  <Zap className="w-3 h-3 mr-1" />
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending Searches */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trending Searches
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchTrendingSearches} disabled={isLoading} className="h-6 px-2">
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-search-suggestion-hover transition-colors text-left group"
                  onClick={() => handleSearchClick(search)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-4">#{index + 1}</span>
                    <span className="font-medium">{search}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button key={index} className="search-filter-chip" onClick={() => handleSearchClick(search)}>
                  {search}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="w-4 h-4 text-secondary" />
              Browse Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {categories.slice(0, 8).map((category, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-search-suggestion-hover transition-colors text-left group"
                  onClick={() => handleSearchClick(category.name)}
                >
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Tags */}
      {tags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag, index) => (
                <button key={index} className="search-filter-chip" onClick={() => handleSearchClick(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
