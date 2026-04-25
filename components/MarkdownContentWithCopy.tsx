"use client"

import type React from "react"
import { useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { marked } from "marked"

interface MarkdownContentWithCopyProps {
  htmlContent?: string
  rawMarkdown?: string
  content?: string
}

const MarkdownContentWithCopy: React.FC<MarkdownContentWithCopyProps> = ({ htmlContent, rawMarkdown, content }) => {
  const { toast } = useToast()

  const processedHtml = (htmlContent || (content ? marked.parse(content) : "")) as string
  const markdownSource = rawMarkdown || content || ""

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdownSource)
      toast({
        title: "Copied!",
        description: "Markdown content copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy content to clipboard",
        variant: "destructive",
      })
    }
  }, [markdownSource, toast])

  useEffect(() => {
    const handleCodeCopy = async (event: Event) => {
      const target = event.target as HTMLElement
      const button = target.closest(".markdown-copy-button") as HTMLButtonElement

      if (!button) return

      const codeData = button.getAttribute("data-code")
      if (!codeData) return

      try {
        const decodedCode = decodeURIComponent(codeData)
        await navigator.clipboard.writeText(decodedCode)

        // Visual feedback
        const originalContent = button.innerHTML
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Copied!
        `
        button.classList.add("copied")

        setTimeout(() => {
          button.innerHTML = originalContent
          button.classList.remove("copied")
        }, 2000)

        toast({
          title: "Copied!",
          description: "Code copied to clipboard",
        })
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Unable to copy code to clipboard",
          variant: "destructive",
        })
      }
    }

    // Add event listeners to all copy buttons
    document.addEventListener("click", handleCodeCopy)

    return () => {
      document.removeEventListener("click", handleCodeCopy)
    }
  }, [toast, processedHtml])

  return (
    <article className="max-w-none">
      {/* Button above markdown */}
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2 bg-transparent">
          <Copy className="w-4 h-4" />
          Copy Article
        </Button>
      </div>

      {/* Rendered Markdown */}
      <div
        className="markdown-content prose prose-base max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted prose-pre:p-4 prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal prose-li:mt-2 prose-table:w-full prose-th:border prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-td:border prose-td:px-4 prose-td:py-2 prose-td:text-left prose-img:rounded-md prose-img:border"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </article>
  )
}

export default MarkdownContentWithCopy
export { MarkdownContentWithCopy }
