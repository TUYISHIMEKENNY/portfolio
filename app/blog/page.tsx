import type { Metadata } from "next"
import BlogClientPage from "./BlogClientPage"

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string }
}): Promise<Metadata> {
  const searchQuery = searchParams?.q || ""
  const category = searchParams?.category || ""

  const baseTitle = "Blog | Ngoma Benjamin - Web Development & Programming Insights"
  const baseDescription =
    "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc. Stay updated with the latest trends and best practices."

  let title = baseTitle
  let description = baseDescription
  let canonical = "https://ngomabenjamin.com/blog"

  if (searchQuery) {
    title = `Search Results for "${searchQuery}" | Ngoma Benjamin Blog`
    description = `Find articles and tutorials about ${searchQuery} on Ngoma Benjamin's blog. Expert insights on web development, programming, and technology.`
    canonical = `https://ngomabenjamin.com/blog?q=${encodeURIComponent(searchQuery)}`
  } else if (category) {
    title = `${category} Articles | Ngoma Benjamin Blog`
    description = `Browse ${category} articles and tutorials by Ngoma Benjamin. Expert insights on web development, programming, and technology.`
    canonical = `https://ngomabenjamin.com/blog?category=${encodeURIComponent(category)}`
  }

  return {
    title,
    description,
    keywords: [
      "TUYISHIME KENNY ARAFAT blog",
      "KENNYDEV articles",
      "KENNYDEV blog",
      "web development tutorials",
      "programming insights",
      "javascript tutorials",
      "react development",
      "next.js guides",
      "full stack development",
      "software engineering",
      "tech insights",
      "coding best practices",
      ...(searchQuery ? [searchQuery, `${searchQuery} tutorial`, `${searchQuery} guide`] : []),
      ...(category ? [category, `${category} tutorials`, `${category} articles`] : []),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "TUYISHIME KENNY ARAFAT",
      images: [
        {
          url: "https://TUYISHIMEKENNYARAFAT.com/og-blog.jpg",
          width: 1200,
          height: 630,
          alt: "TUYISHIME KENNY ARAFAT - Web Development Insights",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://TUYISHIMEKENNYARAFAT.com/og-blog.jpg"],
      creator: "KENNYDEV",
      site: "KENNYDEV",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      types: {
        "application/rss+xml": [
          {
            url: "https://TUYISHIMEKENNYARAFAT.com/blog/rss.xml",
            title: "TUYISHIME KENNY ARAFAT Blog RSS Feed",
          },
        ],
      },
    },
    other: {
      "article:author": "TUYISHIME KENNY ARAFAT",
      "article:publisher": "https://TUYISHIMEKENNYARAFAT.com",
    },
  }
}

interface BlogPageProps {
  searchParams?: {
    q?: string
    page?: string
    category?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  return <BlogClientPage searchParams={searchParams} />
}
