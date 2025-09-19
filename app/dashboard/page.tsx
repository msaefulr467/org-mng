"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react"
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
      gradient: "gradient-primary",
    },
    {
      title: "Upload Dokumen",
      description: "Upload foto dan bukti",
      href: "/documents",
      icon: Upload,
      variant: "outline" as const,
      disabled: !user?.profileComplete,
      gradient: "gradient-secondary",
    },
    {
      title: "Lihat Profil",
      description: "Kelola informasi akun",
      href: "/profile",
      icon: User,
      variant: "outline" as const,
      disabled: false,
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
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
      <div className="min-h-screen">
        <Navigation userRole={user?.role} userName={user?.name} />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full animate-float opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-slow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold animate-slide-up">Selamat Datang, {user?.name}!</h1>
                  <p className="text-muted-foreground text-lg animate-fade-in">
                    Kelola profil dan akses fitur organisasi dari dashboard modern ini.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!user?.profileComplete && (
            <Alert className="mb-6 glass-card border-0 shadow-elevated animate-slide-up">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <AlertDescription className="ml-4">
                <strong className="text-lg">Profil belum lengkap.</strong>
                <p className="text-muted-foreground mt-1">
                  Silakan lengkapi biodata Anda untuk mengakses semua fitur premium.
                </p>
                <Button asChild variant="link" className="p-0 h-auto mt-2 text-primary font-semibold">
                  <Link href="/biodata">
                    <Zap className="w-4 h-4 mr-1" />
                    Lengkapi sekarang
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass-card border-0 shadow-elevated interactive-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Kelengkapan Profil
                  </CardTitle>
                  <CardDescription className="text-base">
                    {completedSteps} dari {profileCompletionSteps.length} langkah selesai - Tingkatkan untuk akses
                    penuh!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress Completion</span>
                      <span className="text-primary">{Math.round(completionPercentage)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={completionPercentage} className="h-3 bg-muted/50" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {profileCompletionSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                            step.completed ? "gradient-primary text-white shadow-lg" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <div className="h-3 w-3 rounded-full bg-current" />
                          )}
                        </div>
                        <span
                          className={`flex-1 font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </span>
                        {step.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selesai
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl gradient-secondary flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    Aksi Cepat
                  </CardTitle>
                  <CardDescription className="text-base">
                    Fitur yang sering digunakan untuk produktivitas maksimal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <div key={action.title} className="group">
                          <Button
                            asChild
                            variant="outline"
                            className="h-auto p-6 flex-col gap-4 w-full glass-card border-0 shadow-lg hover:shadow-elevated transition-all duration-300 group-hover:scale-105 bg-transparent"
                            disabled={action.disabled}
                          >
                            <Link href={action.href}>
                              <div
                                className={`h-12 w-12 rounded-2xl ${action.gradient} flex items-center justify-center animate-pulse-slow`}
                                style={{ animationDelay: `${index * 0.5}s` }}
                              >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-base">{action.title}</div>
                                <div className="text-sm text-muted-foreground mt-1">{action.description}</div>
                              </div>
                            </Link>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-2xl glass hover:shadow-lg transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg ${
                            activity.type === "success"
                              ? "bg-gradient-to-br from-green-400 to-emerald-500"
                              : "bg-gradient-to-br from-yellow-400 to-orange-500"
                          }`}
                        >
                          {activity.type === "success" ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base">{activity.title}</div>
                          <div className="text-muted-foreground mt-1">{activity.description}</div>
                          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* User Info */}
              <Card className="glass-card border-0 shadow-elevated interactive-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    Informasi Akun
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Nama</div>
                    <div className="font-semibold text-base">{user?.name}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-semibold text-base">{user?.email}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Role</div>
                      <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-primary/20">
                        {user?.role}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge variant={user?.isActive ? "default" : "destructive"} className="mt-1">
                        {user?.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Info */}
              <Card className="glass-card border-0 shadow-elevated interactive-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl gradient-secondary flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Statistik Organisasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-2xl glass">
                      <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">500+</div>
                      <div className="text-sm text-muted-foreground mt-1">Total Anggota</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl glass">
                      <div className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">450+</div>
                      <div className="text-sm text-muted-foreground mt-1">Anggota Aktif</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full glass-card border-0 shadow-lg hover:shadow-elevated bg-transparent"
                    asChild
                  >
                    <Link href="/about">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card className="glass-card border-0 shadow-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white text-sm">?</span>
                    </div>
                    Butuh Bantuan?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Tim support expert kami siap membantu Anda 24/7</p>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="text-sm font-medium">Email Support</div>
                      <div className="text-sm text-muted-foreground">support@organisasi.com</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30">
                      <div className="text-sm font-medium">WhatsApp</div>
                      <div className="text-sm text-muted-foreground">+62 812-3456-7890</div>
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
