import type { Metadata } from "next"
import { Inter, Quicksand } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" })

export const metadata: Metadata = {
  title: {
    default: "TUYISHIME KENNY ARAFAT | Full-Stack Developer",
    template: "%s | TUYISHIME KENNY ARAFAT",
  },
  description: "Full-stack developer and founder of 301Inc with a passion for web technologies.",
  keywords: [
    "TUYISHIME KENNY ARAFAT",
    "tuyishime kenny arafat",
    "tuyi",
    "TUYI",
    "web developer",
    "full-stack developer",
    "React developer",
    "Next.js developer",
  ],
  authors: [
    {
      name: "TUYISHIME KENNY ARAFAT",
      url: "https://ngomabenjamin.com",
    },
  ],
  creator: "TUYISHIME KENNY ARAFAT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ngomabenjamin.com",
    title: "TUYISHIME KENNY ARAFAT | Full-Stack Developer",
    description: "Full-stack web developer and founder of 301Inc with a passion for web technologies.",
    siteName: "TUYISHIME KENNY ARAFAT Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "TUYISHIME KENNY ARAFAT | Full-Stack Developer",
    description: "Full-stack web developer and founder of 301Inc with a passion for web technologies.",
    creator: "KENNY",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: '301Inc'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${quicksand.variable}`}>
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
