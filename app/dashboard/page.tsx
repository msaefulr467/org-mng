"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, FileText, Upload, CheckCircle, AlertTriangle, Calendar, Users, Activity, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const profileCompletionSteps = [
    { id: "basic", label: "Informasi Dasar", completed: true },
    { id: "biodata", label: "Biodata Lengkap", completed: user?.profileComplete || false },
    { id: "documents", label: "Upload Dokumen", completed: false },
    { id: "verification", label: "Verifikasi", completed: false },
  ]

  const completedSteps = profileCompletionSteps.filter((step) => step.completed).length
  const completionPercentage = (completedSteps / profileCompletionSteps.length) * 100

  const quickActions = [
    {
      title: "Lengkapi Biodata",
      description: "Isi data diri lengkap",
      href: "/biodata",
      icon: FileText,
      variant: "default" as const,
      disabled: false,
    },
    {
      title: "Upload Dokumen",
      description: "Upload foto dan bukti",
      href: "/documents",
      icon: Upload,
      variant: "outline" as const,
      disabled: !user?.profileComplete,
    },
    {
      title: "Lihat Profil",
      description: "Kelola informasi akun",
      href: "/profile",
      icon: User,
      variant: "outline" as const,
      disabled: false,
    },
  ]

  const recentActivities = [
    {
      id: "1",
      title: "Akun berhasil dibuat",
      description: "Selamat datang di sistem organisasi",
      timestamp: "2 jam yang lalu",
      type: "success",
    },
    {
      id: "2",
      title: "Profil perlu dilengkapi",
      description: "Silakan lengkapi biodata Anda",
      timestamp: "2 jam yang lalu",
      type: "warning",
    },
  ]

  return (
    <AuthGuard requiredRole="member">
      <div className="min-h-screen bg-background">
        <Navigation userRole={user?.role} userName={user?.name} />

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, {user?.name}!</h1>
            <p className="text-muted-foreground">Kelola profil dan akses fitur organisasi dari dashboard ini.</p>
          </div>

          {/* Profile Completion Alert */}
          {!user?.profileComplete && (
            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <AlertDescription>
                <strong>Profil belum lengkap.</strong> Silakan lengkapi biodata Anda untuk mengakses semua fitur.
                <Button asChild variant="link" className="p-0 h-auto ml-2 text-primary">
                  <Link href="/biodata">Lengkapi sekarang</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Kelengkapan Profil
                  </CardTitle>
                  <CardDescription>
                    {completedSteps} dari {profileCompletionSteps.length} langkah selesai
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {profileCompletionSteps.map((step) => (
                      <div key={step.id} className="flex items-center gap-3">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>
                        <span className={step.completed ? "text-foreground" : "text-muted-foreground"}>
                          {step.label}
                        </span>
                        {step.completed && (
                          <Badge variant="secondary" className="ml-auto">
                            Selesai
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <CardDescription>Fitur yang sering digunakan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button
                          key={action.title}
                          asChild
                          variant={action.variant}
                          className="h-auto p-4 flex-col gap-2"
                          disabled={action.disabled}
                        >
                          <Link href={action.href}>
                            <Icon className="h-6 w-6" />
                            <div className="text-center">
                              <div className="font-medium">{action.title}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.type === "success"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {activity.type === "success" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Akun
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Nama</div>
                    <div className="font-medium">{user?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Role</div>
                    <Badge variant="secondary">{user?.role}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={user?.isActive ? "default" : "destructive"}>
                      {user?.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Organisasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Anggota</div>
                    <div className="text-2xl font-bold text-primary">500+</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Anggota Aktif</div>
                    <div className="text-2xl font-bold text-primary">450+</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/about">
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Butuh Bantuan?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Tim support kami siap membantu Anda 24/7</p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Email:</strong> support@organisasi.com
                    </div>
                    <div className="text-sm">
                      <strong>WhatsApp:</strong> +62 812-3456-7890
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
