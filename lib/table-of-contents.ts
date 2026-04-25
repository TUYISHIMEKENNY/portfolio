import { marked } from "marked"
import { JSDOM } from "jsdom"

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

/**
 * Converts Markdown or raw HTML to HTML and extracts the table of contents.
 */
export function extractTableOfContents(content: string, isMarkdown = true): TableOfContentsItem[] {
  const html = isMarkdown ? (marked.parse(content) as string) : content
  return parseHtmlForToc(html)
}

/**
 * Parses HTML and extracts headings for table of contents (server or client).
 */
function parseHtmlForToc(htmlContent: string): TableOfContentsItem[] {
  const toc: TableOfContentsItem[] = []
  const usedIds = new Set<string>()

  if (typeof window === "undefined") {
    // Server-side using jsdom
    const dom = new JSDOM(htmlContent)
    const document = dom.window.document
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

    headings.forEach((node) => {
      const heading = node as HTMLElement
      const level = Number.parseInt(heading.tagName.charAt(1))
      const text = heading.textContent?.trim() || ""
      const id = generateUniqueHeadingId(text, usedIds)
      heading.id = heading.id || id

      toc.push({ id: heading.id, text, level })
    })
  } else {
    // Client-side
    const div = document.createElement("div")
    div.innerHTML = htmlContent
    const headings = div.querySelectorAll("h1, h2, h3, h4, h5, h6")

    headings.forEach((node) => {
      const heading = node as HTMLElement
      const level = Number.parseInt(heading.tagName.charAt(1))
      const text = heading.textContent?.trim() || ""
      const id = generateUniqueHeadingId(text, usedIds)
      heading.id = heading.id || id

      toc.push({ id: heading.id, text, level })
    })
  }

  return toc
}

/**
 * Generates an ID from a heading's text.
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens
    .trim()
}

/**
 * Generates a unique ID from a heading's text, ensuring no duplicates.
 */
function generateUniqueHeadingId(text: string, usedIds: Set<string>): string {
  const baseId = generateHeadingId(text)
  let uniqueId = baseId
  let counter = 1

  // If the ID is already used, append a counter
  while (usedIds.has(uniqueId)) {
    uniqueId = `${baseId}-${counter}`
    counter++
  }

  usedIds.add(uniqueId)
  return uniqueId
}

/**
 * Adds IDs to all headings in a given Markdown or HTML string.
 */
export function addIdsToHeadings(content: string, isMarkdown = true): string {
  const html = isMarkdown ? (marked.parse(content) as string) : content
  const usedIds = new Set<string>()

  const dom = new JSDOM(html)
  const document = dom.window.document
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

  headings.forEach((node) => {
    const heading = node as HTMLElement
    const text = heading.textContent?.trim() || ""
    const id = generateUniqueHeadingId(text, usedIds)
    if (!heading.id) {
      heading.id = id
    }
  })

  return dom.serialize()
}
