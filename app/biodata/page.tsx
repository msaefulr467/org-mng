"use client"

import type React from "react"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, AlertCircle, CheckCircle } from "lucide-react"

interface BiodataForm {
  fullName: string
  nickname: string
  birthPlace: string
  birthDate: string
  gender: string
  address: string
  phone: string
  education: string
  occupation: string
  socialMedia: {
    instagram: string
    tiktok: string
    facebook: string
  }
  interests: string
  motivation: string
}

export default function BiodataPage() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<BiodataForm>({
    fullName: user?.name || "",
    nickname: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    education: "",
    occupation: "",
    socialMedia: {
      instagram: "",
      tiktok: "",
      facebook: "",
    },
    interests: "",
    motivation: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("socialMedia.")) {
      const socialField = name.split(".")[1]
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialField]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const required = ["fullName", "birthPlace", "birthDate", "gender", "address", "phone"]
    for (const field of required) {
      if (!formData[field as keyof BiodataForm]) {
        return `Field ${field} harus diisi`
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      // In production, this would save to Firebase Firestore
      const result = await updateProfile({
        profileComplete: true,
        name: formData.fullName,
      })

      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(result.error || "Terjadi kesalahan saat menyimpan")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data")
    } finally {
      setLoading(false)
    }
  }

  const completedFields = Object.values(formData).filter((value) => {
    if (typeof value === "object") {
      return Object.values(value).some((v) => v.trim() !== "")
    }
    return value.trim() !== ""
  }).length

  const totalFields = 12 // Total number of main fields
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <AuthGuard requiredRole="member">
      <div className="min-h-screen bg-background">
        <Navigation userRole={user?.role} userName={user?.name} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Biodata Lengkap</h1>
                  <p className="text-muted-foreground">Lengkapi informasi diri Anda</p>
                </div>
              </div>

              {/* Progress */}
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Kelengkapan Data</span>
                    <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                      {completionPercentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Biodata berhasil disimpan! Profil Anda sudah lengkap.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pribadi</CardTitle>
                  <CardDescription>Data diri dan identitas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nama lengkap sesuai KTP"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nickname">Nama Panggilan</Label>
                      <Input
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        placeholder="Nama panggilan"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                      <Input
                        id="birthPlace"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        placeholder="Kota tempat lahir"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Jenis Kelamin *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Laki-laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+62 812-3456-7890"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Alamat lengkap tempat tinggal"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Education & Occupation */}
              <Card>
                <CardHeader>
                  <CardTitle>Pendidikan & Pekerjaan</CardTitle>
                  <CardDescription>Informasi pendidikan dan profesi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="education">Pendidikan Terakhir</Label>
                      <Select
                        value={formData.education}
                        onValueChange={(value) => handleSelectChange("education", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pendidikan terakhir" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sma">SMA/SMK</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="s1">Sarjana (S1)</SelectItem>
                          <SelectItem value="s2">Magister (S2)</SelectItem>
                          <SelectItem value="s3">Doktor (S3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Pekerjaan</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        placeholder="Pekerjaan/profesi saat ini"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Media Sosial</CardTitle>
                  <CardDescription>Akun media sosial (opsional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleInputChange}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok">TikTok</Label>
                      <Input
                        id="tiktok"
                        name="socialMedia.tiktok"
                        value={formData.socialMedia.tiktok}
                        onChange={handleInputChange}
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="socialMedia.facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleInputChange}
                        placeholder="Nama Facebook"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Tambahan</CardTitle>
                  <CardDescription>Minat dan motivasi bergabung</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="interests">Minat & Hobi</Label>
                    <Textarea
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      placeholder="Ceritakan minat dan hobi Anda"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivasi Bergabung</Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      placeholder="Mengapa Anda ingin bergabung dengan organisasi ini?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <a href="/dashboard">Kembali</a>
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Menyimpan..." : "Simpan Biodata"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
