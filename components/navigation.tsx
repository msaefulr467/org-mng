"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Users, Menu, Home, UserPlus, LogIn, Settings, Shield, FileText, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  userRole?: "guest" | "member" | "admin" | "master"
  userName?: string
}

export function Navigation({ userRole = "guest", userName }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const guestLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/about", label: "Tentang", icon: FileText },
    { href: "/login", label: "Masuk", icon: LogIn },
    { href: "/register", label: "Daftar", icon: UserPlus },
  ]

  const memberLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/profile", label: "Profil", icon: User },
    { href: "/biodata", label: "Biodata", icon: FileText },
  ]

  const adminLinks = [
    { href: "/admin", label: "Admin Panel", icon: Shield },
    { href: "/admin/members", label: "Kelola Anggota", icon: Users },
    { href: "/admin/reports", label: "Laporan", icon: FileText },
  ]

  const masterLinks = [
    { href: "/master", label: "Master Panel", icon: Settings },
    { href: "/master/admins", label: "Kelola Admin", icon: Shield },
    { href: "/master/settings", label: "Pengaturan", icon: Settings },
  ]

  const getLinks = () => {
    switch (userRole) {
      case "member":
        return [...memberLinks]
      case "admin":
        return [...memberLinks, ...adminLinks]
      case "master":
        return [...memberLinks, ...adminLinks, ...masterLinks]
      default:
        return guestLinks
    }
  }

  const getRoleBadge = () => {
    switch (userRole) {
      case "member":
        return <Badge variant="secondary">Anggota</Badge>
      case "admin":
        return <Badge variant="default">Admin</Badge>
      case "master":
        return <Badge className="bg-gradient-to-r from-primary to-secondary">Master</Badge>
      default:
        return null
    }
  }

  const links = getLinks()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OrgApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Mobile Menu */}
          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Halo, {userName}</span>
                {getRoleBadge()}
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4">
                  {userName && (
                    <div className="flex items-center gap-2 pb-4 border-b">
                      <span className="text-sm font-medium">Halo, {userName}</span>
                      {getRoleBadge()}
                    </div>
                  )}

                  <nav className="flex flex-col gap-2">
                    {links.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                            pathname === link.href
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>

                  {userRole !== "guest" && (
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href="/logout">Keluar</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
