import { type NextRequest, NextResponse } from "next/server"
import { searchPosts, getSearchSuggestions, getRelatedSearches, getIntelligentSuggestions, buildSearchIndex } from "@/lib/search-index"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "search" // search, suggestions, related, intelligent
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || ""
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || []

    switch (type) {
      case "suggestions":
        const suggestions = await getSearchSuggestions(query, limit)
        return NextResponse.json({ suggestions })

      case "related":
        const related = await getRelatedSearches(query, limit)
        return NextResponse.json({ related })

      case "intelligent":
        const recentSearches = searchParams.get("recent")?.split(",").filter(Boolean) || []
        const currentCategory = searchParams.get("currentCategory") || ""
        const userPreferences = searchParams.get("preferences")?.split(",").filter(Boolean) || []

        const intelligentSuggestions = await getIntelligentSuggestions(
          query,
          {
            recentSearches,
            currentCategory,
            userPreferences,
          },
          limit,
        )
        return NextResponse.json({ suggestions: intelligentSuggestions })

      case "search":
      default:
        const results = await searchPosts(query, {
          limit,
          category: category || undefined,
          tags: tags.length > 0 ? tags : undefined,
        })

        return NextResponse.json({
          query,
          results,
          total: results.length,
          hasMore: false, // Could implement pagination here
        })
    }
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Search failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await buildSearchIndex()
    return NextResponse.json({ success: true, message: "Search index rebuilt successfully" })
  } catch (error) {
    console.error("Error rebuilding search index:", error)
    return NextResponse.json({ error: "Failed to rebuild search index" }, { status: 500 })
  }
}
