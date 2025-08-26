import fs from "fs"
import path from "path"
import { getAllItems } from "@/lib/file-storage"

export interface SearchIndex {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  date: string
  slug: string
  wordCount: number
  keywords: string[]
  headings: Array<{
    level: number
    text: string
    id: string
  }>
}

export interface SearchResult {
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
  similarityReasons?: string[]
  searchType?: "exact_title_match" | "title_match" | "heading_match" | "content_match" | "general_match"
  relevanceScore?: number
  readingTime?: number
}

const SEARCH_INDEX_PATH = path.join(process.cwd(), "uploads", "search-index.json")

export async function buildSearchIndex(): Promise<void> {
  try {
    const posts = await getAllItems("blog")
    const searchIndex: SearchIndex[] = []

    for (const post of posts) {
      // Extract headings from markdown content
      const headings = extractHeadings(post.content || "")

      // Extract keywords from content
      const keywords = extractKeywords(post.content || "", post.title || "")

      // Calculate word count
      const wordCount = (post.content || "").split(/\s+/).length

      const indexEntry: SearchIndex = {
        id: post.id,
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        category: post.category || "",
        tags: post.tags || [],
        author: post.author || "Ngoma Benjamin",
        date: post.date || post.createdAt || "",
        slug: post.slug || post.id,
        wordCount,
        keywords,
        headings,
      }

      searchIndex.push(indexEntry)
    }

    // Ensure directory exists
    const indexDir = path.dirname(SEARCH_INDEX_PATH)
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true })
    }

    // Save search index
    await fs.promises.writeFile(SEARCH_INDEX_PATH, JSON.stringify(searchIndex, null, 2))

    console.log(`Search index built with ${searchIndex.length} posts`)
  } catch (error) {
    console.error("Error building search index:", error)
    throw error
  }
}

function extractHeadings(content: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Array<{ level: number; text: string; id: string }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    headings.push({ level, text, id })
  }

  return headings
}

function extractKeywords(content: string, title: string): string[] {
  const text = `${title} ${content}`.toLowerCase()

  // Remove markdown syntax and HTML tags
  const cleanText = text
    .replace(/[#*_`[\]()]/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Split into words and filter
  const words = cleanText.split(/\s+/)
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
  ])

  const keywords = words
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .slice(0, 50) // Limit to top 50 keywords

  return keywords
}

export async function searchPosts(
  query: string,
  options: {
    limit?: number
    category?: string
    tags?: string[]
  } = {},
): Promise<SearchResult[]> {
  try {
    const searchIndex = await getSearchIndex()
    const results: SearchResult[] = []
    const queryLower = query.toLowerCase().trim()

    if (!queryLower) return []

    for (const indexEntry of searchIndex) {
      let score = 0
      let matchType: SearchResult["matchType"] = "content"
      const snippets: SearchResult["snippets"] = []
      const matchedHeadings: SearchResult["matchedHeadings"] = []

      const titleLower = indexEntry.title.toLowerCase()
      if (titleLower === queryLower) {
        score += 200 // Exact title match gets highest priority
        matchType = "title"
      } else if (titleLower.includes(queryLower)) {
        score += 100
        matchType = "title"
      }

      if (indexEntry.category.toLowerCase().includes(queryLower)) {
        score += 50
        matchType = "category"
      }

      const tagMatch = indexEntry.tags.some((tag) => tag.toLowerCase().includes(queryLower))
      if (tagMatch) {
        score += 40
        matchType = "tags"
      }

      const contentSnippets = extractEnhancedSnippets(indexEntry.content, queryLower)
      if (contentSnippets.length > 0) {
        score += contentSnippets.length * 10
        snippets.push(...contentSnippets)
      }

      const headingMatches = indexEntry.headings.filter((heading) => heading.text.toLowerCase().includes(queryLower))
      if (headingMatches.length > 0) {
        score += headingMatches.length * 30
        matchedHeadings.push(...headingMatches)
      }

      const keywordMatch = indexEntry.keywords.some((keyword) => keyword.includes(queryLower))
      if (keywordMatch) {
        score += 20
      }

      if (options.category && indexEntry.category !== options.category) {
        continue
      }

      if (options.tags && options.tags.length > 0) {
        const hasMatchingTag = options.tags.some((tag) => indexEntry.tags.includes(tag))
        if (!hasMatchingTag) continue
      }

      if (score > 0) {
        const post = await getPostFromIndex(indexEntry.id)
        if (post) {
          const readingTime = Math.ceil(indexEntry.wordCount / 200) // Average reading speed
          const relevanceScore = Math.min((score / 200) * 100, 100) // Normalize to 0-100

          results.push({
            post,
            score,
            matchType,
            snippets: snippets.slice(0, 3), // Limit snippets
            matchedHeadings,
            readingTime,
            relevanceScore,
          })
        }
      }
    }

    results.sort((a, b) => b.score - a.score)

    if (options.limit) {
      return results.slice(0, options.limit)
    }

    return results
  } catch (error) {
    console.error("Error searching posts:", error)
    return []
  }
}

