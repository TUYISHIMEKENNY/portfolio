"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import AOS from "aos"
import "aos/dist/aos.css"

export default function LoginPage() {
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtpForm, setShowOtpForm] = useState(false)
  const { sendOtp, verifyOtp, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })

    // If user is already authenticated, redirect to admin
    if (user?.isAuthenticated) {
      router.push("/admin")
    }
  }, [user, router])

  const handleSendOtp = async () => {
    setIsSubmitting(true)

    try {
      const result = await sendOtp()

      if (result.success) {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the OTP code",
        })
        setShowOtpForm(true)
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await verifyOtp(otp)

      if (result.success) {
        toast({
          title: "Success",
          description: "You have been successfully logged in",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md" data-aos="fade-up">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>
              {showOtpForm ? "Enter the OTP code sent to your email" : "Click the button below to receive an OTP code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showOtpForm ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  An OTP will be sent to: nibenjamin2020@gmail.com
                </p>
                <Button onClick={handleSendOtp} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send OTP Code"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    pattern="[0-9]{4}"
                    className="text-center text-xl tracking-widest"
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    A 4-digit code has been sent to your email
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOtpForm(false)}
                  disabled={isSubmitting}
                >
                  Resend OTP
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
