import type { Metadata } from "next"
import BlogClientPage from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Blog | Ngoma Benjamin - Web Development & Programming Insights",
  description:
    "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc. Stay updated with the latest trends and best practices.",
  keywords: [
    "ngoma benjamin blog",
    "ngoma301 articles",
    "301Inc blog",
    "web development tutorials",
    "programming insights",
    "javascript tutorials",
    "react development",
    "next.js guides",
    "full stack development",
    "software engineering",
    "tech insights",
    "coding best practices",
  ],
  openGraph: {
    title: "Blog | Ngoma Benjamin - Web Development & Programming Insights",
    description:
      "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
    type: "website",
    url: "https://ngomabenjamin.com/blog",
    siteName: "Ngoma Benjamin",
    images: [
      {
        url: "https://ngomabenjamin.com/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Ngoma Benjamin Blog - Web Development Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Ngoma Benjamin - Web Development & Programming Insights",
    description:
      "Expert articles, tutorials, and insights on web development, programming, and technology by Ngoma Benjamin, founder of 301Inc.",
    images: ["https://ngomabenjamin.com/og-blog.jpg"],
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
    canonical: "https://ngomabenjamin.com/blog",
  },
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
