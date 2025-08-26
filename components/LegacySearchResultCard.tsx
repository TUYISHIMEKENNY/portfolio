"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, ExternalLink, Hash, BookOpen } from "lucide-react"
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

interface LegacySearchResultCardProps {
  result: SearchResult
  query: string
  compact?: boolean
  showSnippets?: boolean
}

export default function LegacySearchResultCard({
  result,
  query,
  compact = false,
  showSnippets = true,
}: LegacySearchResultCardProps) {
  const { post, matchType, snippets, matchedHeadings, score } = result

  const highlightedTitle = highlightText(post.title || "", query)

  const bestSnippet = snippets.length > 0 ? snippets[0] : null
  const displayExcerpt = bestSnippet?.highlighted || post.excerpt || ""

  const getMatchTypeInfo = (type: string) => {
    switch (type) {
      case "title":
        return {
          label: "Title Match",
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          icon: BookOpen,
        }
      case "category":
        return {
          label: "Category Match",
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          icon: Hash,
        }
      case "tags":
        return {
          label: "Tag Match",
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
          icon: Hash,
        }
      case "content":
        return {
          label: "Content Match",
          color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
          icon: BookOpen,
        }
      default:
        return {
          label: "Match",
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          icon: BookOpen,
        }
    }
  }

  const matchInfo = getMatchTypeInfo(matchType)
  const MatchIcon = matchInfo.icon

  if (compact) {
    return (
      <Card className="search-result-card">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={
                  post.imagePath ||
                  post.image ||
                  "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt={post.title}
                fill
                className="object-cover"
                unoptimized={post.imagePath?.startsWith("/uploads/")}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm line-clamp-2">
                  <Link
                    href={`/blog/${post.id || post.slug}`}
                    className="search-result-title"
                    dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                  />
                </h3>
                <Badge variant="outline" className={cn("text-xs flex-shrink-0", matchInfo.color)}>
                  <MatchIcon className="w-3 h-3 mr-1" />
                  {matchInfo.label}
                </Badge>
              </div>

              {showSnippets && bestSnippet && (
                <div
                  className="search-result-snippet text-xs line-clamp-2 mb-2"
                  dangerouslySetInnerHTML={{ __html: bestSnippet.highlighted }}
                />
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.author || "Ngoma Benjamin"}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="search-result-card border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-xs", matchInfo.color)}>
                <MatchIcon className="w-3 h-3 mr-1" />
                {matchInfo.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Score: {score}
              </Badge>
            </div>

            <h2 className="text-xl font-bold mb-2 line-clamp-2">
              <Link
                href={`/blog/${post.id || post.slug}`}
                className="search-result-title"
                dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              />
            </h2>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{post.author || "Ngoma Benjamin"}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime || "5 min read"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{post.category}</Badge>
              {post.tags?.slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={
                post.imagePath ||
                post.image ||
                "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=128&h=96&fit=crop" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={post.imagePath?.startsWith("/uploads/")}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content Snippets */}
        {showSnippets && snippets.length > 0 && (
          <div className="space-y-3 mb-4">
            {snippets.slice(0, 2).map((snippet, index) => (
              <div key={index} className="border-l-2 border-accent pl-4 bg-muted/30 rounded-r-lg py-2">
                <div
                  className="search-result-snippet text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: snippet.highlighted }}
                />
                {snippet.context !== snippet.text && (
                  <div className="text-xs text-muted-foreground mt-1 italic">...{snippet.context}...</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Matched Headings */}
        {matchedHeadings.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Relevant Sections:</h4>
            <div className="space-y-1">
              {matchedHeadings.slice(0, 3).map((heading, index) => (
                <Link
                  key={index}
                  href={`/blog/${post.id || post.slug}#${heading.id}`}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors p-2 rounded-lg hover:bg-primary/5"
                >
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">H{heading.level}</span>
                  <span
                    className="flex-1"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(heading.text, query),
                    }}
                  />
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {snippets.length > 2 && (
              <span className="text-xs text-muted-foreground">+{snippets.length - 2} more matches</span>
            )}
          </div>

          <Button asChild size="sm" className="ml-auto">
            <Link href={`/blog/${post.id || post.slug}`}>
              Read Full Article
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
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
