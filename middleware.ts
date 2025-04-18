import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl

  // Check if the path starts with /admin
  if (pathname.startsWith("/admin")) {
    // Check if the user is authenticated by looking for the auth cookie
    const authCookie = request.cookies.get("portfolio_auth")

    // If not authenticated, redirect to the login page
    if (!authCookie) {
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }

    try {
      // Verify the cookie content
      const userData = JSON.parse(authCookie.value)
      if (!userData.isAuthenticated) {
        const url = new URL("/login", request.url)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // If cookie is invalid, redirect to login
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: ["/admin/:path*"],
}
