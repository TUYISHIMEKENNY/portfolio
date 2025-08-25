"use client"

import { useState, useEffect, useCallback } from "react"

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

interface SearchResponse {
  query: string
  results: SearchResult[]
  total: number
  hasMore: boolean
}

interface UseSearchOptions {
  initialQuery?: string
  limit?: number
  category?: string
  tags?: string[]
  autoSearch?: boolean
}

export function useSearch(options: UseSearchOptions = {}) {
  const [query, setQuery] = useState(options.initialQuery || "")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const search = useCallback(
    async (
      searchQuery: string,
      searchOptions: {
        limit?: number
        category?: string
        tags?: string[]
      } = {},
    ) => {
      if (!searchQuery.trim()) {
        setResults([])
        setTotal(0)
        setHasMore(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          q: searchQuery.trim(),
          limit: (searchOptions.limit || options.limit || 10).toString(),
        })

        if (searchOptions.category || options.category) {
          params.append("category", searchOptions.category || options.category!)
        }

        if (searchOptions.tags || options.tags) {
          const tags = searchOptions.tags || options.tags!
          params.append("tags", tags.join(","))
        }

        const response = await fetch(`/api/search?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`)
        }

        const data: SearchResponse = await response.json()

        setResults(data.results)
        setTotal(data.total)
        setHasMore(data.hasMore)
        setQuery(searchQuery)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Search failed"
        setError(errorMessage)
        console.error("Search error:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [options.limit, options.category, options.tags],
  )

  useEffect(() => {
    if (options.autoSearch && query) {
      const timeoutId = setTimeout(() => {
        search(query)
      }, 300) // Debounce

      return () => clearTimeout(timeoutId)
    }
  }, [query, search, options.autoSearch])

  const getRelatedSearches = useCallback(async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search?type=related&q=${encodeURIComponent(searchQuery)}&limit=5`)

      if (!response.ok) {
        throw new Error("Failed to fetch related searches")
      }

      const data = await response.json()
      return data.related || []
    } catch (err) {
      console.error("Error fetching related searches:", err)
      return []
    }
  }, [])

  const clearSearch = useCallback(() => {
    setQuery("")
    setResults([])
    setTotal(0)
    setHasMore(false)
    setError(null)
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    total,
    hasMore,
    search,
    getRelatedSearches,
    clearSearch,
  }
}
