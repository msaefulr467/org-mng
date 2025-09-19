"use client"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  category: "profile" | "document" | "social_proof"
}

export interface FileUploadProgress {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
  result?: UploadedFile
}

// Mock storage for demo - in production this would use Firebase Storage or Vercel Blob
const mockStorage: UploadedFile[] = []

export const uploadFile = async (
  file: File,
  category: UploadedFile["category"],
  onProgress?: (progress: number) => void,
): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      reject(new Error("File terlalu besar. Maksimal 5MB"))
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      reject(new Error("Tipe file tidak didukung. Gunakan JPG, PNG, atau PDF"))
      return
    }

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress > 100) progress = 100

      onProgress?.(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Create mock uploaded file
        const uploadedFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // In production, this would be the actual storage URL
          uploadedAt: new Date(),
          category,
        }

        mockStorage.push(uploadedFile)
        resolve(uploadedFile)
      }
    }, 200)

    // Simulate potential error
    setTimeout(() => {
      if (Math.random() < 0.05) {
        // 5% chance of error
        clearInterval(interval)
        reject(new Error("Gagal mengupload file. Silakan coba lagi"))
      }
    }, 1000)
  })
}

export const deleteFile = async (fileId: string): Promise<boolean> => {
  const index = mockStorage.findIndex((file) => file.id === fileId)
  if (index !== -1) {
    // Revoke object URL to free memory
    URL.revokeObjectURL(mockStorage[index].url)
    mockStorage.splice(index, 1)
    return true
  }
  return false
}

export const getUserFiles = (userId: string, category?: UploadedFile["category"]): UploadedFile[] => {
  // In production, this would filter by userId from database
  let files = [...mockStorage]
  if (category) {
    files = files.filter((file) => file.category === category)
  }
  return files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileIcon = (type: string): string => {
  if (type.startsWith("image/")) return "🖼️"
  if (type === "application/pdf") return "📄"
  return "📎"
}
