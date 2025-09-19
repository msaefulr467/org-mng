import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { Users, Shield, FileText, Smartphone, ArrowRight, Sparkles, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center animate-pulse-slow">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">OrgApp</h1>
                <p className="text-xs text-muted-foreground">Modern Organization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="hover:bg-primary/10">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild className="btn-gradient shadow-lg">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 px-4 overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent/10 rounded-full animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 animate-slide-up glass px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Progressive Web App
          </Badge>
          <h2 className="text-4xl md:text-7xl font-bold text-balance mb-8 animate-fade-in">
            Sistem Manajemen
            <span className="gradient-primary bg-clip-text text-transparent block">Organisasi Modern</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-10 max-w-3xl mx-auto animate-slide-up">
            Platform digital revolusioner untuk mengelola anggota organisasi dengan sistem multi-level akses,
            pendaftaran online yang seamless, dan dashboard admin yang powerful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button size="lg" asChild className="btn-gradient shadow-elevated text-lg px-8 py-6">
              <Link href="/register">
                <Zap className="mr-2 h-5 w-5" />
                Daftar Sebagai Anggota
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="glass-card text-lg px-8 py-6 hover:shadow-elevated bg-transparent"
            >
              <Link href="/about">
                <Globe className="mr-2 h-5 w-5" />
                Pelajari Lebih Lanjut
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Fitur Unggulan
            </Badge>
            <h3 className="text-4xl font-bold mb-6">Teknologi Terdepan</h3>
            <p className="text-muted-foreground text-balance max-w-2xl mx-auto text-lg">
              Solusi lengkap untuk manajemen organisasi dengan teknologi modern dan user experience yang luar biasa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card interactive-card border-0 shadow-elevated">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 animate-pulse-slow">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Multi-Level Access</CardTitle>
                <CardDescription className="text-base">
                  Sistem akses bertingkat yang fleksibel dan aman untuk semua level pengguna
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Anggota biasa dengan akses terbatas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>Admin pengelola dengan kontrol penuh</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span>Master admin dengan akses sistem</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card interactive-card border-0 shadow-elevated">
              <CardHeader className="pb-4">
                <div
                  className="h-16 w-16 rounded-2xl gradient-secondary flex items-center justify-center mb-6 animate-pulse-slow"
                  style={{ animationDelay: "1s" }}
                >
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Pendaftaran Digital</CardTitle>
                <CardDescription className="text-base">
                  Form biodata interaktif dengan sistem upload yang canggih dan validasi real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Upload foto profil dengan preview</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>Bukti follow media sosial otomatis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span>Dokumen pendukung dengan enkripsi</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card interactive-card border-0 shadow-elevated md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 animate-pulse-slow"
                  style={{ animationDelay: "2s" }}
                >
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Progressive Web App</CardTitle>
                <CardDescription className="text-base">
                  Pengalaman aplikasi native di browser dengan performa optimal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Offline capable dengan sync otomatis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>Lightning fast loading</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span>Mobile-first responsive design</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <Badge variant="outline" className="mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Tentang Kami
              </Badge>
              <h3 className="text-4xl font-bold mb-8">Organisasi Digital Terdepan</h3>
              <div className="space-y-6 text-muted-foreground text-lg">
                <p>
                  Organisasi kami berkomitmen untuk membangun komunitas yang solid dan terorganisir dengan memanfaatkan
                  teknologi digital terdepan dan inovasi berkelanjutan.
                </p>
                <p>
                  Dengan sistem manajemen yang terintegrasi dan user experience yang luar biasa, kami memastikan setiap
                  anggota mendapat pelayanan terbaik dan proses administrasi yang efisien.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="text-center p-6 rounded-2xl glass-card">
                    <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">500+</div>
                    <div className="text-sm text-muted-foreground mt-2">Anggota Aktif</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl glass-card">
                    <div className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">24/7</div>
                    <div className="text-sm text-muted-foreground mt-2">Akses Online</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-float">
              <div className="aspect-square rounded-3xl glass-card p-8 flex items-center justify-center shadow-elevated">
                <div className="relative">
                  <Shield className="h-40 w-40 text-primary/60" />
                  <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-secondary animate-pulse"></div>
                  <div
                    className="absolute -bottom-4 -left-4 h-6 w-6 rounded-full bg-accent animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Globe className="w-4 h-4 mr-2" />
            Hubungi Kami
          </Badge>
          <h3 className="text-4xl font-bold mb-6">Mari Berkolaborasi</h3>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
            Ada pertanyaan tentang organisasi atau sistem aplikasi? Tim expert kami siap membantu Anda 24/7.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card interactive-card border-0 shadow-elevated">
              <CardHeader className="pb-6">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">@</span>
                </div>
                <CardTitle className="text-xl">Email</CardTitle>
                <CardDescription className="text-base">info@organisasi.com</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card interactive-card border-0 shadow-elevated">
              <CardHeader className="pb-6">
                <div className="h-12 w-12 rounded-xl gradient-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">📞</span>
                </div>
                <CardTitle className="text-xl">Telepon</CardTitle>
                <CardDescription className="text-base">+62 812-3456-7890</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card interactive-card border-0 shadow-elevated">
              <CardHeader className="pb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">📍</span>
                </div>
                <CardTitle className="text-xl">Alamat</CardTitle>
                <CardDescription className="text-base">Jakarta, Indonesia</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="glass-card border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">OrgApp - Modern Organization</span>
            </div>
            <p className="text-muted-foreground text-center">
              &copy; 2024 Aplikasi Organisasi. Semua hak dilindungi. Made with ❤️
            </p>
          </div>
        </div>
      </footer>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}
