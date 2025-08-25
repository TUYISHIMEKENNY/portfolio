import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Ngoma Benjamin | Full-Stack Developer",
    template: "%s | Ngoma Benjamin",
  },
  description: "Full-stack developer and founder of 301Inc with a passion for web technologies.",
  keywords: [
    "Ngoma Benjamin",
    "ngoma301",
    "301LLc",
    "kwangoma",
    "301",
    "301 pictures presents",
    "web developer",
    "full-stack developer",
    "React developer",
    "Next.js developer",
  ],
  authors: [
    {
      name: "Ngoma Benjamin",
      url: "https://ngomabenjamin.com",
    },
  ],
  creator: "Ngoma Benjamin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ngomabenjamin.com",
    title: "Ngoma Benjamin | Full-Stack Developer",
    description: "Full-stack web developer and founder of 301Inc with a passion for web technologies.",
    siteName: "Ngoma Benjamin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngoma Benjamin | Full-Stack Developer",
    description: "Full-stack developer and founder of 301Inc with a passion for web technologies.",
    creator: "@ngoma301",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: '301Inc'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
