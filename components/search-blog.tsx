"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export default function SearchBlog({ initialQuery = "" }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Update search query when URL changes
    const query = searchParams.get("q") || ""
    setSearchQuery(query)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()

    // Update URL with search query
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/blog")
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    router.push("/blog")
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search blog posts..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit" className="sr-only">
        Search
      </Button>
    </form>
  )
}
