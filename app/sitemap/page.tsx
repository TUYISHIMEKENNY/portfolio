import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ChevronRight, Home, User, Briefcase, FileText, Mail, Code, Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "Sitemap | tuyishime kenny arafar",
  description: "Complete sitemap of tuyishime kenny arafat's portfolio website.",
  keywords: ["sitemap", "tuyishime kenny arafat", "iNkodeInc", "InkodeInc", "website map"],
}

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sitemap</h1>
            <p className="text-muted-foreground">
              A complete map of all pages available on tuyishime kenny arafat portfolio website.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Main Pages</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/" className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <Home className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Home</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <User className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">About</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/projects"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Briefcase className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Projects</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Blog</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Mail className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Contact</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/resume"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Resume</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Legal Pages</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/privacy-policy"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Privacy Policy</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/terms-of-service"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Terms of Service</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Admin Pages</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/admin"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Settings className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Admin Dashboard</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/admin/projects"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Briefcase className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Manage Projects</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/admin/blog"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Manage Blog</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/admin/resume"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Manage Resume</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/admin/newsletter"
                  className="flex items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Mail className="mr-3 h-5 w-5 text-primary" />
                  <span className="font-medium">Manage Newsletter</span>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">API Endpoints</h2>
              <div className="rounded-lg border">
                <div className="p-4">
                  <p className="font-medium">
                    <Code className="mr-2 inline h-4 w-4" />
                    /api/blog
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Blog post management endpoints</p>
                </div>
                <div className="border-t p-4">
                  <p className="font-medium">
                    <Code className="mr-2 inline h-4 w-4" />
                    /api/projects
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Project management endpoints</p>
                </div>
                <div className="border-t p-4">
                  <p className="font-medium">
                    <Code className="mr-2 inline h-4 w-4" />
                    /api/contact
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Contact form submission endpoint</p>
                </div>
                <div className="border-t p-4">
                  <p className="font-medium">
                    <Code className="mr-2 inline h-4 w-4" />
                    /api/newsletter
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Newsletter subscription endpoints</p>
                </div>
                <div className="border-t p-4">
                  <p className="font-medium">
                    <Code className="mr-2 inline h-4 w-4" />
                    /api/upload
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">File upload endpoint</p>
                </div>
                <div className="border-t p-4">
                  <p className="font-medium">
                    <Code className="mr-2 inline h-4 w-4" />
                    /api/resume
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Resume management endpoints</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
