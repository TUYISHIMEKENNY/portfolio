"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, ReplyIcon, Send, User, Calendar, ChevronDown, ChevronUp, Shuffle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import CommentPagination from "./CommentPagination"

interface Comment {
  id: string
  postId: string
  author: string
  content: string
  timestamp: string
  replies: CommentReply[]
}

interface CommentReply {
  id: string
  author: string
  content: string
  timestamp: string
}

interface CommentSystemProps {
  postId: string
}

const COMMENTS_PER_PAGE = 10

// Generate random names for users
const generateRandomName = (): string => {
  const adjectives = [
    "Anonymous",
    "Curious",
    "Thoughtful",
    "Creative",
    "Insightful",
    "Brilliant",
    "Wise",
    "Clever",
    "Smart",
    "Keen",
    "Sharp",
    "Quick",
    "Bright",
    "Astute",
    "Savvy",
    "Witty",
    "Bold",
    "Brave",
  ]
  const nouns = [
    "Reader",
    "Visitor",
    "Developer",
    "Coder",
    "Thinker",
    "Explorer",
    "Learner",
    "Student",
    "Engineer",
    "Creator",
    "Builder",
    "Maker",
    "Designer",
    "Architect",
    "Innovator",
    "Pioneer",
    "Enthusiast",
    "Expert",
  ]

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 999) + 1

  return `${adjective}${noun}${number}`
}

// Sanitize user input
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .slice(0, 1000) // Limit length
}

export default function CommentSystem({ postId }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [useRandomName, setUseRandomName] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

   //  Added pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load comments on component mount
  useEffect(() => {
    loadComments()
  }, [postId])

  // Generate random name on component mount
  useEffect(() => {
    if (useRandomName) {
      setAuthorName(generateRandomName())
    }
  }, [useRandomName])

  //  Load comments with pagination
  const loadComments = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments/${postId}?page=${page}&limit=${COMMENTS_PER_PAGE}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
        setTotalPages(Math.ceil(data.total / COMMENTS_PER_PAGE))
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error loading comments:", error)
      toast.error("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  //  Handle page changes
  const handlePageChange = (page: number) => {
    loadComments(page)
    // Scroll to comments section
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })
  }


  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    if (!authorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: sanitizeInput(authorName),
          content: sanitizeInput(newComment),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
        setNewComment("")
        loadComments(1) // Reload first page to show new comment
        if (useRandomName) {
          setAuthorName(generateRandomName())
        }
        toast({
          title: "Success",
          description: "Comment added successfully!",
        })
      } else {
        throw new Error("Failed to submit comment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      })
      return
    }

    if (!authorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/comments/${postId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          author: sanitizeInput(authorName),
          content: sanitizeInput(replyContent),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
        setReplyContent("")
        setReplyingTo(null)
        if (useRandomName) {
          setAuthorName(generateRandomName())
        }
        toast({
          title: "Success",
          description: "Reply added successfully!",
        })
      } else {
        throw new Error("Failed to submit reply")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleCommentExpansion = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Leave a Comment</h4>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="author" className="text-sm font-medium">
                  Your Name
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUseRandomName(!useRandomName)
                    if (!useRandomName) {
                      setAuthorName(generateRandomName())
                    } else {
                      setAuthorName("")
                    }
                  }}
                  className="text-xs"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  {useRandomName ? "Use Custom Name" : "Generate Random"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={useRandomName ? "Random name generated" : "Enter your name"}
                  disabled={useRandomName}
                  maxLength={50}
                />
                {useRandomName && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setAuthorName(generateRandomName())}
                    title="Generate new random name"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Comment
              </label>
              <Textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground text-right">{newComment.length}/1000 characters</div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No comments yet</h4>
              <p className="text-muted-foreground">Be the first to share your thoughts on this post!</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="overflow-hidden">
              <CardContent className="p-6">
                {/* Comment Header */}
                <div className="flex items-start gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(comment.timestamp)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                  </div>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <ReplyIcon className="h-4 w-4 mr-1" />
                    Reply
                  </Button>

                  {comment.replies.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => toggleCommentExpansion(comment.id)}>
                      {expandedComments.has(comment.id) ? (
                        <ChevronUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      )}
                      {comment.replies.length} {comment.replies.length === 1 ? "Reply" : "Replies"}
                    </Button>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="border-l-2 border-muted pl-4 mb-4">
                    <div className="space-y-3">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                        maxLength={1000}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                          <Send className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && expandedComments.has(comment.id) && (
                  <div className="space-y-4">
                    <Separator />
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-muted pl-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{reply.author}</span>
                              <Badge variant="outline" className="text-xs">
                                {formatDate(reply.timestamp)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/*  Added pagination component */}
      <CommentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
