"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Shield, Settings, Edit, LogOut } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const profileSections = [
    {
      title: "Informasi Akun",
      items: [
        { label: "Nama Lengkap", value: user?.name, icon: User },
        { label: "Email", value: user?.email, icon: Mail },
        { label: "Role", value: user?.role, icon: Shield, badge: true },
        { label: "Bergabung", value: user?.createdAt?.toLocaleDateString("id-ID"), icon: Calendar },
      ],
    },
  ]

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "master":
        return "default"
      case "admin":
        return "secondary"
      case "member":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <AuthGuard requiredRole="member">
      <div className="min-h-screen bg-background">
        <Navigation userRole={user?.role} userName={user?.name} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{user?.name}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getRoleBadgeVariant(user?.role || "")}>{user?.role}</Badge>
                      <Badge variant={user?.isActive ? "default" : "destructive"}>
                        {user?.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/biodata">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Biodata
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {profileSections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.items.map((item, itemIndex) => {
                        const Icon = item.icon
                        return (
                          <div key={itemIndex}>
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="text-sm text-muted-foreground">{item.label}</div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.value || "-"}</span>
                                  {item.badge && item.value && (
                                    <Badge variant={getRoleBadgeVariant(item.value)}>{item.value}</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            {itemIndex < section.items.length - 1 && <Separator className="mt-4" />}
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))}

                {/* Profile Completion Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status Profil</CardTitle>
                    <CardDescription>Kelengkapan informasi akun Anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Biodata Lengkap</span>
                        <Badge variant={user?.profileComplete ? "default" : "secondary"}>
                          {user?.profileComplete ? "Selesai" : "Belum Lengkap"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Dokumen Upload</span>
                        <Badge variant="secondary">Belum Upload</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Verifikasi Admin</span>
                        <Badge variant="secondary">Menunggu</Badge>
                      </div>

                      {!user?.profileComplete && (
                        <div className="pt-4 border-t">
                          <Button asChild className="w-full">
                            <Link href="/biodata">Lengkapi Biodata</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Aksi Cepat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/biodata">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Biodata
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/documents">
                        <Settings className="mr-2 h-4 w-4" />
                        Upload Dokumen
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Account Security */}
                <Card>
                  <CardHeader>
                    <CardTitle>Keamanan Akun</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Terakhir Login</div>
                      <div className="font-medium">Hari ini</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Status Keamanan</div>
                      <Badge variant="default">Aman</Badge>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Ganti Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bantuan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">Butuh bantuan dengan akun Anda?</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Email:</strong> support@organisasi.com
                      </div>
                      <div>
                        <strong>WhatsApp:</strong> +62 812-3456-7890
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
