"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { FileUpload } from "@/components/file-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, ImageIcon, CheckCircle, AlertTriangle, Info } from "lucide-react"
import type { UploadedFile } from "@/lib/file-upload"
import Link from "next/link"

export default function DocumentsPage() {
  const { user, updateProfile } = useAuth()
  const [profileFiles, setProfileFiles] = useState<UploadedFile[]>([])
  const [documentFiles, setDocumentFiles] = useState<UploadedFile[]>([])
  const [socialProofFiles, setSocialProofFiles] = useState<UploadedFile[]>([])

  const documentRequirements = [
    {
      category: "profile" as const,
      title: "Foto Profil",
      description: "Upload foto profil terbaru Anda",
      required: true,
      maxFiles: 1,
      accept: { "image/*": [".jpeg", ".jpg", ".png"] },
      examples: ["Foto close-up wajah", "Background polos", "Resolusi minimal 300x300px"],
    },
    {
      category: "document" as const,
      title: "Dokumen Identitas",
      description: "KTP, SIM, atau dokumen identitas lainnya",
      required: true,
      maxFiles: 2,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
        "application/pdf": [".pdf"],
      },
      examples: ["KTP (depan-belakang)", "SIM", "Paspor", "Kartu Mahasiswa"],
    },
    {
      category: "social_proof" as const,
      title: "Bukti Media Sosial",
      description: "Screenshot follow akun media sosial organisasi",
      required: false,
      maxFiles: 3,
      accept: { "image/*": [".jpeg", ".jpg", ".png"] },
      examples: ["Screenshot follow Instagram", "Screenshot follow TikTok", "Screenshot follow Facebook"],
    },
  ]

  const getUploadedFiles = (category: UploadedFile["category"]) => {
    switch (category) {
      case "profile":
        return profileFiles
      case "document":
        return documentFiles
      case "social_proof":
        return socialProofFiles
      default:
        return []
    }
  }

  const setUploadedFiles = (category: UploadedFile["category"], files: UploadedFile[]) => {
    switch (category) {
      case "profile":
        setProfileFiles(files)
        break
      case "document":
        setDocumentFiles(files)
        break
      case "social_proof":
        setSocialProofFiles(files)
        break
    }
  }

  const handleUploadComplete = (category: UploadedFile["category"]) => (files: UploadedFile[]) => {
    setUploadedFiles(category, files)

    // Update user profile if documents are uploaded
    const hasRequiredDocs = profileFiles.length > 0 && documentFiles.length > 0
    if (hasRequiredDocs) {
      updateProfile({ profileComplete: true })
    }
  }

  // Calculate completion percentage
  const totalRequired = documentRequirements.filter((req) => req.required).length
  const completedRequired = documentRequirements
    .filter((req) => req.required)
    .filter((req) => getUploadedFiles(req.category).length > 0).length
  const completionPercentage = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0

  const allFilesCount = profileFiles.length + documentFiles.length + socialProofFiles.length

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
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Upload Dokumen</h1>
                  <p className="text-muted-foreground">Upload dokumen dan foto yang diperlukan</p>
                </div>
              </div>

              {/* Progress Overview */}
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Kelengkapan Dokumen</h3>
                      <p className="text-sm text-muted-foreground">
                        {completedRequired} dari {totalRequired} dokumen wajib terupload
                      </p>
                    </div>
                    <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                      {completionPercentage}%
                    </Badge>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  {allFilesCount > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">Total {allFilesCount} file terupload</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upload Instructions */}
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Petunjuk Upload:</strong> Pastikan foto/dokumen jelas dan dapat dibaca. File maksimal 5MB.
                Dokumen yang sudah diupload akan direview oleh admin dalam 1-2 hari kerja.
              </AlertDescription>
            </Alert>

            {/* Upload Sections */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Foto Profil
                  {profileFiles.length > 0 && <CheckCircle className="h-3 w-3 text-green-600" />}
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Dokumen
                  {documentFiles.length > 0 && <CheckCircle className="h-3 w-3 text-green-600" />}
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Media Sosial
                  {socialProofFiles.length > 0 && <CheckCircle className="h-3 w-3 text-green-600" />}
                </TabsTrigger>
              </TabsList>

              {documentRequirements.map((requirement) => (
                <TabsContent key={requirement.category} value={requirement.category}>
                  <div className="space-y-4">
                    {/* Requirement Info */}
                    <Card className="border-muted">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {requirement.title}
                            {requirement.required && <Badge variant="destructive">Wajib</Badge>}
                          </CardTitle>
                          {getUploadedFiles(requirement.category).length > 0 && (
                            <Badge variant="default">{getUploadedFiles(requirement.category).length} file</Badge>
                          )}
                        </div>
                        <CardDescription>{requirement.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Contoh yang dapat diterima:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {requirement.examples.map((example, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* File Upload Component */}
                    <FileUpload
                      category={requirement.category}
                      title={`Upload ${requirement.title}`}
                      description={`Maksimal ${requirement.maxFiles} file`}
                      accept={requirement.accept}
                      maxFiles={requirement.maxFiles}
                      existingFiles={getUploadedFiles(requirement.category)}
                      onUploadComplete={handleUploadComplete(requirement.category)}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Completion Status */}
            {completionPercentage === 100 && (
              <Alert className="mt-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Dokumen Lengkap!</strong> Semua dokumen wajib sudah terupload. Tim admin akan melakukan review
                  dalam 1-2 hari kerja. Anda akan mendapat notifikasi melalui email setelah proses review selesai.
                </AlertDescription>
              </Alert>
            )}

            {/* Incomplete Warning */}
            {completionPercentage < 100 && allFilesCount > 0 && (
              <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dokumen Belum Lengkap.</strong> Anda masih perlu mengupload{" "}
                  {totalRequired - completedRequired} dokumen wajib lagi untuk melengkapi persyaratan.
                </AlertDescription>
              </Alert>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Kembali ke Dashboard</Link>
              </Button>
              <Button asChild disabled={completionPercentage < 100}>
                <Link href="/profile">Lihat Profil</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
