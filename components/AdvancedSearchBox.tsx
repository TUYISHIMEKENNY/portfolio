"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, Clock, TrendingUp, Hash, BookOpen, Loader2, ArrowRight, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchSuggestion {
  text: string
  type: "recent" | "popular" | "category" | "tag" | "title"
  count?: number
}

interface SearchResult {
  post: any
  score: number
  matchType: "title" | "content" | "category" | "tags"
  snippets: Array<{
    text: string
    highlighted: string
    context: string
  }>
}

export default function AdvancedSearchBox({
  initialQuery = "",
  onSearch,
  placeholder = "Search articles, topics, or categories...",
  showQuickResults = true,
}: {
  initialQuery?: string
  onSearch?: (query: string) => void
  placeholder?: string
  showQuickResults?: boolean
}) {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [quickResults, setQuickResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }
  }, [])

  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    setQuery(urlQuery)
  }, [searchParams])

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        setQuickResults([])
        return
      }

      setIsLoading(true)

      try {
        // Fetch suggestions
        const suggestionsResponse = await fetch(
          `/api/search?type=suggestions&q=${encodeURIComponent(searchQuery)}&limit=5`,
        )
        const suggestionsData = await suggestionsResponse.json()

        // Fetch quick results for instant preview
        const resultsResponse = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=3`)
        const resultsData = await resultsResponse.json()

        // Format suggestions with types
        const formattedSuggestions: SearchSuggestion[] = [
          // Recent searches that match
          ...recentSearches
            .filter((recent) => recent.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 2)
            .map((text) => ({ text, type: "recent" as const })),

          // API suggestions
          ...suggestionsData.suggestions.map((text: string) => ({
            text,
            type: determineSearchType(text, resultsData.results),
          })),
        ]

        setSuggestions(formattedSuggestions.slice(0, 8))
        setQuickResults(resultsData.results || [])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setQuickResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [recentSearches],
  )

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query.trim())
      } else {
        setSuggestions([])
        setQuickResults([])
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, fetchSuggestions])

  const executeSearch = useCallback(
    (searchQuery: string) => {
      const trimmedQuery = searchQuery.trim()
      if (!trimmedQuery) return

      // Save to recent searches
      const updatedRecent = [trimmedQuery, ...recentSearches.filter((item) => item !== trimmedQuery)].slice(0, 10)

      setRecentSearches(updatedRecent)
      localStorage.setItem("recent-searches", JSON.stringify(updatedRecent))

      // Hide suggestions
      setShowSuggestions(false)
      setSelectedIndex(-1)

      // Execute search
      if (onSearch) {
        onSearch(trimmedQuery)
      } else {
        router.push(`/blog?q=${encodeURIComponent(trimmedQuery)}`)
      }
    },
    [recentSearches, onSearch, router],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    const totalItems = suggestions.length + quickResults.length

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % totalItems)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            const suggestion = suggestions[selectedIndex]
            setQuery(suggestion.text)
            executeSearch(suggestion.text)
          } else {
            const resultIndex = selectedIndex - suggestions.length
            const result = quickResults[resultIndex]
            if (result) {
              router.push(`/blog/${result.post.id || result.post.slug}`)
            }
          }
        } else {
          executeSearch(query)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    setShowSuggestions(false)
    setSuggestions([])
    setQuickResults([])
    if (onSearch) {
      onSearch("")
    } else {
      router.push("/blog")
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            className="pl-10 pr-12 h-12 text-base border-2 focus:border-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {query && (
              <button type="button" onClick={clearSearch} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {showSuggestions &&
        (suggestions.length > 0 || (showQuickResults && quickResults.length > 0) || recentSearches.length > 0) && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden shadow-lg border-2">
            <CardContent className="p-0">
              <div ref={suggestionsRef} className="max-h-96 overflow-y-auto">
                {/* Recent Searches */}
                {query.length === 0 && recentSearches.length > 0 && (
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <History className="h-4 w-4" />
                        Recent Searches
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-xs h-6 px-2">
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 5).map((recent, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setQuery(recent)
                            executeSearch(recent)
                          }}
                        >
                          {recent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Suggestions */}
                {suggestions.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Suggestions</div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors",
                          selectedIndex === index && "bg-muted",
                        )}
                        onClick={() => {
                          setQuery(suggestion.text)
                          executeSearch(suggestion.text)
                        }}
                      >
                        <SuggestionIcon type={suggestion.type} />
                        <span className="flex-1">{suggestion.text}</span>
                        {suggestion.count && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.count}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Results Preview */}
                {showQuickResults && quickResults.length > 0 && (
                  <div className="border-t">
                    <div className="text-xs font-medium text-muted-foreground mb-2 px-4 pt-3">Quick Results</div>
                    {quickResults.map((result, index) => {
                      const resultIndex = suggestions.length + index
                      return (
                        <button
                          key={result.post.id}
                          className={cn(
                            "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0",
                            selectedIndex === resultIndex && "bg-muted",
                          )}
                          onClick={() => {
                            router.push(`/blog/${result.post.id || result.post.slug}`)
                          }}
                        >
                          <BookOpen className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm line-clamp-1">{result.post.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {result.snippets[0]?.context || result.post.excerpt}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {result.post.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{result.matchType} match</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}

function SuggestionIcon({ type }: { type: SearchSuggestion["type"] }) {
  switch (type) {
    case "recent":
      return <Clock className="h-4 w-4 text-muted-foreground" />
    case "popular":
      return <TrendingUp className="h-4 w-4 text-muted-foreground" />
    case "category":
      return <BookOpen className="h-4 w-4 text-muted-foreground" />
    case "tag":
      return <Hash className="h-4 w-4 text-muted-foreground" />
    case "title":
      return <Search className="h-4 w-4 text-muted-foreground" />
    default:
      return <Search className="h-4 w-4 text-muted-foreground" />
  }
}

function determineSearchType(text: string, results: SearchResult[]): SearchSuggestion["type"] {
  // Check if it's a category
  const isCategory = results.some((result) => result.post.category?.toLowerCase() === text.toLowerCase())
  if (isCategory) return "category"

  // Check if it's a tag
  const isTag = results.some((result) =>
    result.post.tags?.some((tag: string) => tag.toLowerCase() === text.toLowerCase()),
  )
  if (isTag) return "tag"

  // Check if it's a title
  const isTitle = results.some((result) => result.post.title?.toLowerCase().includes(text.toLowerCase()))
  if (isTitle) return "title"

  return "popular"
}
