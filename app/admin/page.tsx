"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { getMemberStats } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, UserCheck, FileText, Shield, Activity, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const stats = getMemberStats()

  const quickActions = [
    {
      title: "Kelola Anggota",
      description: "Lihat dan kelola data anggota",
      href: "/admin/members",
      icon: Users,
      count: stats.total,
    },
    {
      title: "Verifikasi Pending",
      description: "Anggota menunggu verifikasi",
      href: "/admin/members?filter=unverified",
      icon: UserCheck,
      count: stats.unverified,
      urgent: stats.unverified > 0,
    },
    {
      title: "Profil Tidak Lengkap",
      description: "Anggota dengan profil belum lengkap",
      href: "/admin/members?filter=incomplete",
      icon: FileText,
      count: stats.profileIncomplete,
    },
    {
      title: "Laporan",
      description: "Lihat laporan dan statistik",
      href: "/admin/reports",
      icon: TrendingUp,
      count: null,
    },
  ]

  const recentActivities = [
    {
      id: "1",
      title: "Anggota baru mendaftar",
      description: "Jane Smith bergabung sebagai anggota",
      timestamp: "2 jam yang lalu",
      type: "new_member",
    },
    {
      id: "2",
      title: "Dokumen diupload",
      description: "John Doe mengupload dokumen verifikasi",
      timestamp: "4 jam yang lalu",
      type: "document_upload",
    },
    {
      id: "3",
      title: "Profil dilengkapi",
      description: "Member User melengkapi biodata",
      timestamp: "6 jam yang lalu",
      type: "profile_update",
    },
  ]

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navigation userRole={user?.role} userName={user?.name} />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Kelola anggota dan monitor aktivitas organisasi</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Semua anggota terdaftar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.active / stats.total) * 100)}% dari total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Terverifikasi</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.verified / stats.total) * 100)}% terverifikasi
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profil Lengkap</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.profileComplete}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.profileComplete / stats.total) * 100)}% lengkap
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <CardDescription>Fitur admin yang sering digunakan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button
                          key={action.title}
                          asChild
                          variant="outline"
                          className="h-auto p-4 flex-col gap-2 bg-transparent hover:bg-accent"
                        >
                          <Link href={action.href}>
                            <div className="flex items-center gap-2 w-full">
                              <Icon className="h-5 w-5" />
                              <div className="flex-1 text-left">
                                <div className="font-medium">{action.title}</div>
                                <div className="text-xs text-muted-foreground">{action.description}</div>
                              </div>
                              {action.count !== null && (
                                <Badge variant={action.urgent ? "destructive" : "secondary"}>{action.count}</Badge>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto" />
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Member Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Overview Anggota</CardTitle>
                  <CardDescription>Status kelengkapan data anggota</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profil Lengkap</span>
                      <span>
                        {stats.profileComplete}/{stats.total}
                      </span>
                    </div>
                    <Progress value={(stats.profileComplete / stats.total) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Terverifikasi</span>
                      <span>
                        {stats.verified}/{stats.total}
                      </span>
                    </div>
                    <Progress value={(stats.verified / stats.total) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Anggota Aktif</span>
                      <span>
                        {stats.active}/{stats.total}
                      </span>
                    </div>
                    <Progress value={(stats.active / stats.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t mt-4">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/admin/activities">Lihat Semua Aktivitas</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Admin Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Info Admin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Nama</div>
                    <div className="font-medium">{user?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Role</div>
                    <Badge variant="default">{user?.role}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Login Terakhir</div>
                    <div className="text-sm">Hari ini</div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Tugas Pending</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verifikasi Anggota</span>
                    <Badge variant="destructive">{stats.unverified}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Review Dokumen</span>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Follow Up</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" size="sm" asChild>
                    <Link href="/admin/tasks">Lihat Semua Tugas</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Sistem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <Badge variant="default">85% Used</Badge>
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
