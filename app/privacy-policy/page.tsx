import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Ngoma Benjamin",
  description: "Privacy policy for Ngoma Benjamin's portfolio website and services.",
  keywords: ["privacy policy", "ngoma benjamin", "ngoma301", "301Inc", "data protection"],
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: April 14, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Introduction</h2>
            <p>
              Welcome to Ngoma Benjamin's portfolio website. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website or use our services. Please read this privacy
              policy carefully. If you do not agree with the terms of this privacy policy, please do not access the
              site.
            </p>

            <h2>Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Contact us through our contact form</li>
              <li>Subscribe to our newsletter</li>
              <li>Comment on blog posts</li>
              <li>Register for an account</li>
            </ul>

            <p>The personal information we may collect includes:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Message content</li>
              <li>IP address</li>
              <li>Browser information</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, including for customer service, updates, and marketing purposes</li>
              <li>Send you emails and newsletters</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies and similar tracking technologies to track activity on our website and hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party services such as Google Analytics, email service providers, and social media
              platforms that collect, monitor, and analyze data to improve our service's functionality. These third
              parties have their own privacy policies addressing how they use such information.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement security measures designed to protect your personal information from unauthorized access,
              disclosure, alteration, and destruction. However, please be aware that no method of transmission over the
              internet or method of electronic storage is 100% secure.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and believe your child has provided us
              with personal information, please contact us.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:nibenjamin2020@gmail.com">contact@ngomabenjamin.com</a>.
            </p>
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/terms-of-service">
              <Button variant="outline">View Terms of Service</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
