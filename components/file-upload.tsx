"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { uploadFile, type UploadedFile, type FileUploadProgress, formatFileSize } from "@/lib/file-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"

interface FileUploadProps {
  category: UploadedFile["category"]
  title: string
  description: string
  accept?: Record<string, string[]>
  maxFiles?: number
  onUploadComplete?: (files: UploadedFile[]) => void
  existingFiles?: UploadedFile[]
}

export function FileUpload({
  category,
  title,
  description,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png"],
    "application/pdf": [".pdf"],
  },
  maxFiles = 5,
  onUploadComplete,
  existingFiles = [],
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles)
  const [error, setError] = useState<string>("")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError("")

      // Check if adding these files would exceed maxFiles
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`Maksimal ${maxFiles} file dapat diupload`)
        return
      }

      // Initialize progress tracking
      const newProgress: FileUploadProgress[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadProgress((prev) => [...prev, ...newProgress])

      // Upload files
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        try {
          const result = await uploadFile(file, category, (progress) => {
            setUploadProgress((prev) =>
              prev.map((item, i) => (item.file === file ? { ...item, progress: Math.round(progress) } : item)),
            )
          })

          setUploadProgress((prev) =>
            prev.map((item) => (item.file === file ? { ...item, status: "completed" as const, result } : item)),
          )

          return result
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Upload gagal"
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.file === file ? { ...item, status: "error" as const, error: errorMessage } : item,
            ),
          )
          throw err
        }
      })

      try {
        const results = await Promise.allSettled(uploadPromises)
        const successfulUploads = results
          .filter((result): result is PromiseFulfilledResult<UploadedFile> => result.status === "fulfilled")
          .map((result) => result.value)

        if (successfulUploads.length > 0) {
          const newFiles = [...uploadedFiles, ...successfulUploads]
          setUploadedFiles(newFiles)
          onUploadComplete?.(newFiles)
        }

        // Clear completed uploads after a delay
        setTimeout(() => {
          setUploadProgress((prev) => prev.filter((item) => item.status === "uploading"))
        }, 3000)
      } catch (err) {
        console.error("Upload error:", err)
      }
    },
    [category, maxFiles, uploadedFiles, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles,
  })

  const removeFile = (fileId: string) => {
    const newFiles = uploadedFiles.filter((file) => file.id !== fileId)
    setUploadedFiles(newFiles)
    onUploadComplete?.(newFiles)
  }

  const removeProgressItem = (file: File) => {
    setUploadProgress((prev) => prev.filter((item) => item.file !== file))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {uploadedFiles.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop file di sini...</p>
            ) : (
              <div>
                <p className="text-sm font-medium mb-2">Klik atau drag & drop file</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, PDF (max 5MB) • {uploadedFiles.length}/{maxFiles} file
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="space-y-3">
            {uploadProgress.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.file.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium truncate">{item.file.name}</span>
                    <span className="text-xs text-muted-foreground">({formatFileSize(item.file.size)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {item.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                    <Button variant="ghost" size="sm" onClick={() => removeProgressItem(item.file)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {item.status === "uploading" && (
                  <div className="space-y-1">
                    <Progress value={item.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{item.progress}% uploaded</p>
                  </div>
                )}
                {item.status === "error" && <p className="text-xs text-red-600">{item.error}</p>}
                {item.status === "completed" && <p className="text-xs text-green-600">Upload berhasil!</p>}
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">File Terupload</h4>
              <Badge variant="secondary">{uploadedFiles.length} file</Badge>
            </div>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Limit Info */}
        {uploadedFiles.length >= maxFiles && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Batas maksimal {maxFiles} file telah tercapai. Hapus file yang ada untuk menambah file baru.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