function extractEnhancedSnippets(
  content: string,
  query: string,
): Array<{
  text: string
  highlighted: string
  context: string
}> {
  const snippets: Array<{ text: string; highlighted: string; context: string }> = []

  const paragraphs = content.split(/\n\s*\n/)
  const queryRegex = new RegExp(`(${escapeRegex(query)})`, "gi")

  for (const paragraph of paragraphs) {
    if (paragraph.toLowerCase().includes(query)) {
      const sentences = paragraph.split(/[.!?]+/)

      for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(query)) {
          const trimmed = sentence.trim()
          if (trimmed.length > 20) {
            const highlighted = trimmed.replace(queryRegex, "<mark>$1</mark>")

            const sentenceIndex = sentences.indexOf(sentence)
            const contextStart = Math.max(0, sentenceIndex - 1)
            const contextEnd = Math.min(sentences.length - 1, sentenceIndex + 1)
            const context = sentences
              .slice(contextStart, contextEnd + 1)
              .join(". ")
              .trim()

            const finalContext = context.length > 300 ? context.substring(0, 300) + "..." : context

            snippets.push({
              text: trimmed,
              highlighted,
              context: finalContext,
            })
          }
        }
      }
    }
  }

  return snippets.slice(0, 5)
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function getSearchIndex(): Promise<SearchIndex[]> {
  try {
    if (!fs.existsSync(SEARCH_INDEX_PATH)) {
      await buildSearchIndex()
    }

    const indexContent = await fs.promises.readFile(SEARCH_INDEX_PATH, "utf-8")
    return JSON.parse(indexContent)
  } catch (error) {
    console.error("Error reading search index:", error)
    return []
  }
}

async function getPostFromIndex(id: string): Promise<any | null> {
  try {
    const { getItemById } = await import("@/lib/file-storage")
    return await getItemById("blog", id)
  } catch (error) {
    console.error("Error getting post from index:", error)
    return null
  }
}

export async function getSearchSuggestions(query: string, limit = 5): Promise<string[]> {
  try {
    const searchIndex = await getSearchIndex()
    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()

    if (queryLower.length < 2) return []

    for (const entry of searchIndex) {
      if (entry.title.toLowerCase().includes(queryLower)) {
        suggestions.add(entry.title)
      }

      if (entry.category.toLowerCase().includes(queryLower)) {
        suggestions.add(entry.category)
      }

      entry.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag)
        }
      })

      entry.keywords.forEach((keyword) => {
        if (keyword.includes(queryLower) && keyword.length > queryLower.length) {
          suggestions.add(keyword)
        }
      })
    }

    return Array.from(suggestions).slice(0, limit)
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return []
  }
}

export async function getRelatedSearches(query: string, limit = 8): Promise<string[]> {
  try {
    const results = await searchPosts(query, { limit: 5 })
    const relatedTerms = new Set<string>()

    for (const result of results) {
      if (result.post.category) {
        relatedTerms.add(result.post.category)
      }

      if (result.post.tags) {
        result.post.tags.forEach((tag: string) => relatedTerms.add(tag))
      }

      if (result.score > 50 && result.post.keywords) {
        result.post.keywords.slice(0, 3).forEach((keyword: string) => {
          if (keyword.length > 3 && !keyword.includes(query.toLowerCase())) {
            relatedTerms.add(keyword)
          }
        })
      }
    }

    const semanticVariations = generateSemanticVariations(query)
    semanticVariations.forEach((variation) => relatedTerms.add(variation))

    relatedTerms.delete(query)
    relatedTerms.delete(query.toLowerCase())

    return Array.from(relatedTerms).slice(0, limit)
  } catch (error) {
    console.error("Error getting related searches:", error)
    return []
  }
}

export async function getIntelligentSuggestions(
  query: string,
  context: {
    recentSearches?: string[]
    currentCategory?: string
    userPreferences?: string[]
  } = {},
  limit = 8,
): Promise<Array<{ text: string; type: string; score: number; reason: string }>> {
  try {
    const searchIndex = await getSearchIndex()
    const suggestions = new Map<string, { type: string; score: number; reason: string }>()
    const queryLower = query.toLowerCase()

    if (queryLower.length < 2) return []

    const categoryBoost = context.currentCategory ? 20 : 0
    const recentBoost = 15
    const preferenceBoost = 10

    for (const entry of searchIndex) {
      if (entry.title.toLowerCase().includes(queryLower)) {
        let score = 30
        if (context.currentCategory === entry.category) score += categoryBoost
        if (context.recentSearches?.some((recent) => recent.toLowerCase().includes(entry.title.toLowerCase()))) {
          score += recentBoost
        }
        suggestions.set(entry.title, {
          type: "title",
          score,
          reason: "Matches article title",
        })
      }

      if (entry.category.toLowerCase().includes(queryLower)) {
        let score = 25
        if (context.currentCategory === entry.category) score += categoryBoost
        suggestions.set(entry.category, {
          type: "category",
          score,
          reason: "Article category",
        })
      }

      entry.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          let score = 20
          if (context.userPreferences?.includes(tag)) score += preferenceBoost
          suggestions.set(tag, {
            type: "tag",
            score,
            reason: "Popular tag",
          })
        }
      })

      entry.keywords.forEach((keyword) => {
        if (keyword.includes(queryLower) && keyword.length > queryLower.length) {
          const score = 15 + (keyword.length - queryLower.length) * 2
          suggestions.set(keyword, {
            type: "keyword",
            score,
            reason: "Related topic",
          })
        }
      })
    }

    const sortedSuggestions = Array.from(suggestions.entries())
      .map(([text, data]) => ({ text, ...data }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return sortedSuggestions
  } catch (error) {
    console.error("Error getting intelligent suggestions:", error)
    return []
  }
}

