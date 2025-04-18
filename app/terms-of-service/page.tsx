import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Ngoma Benjamin",
  description: "Terms of service for Ngoma Benjamin's portfolio website and services.",
  keywords: ["terms of service", "ngoma benjamin", "ngoma301", "301Inc", "legal terms"],
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: April 14, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Introduction</h2>
            <p>
              Welcome to Ngoma Benjamin's portfolio website. These Terms of Service govern your use of our website and
              services. By accessing or using our website, you agree to be bound by these Terms. If you disagree with
              any part of the terms, you may not access the website.
            </p>

            <h2>Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, Ngoma Benjamin and/or 301Inc owns the intellectual property rights for all
              material on this website. All intellectual property rights are reserved. You may view and/or print pages
              from the website for your own personal use subject to restrictions set in these terms of service.
            </p>

            <p>You must not:</p>
            <ul>
              <li>Republish material from this website</li>
              <li>Sell, rent, or sub-license material from this website</li>
              <li>Reproduce, duplicate, or copy material from this website</li>
              <li>Redistribute content from this website (unless content is specifically made for redistribution)</li>
            </ul>

            <h2>User Content</h2>
            <p>
              In these Terms of Service, "User Content" means material (including without limitation text, images, audio
              material, video material, and audio-visual material) that you submit to this website, for whatever
              purpose.
            </p>

            <p>
              You grant to Ngoma Benjamin a worldwide, irrevocable, non-exclusive, royalty-free license to use,
              reproduce, adapt, publish, translate, and distribute your User Content in any existing or future media.
              You also grant to Ngoma Benjamin the right to sub-license these rights, and the right to bring an action
              for infringement of these rights.
            </p>

            <p>
              Your User Content must not be illegal or unlawful, must not infringe any third party's legal rights, and
              must not be capable of giving rise to legal action whether against you or Ngoma Benjamin or a third party.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Ngoma Benjamin will not be liable to you in relation to the contents of, or use of, or otherwise in
              connection with, this website:
            </p>
            <ul>
              <li>For any indirect, special, or consequential loss</li>
              <li>For any business losses, loss of revenue, income, profits, or anticipated savings</li>
              <li>For any loss of or damage to data, databases, or software</li>
              <li>
                For any loss or damage which was not foreseeable to both parties at the time you accessed this website
              </li>
            </ul>

            <h2>Indemnification</h2>
            <p>
              You hereby indemnify Ngoma Benjamin and undertake to keep Ngoma Benjamin indemnified against any losses,
              damages, costs, liabilities, and expenses incurred or suffered by Ngoma Benjamin arising out of any breach
              by you of any provision of these Terms of Service, or arising out of any claim that you have breached any
              provision of these Terms of Service.
            </p>

            <h2>Breaches of These Terms of Service</h2>
            <p>
              Without prejudice to Ngoma Benjamin's other rights under these Terms of Service, if you breach these Terms
              of Service in any way, Ngoma Benjamin may take such action as deemed appropriate to deal with the breach,
              including suspending your access to the website, prohibiting you from accessing the website, blocking
              computers using your IP address from accessing the website, and/or bringing court proceedings against you.
            </p>

            <h2>Variation</h2>
            <p>
              Ngoma Benjamin may revise these Terms of Service from time to time. Revised terms of service will apply to
              the use of this website from the date of the publication of the revised terms of service on this website.
              Please check this page regularly to ensure you are familiar with the current version.
            </p>

            <h2>Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and
              Ngoma Benjamin in relation to your use of this website, and supersede all previous agreements in respect
              of your use of this website.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms of Service will be governed by and construed in accordance with the laws of your jurisdiction,
              and any disputes relating to these terms of service will be subject to the exclusive jurisdiction of the
              courts of your jurisdiction.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:nibenjamin2020@gmail.com">contact@ngomabenjamin.com</a>.
            </p>
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/privacy-policy">
              <Button variant="outline" className="mr-4">
                View Privacy Policy
              </Button>
            </Link>
            <Link href="/sitemap">
              <Button variant="outline">View Sitemap</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
