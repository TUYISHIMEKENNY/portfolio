"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"

type User = {
  email: string
  isAuthenticated: boolean
}

type AuthContextType = {
  user: User | null
  sendOtp: () => Promise<{ success: boolean; message: string }>
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Constants
const COOKIE_NAME = "portfolio_auth"
const COOKIE_EXPIRY = 5 // days

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // The email is hardcoded since we're simplifying the login process
  const adminEmail = "tuyishimekennyarr98@gmail.com"

  useEffect(() => {
    // Check if user is already logged in via cookie
    const authCookie = Cookies.get(COOKIE_NAME)
    if (authCookie) {
      try {
        const parsedUser = JSON.parse(authCookie)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing auth cookie:", error)
        Cookies.remove(COOKIE_NAME)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Protect admin routes
    if (!isLoading && !user?.isAuthenticated && pathname?.startsWith("/admin")) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const sendOtp = async () => {
    try {
      // Send OTP via API
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      return { success: true, message: "OTP sent to your email" }
    } catch (error) {
      console.error("Send OTP error:", error)
      return { success: false, message: error instanceof Error ? error.message : "An error occurred while sending OTP" }
    }
  }

  const verifyOtp = async (otp: string) => {
    try {
      // Verify OTP via API
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      // OTP is valid, set the user as authenticated
      const newUser = {
        email: adminEmail,
        isAuthenticated: true,
      }

      // Set user in state
      setUser(newUser)

      // Set cookie that expires in 5 days
      Cookies.set(COOKIE_NAME, JSON.stringify(newUser), {
        expires: COOKIE_EXPIRY,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })

      return { success: true, message: "Authentication successful" }
    } catch (error) {
      console.error("OTP verification error:", error)
      return { success: false, message: error instanceof Error ? error.message : "An error occurred during OTP verification" }
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove(COOKIE_NAME)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, sendOtp, verifyOtp, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
