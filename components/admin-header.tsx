"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <span className="font-medium">{user?.email || "Admin"}</span>
      </div>
      <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-1">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}
