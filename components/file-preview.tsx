"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Trash2 } from "lucide-react"
import type { UploadedFile } from "@/lib/file-upload"
import { formatFileSize } from "@/lib/file-upload"

interface FilePreviewProps {
  file: UploadedFile
  onDelete?: (fileId: string) => void
  showActions?: boolean
}

export function FilePreview({ file, onDelete, showActions = true }: FilePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDownload = () => {
    // In production, this would download from actual storage URL
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "profile":
        return <Badge variant="default">Foto Profil</Badge>
      case "document":
        return <Badge variant="secondary">Dokumen</Badge>
      case "social_proof":
        return <Badge variant="outline">Media Sosial</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <div className="group relative">
      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
        {/* File Thumbnail */}
        <div className="relative">
          {file.type.startsWith("image/") ? (
            <img src={file.url || "/placeholder.svg"} alt={file.name} className="h-12 w-12 object-cover rounded" />
          ) : (
            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
              <span className="text-lg">📄</span>
            </div>
          )}
          {showActions && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-background border opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {file.name}
                    {getCategoryBadge(file.category)}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* File Preview */}
                  <div className="flex justify-center">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="max-h-96 max-w-full object-contain rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4 p-8">
                        <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-4xl">📄</span>
                        </div>
                        <p className="text-muted-foreground">Preview tidak tersedia untuk file PDF</p>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Nama File</div>
                      <div className="font-medium">{file.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ukuran</div>
                      <div className="font-medium">{formatFileSize(file.size)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tipe</div>
                      <div className="font-medium">{file.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Upload</div>
                      <div className="font-medium">{file.uploadedAt.toLocaleDateString("id-ID")}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {onDelete && (
                      <Button variant="destructive" onClick={() => onDelete(file.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium truncate">{file.name}</p>
            {getCategoryBadge(file.category)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString("id-ID")}
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(file.id)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