export async function getTrendingSearches(
  limit = 5,
): Promise<Array<{ query: string; count: number; category?: string }>> {
  try {
    const searchIndex = await getSearchIndex()
    const trending = new Map<string, { count: number; category?: string }>()

    const categoryCount = new Map<string, number>()
    const tagCount = new Map<string, number>()

    searchIndex.forEach((post) => {
      if (post.category) {
        categoryCount.set(post.category, (categoryCount.get(post.category) || 0) + 1)
      }
      post.tags.forEach((tag) => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      })
    })

    Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([category, count]) => {
        trending.set(category, { count, category })
      })

    Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit - 3)
      .forEach(([tag, count]) => {
        trending.set(tag, { count })
      })

    return Array.from(trending.entries())
      .map(([query, data]) => ({ query, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  } catch (error) {
    console.error("Error getting trending searches:", error)
    return []
  }
}

export async function getSimilarPosts(postId: string, limit = 5): Promise<SearchResult[]> {
  try {
    const searchIndex = await getSearchIndex()
    const targetPost = searchIndex.find((post) => post.id === postId)

    if (!targetPost) return []

    const similarities: Array<{ postId: string; score: number; reasons: string[] }> = []

    for (const post of searchIndex) {
      if (post.id === postId) continue

      let score = 0
      const reasons: string[] = []

      if (post.category === targetPost.category) {
        score += 40
        reasons.push(`Same category: ${post.category}`)
      }

      const commonTags = post.tags.filter((tag) => targetPost.tags.includes(tag))
      if (commonTags.length > 0) {
        score += commonTags.length * 15
        reasons.push(`Common tags: ${commonTags.join(", ")}`)
      }

      const commonKeywords = post.keywords.filter((keyword) => targetPost.keywords.includes(keyword))
      if (commonKeywords.length > 0) {
        score += Math.min(commonKeywords.length * 5, 25)
        reasons.push(`Similar topics`)
      }

      const titleSimilarity = calculateTextSimilarity(post.title, targetPost.title)
      if (titleSimilarity > 0.3) {
        score += titleSimilarity * 20
        reasons.push(`Similar title`)
      }

      const lengthRatio =
        Math.min(post.wordCount, targetPost.wordCount) / Math.max(post.wordCount, targetPost.wordCount)
      if (lengthRatio > 0.5) {
        score += lengthRatio * 10
        reasons.push(`Similar length`)
      }

      if (score > 0) {
        similarities.push({ postId: post.id, score, reasons })
      }
    }

    similarities.sort((a, b) => b.score - a.score)
    const topSimilar = similarities.slice(0, limit)

    const results: SearchResult[] = []
    for (const similar of topSimilar) {
      const post = await getPostFromIndex(similar.postId)
      if (post) {
        results.push({
          post,
          score: similar.score,
          matchType: "content",
          snippets: [],
          matchedHeadings: [],
          similarityReasons: similar.reasons,
        })
      }
    }

    return results
  } catch (error) {
    console.error("Error getting similar posts:", error)
    return []
  }
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)

  const intersection = words1.filter((word) => words2.includes(word))
  const union = [...new Set([...words1, ...words2])]

  return intersection.length / union.length
}

function generateSemanticVariations(query: string): string[] {
  const variations: string[] = []
  const queryLower = query.toLowerCase()

  const synonyms: Record<string, string[]> = {
    javascript: ["js", "ecmascript", "node"],
    react: ["reactjs", "react.js"],
    css: ["styling", "styles", "stylesheet"],
    html: ["markup", "dom"],
    api: ["endpoint", "service", "rest"],
    database: ["db", "data", "storage"],
    frontend: ["client-side", "ui", "interface"],
    backend: ["server-side", "api", "service"],
    tutorial: ["guide", "how-to", "walkthrough"],
    beginner: ["intro", "basics", "fundamentals"],
    advanced: ["expert", "pro", "deep-dive"],
  }

  Object.entries(synonyms).forEach(([key, values]) => {
    if (queryLower.includes(key)) {
      values.forEach((synonym) => {
        variations.push(queryLower.replace(key, synonym))
      })
    }
    if (values.some((value) => queryLower.includes(value))) {
      variations.push(queryLower.replace(values.find((v) => queryLower.includes(v))!, key))
    }
  })

  if (!queryLower.includes("tutorial") && !queryLower.includes("guide")) {
    variations.push(`${query} tutorial`)
    variations.push(`${query} guide`)
  }

  return variations.filter((v) => v !== queryLower).slice(0, 3)
}
