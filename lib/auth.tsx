"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type UserRole = "guest" | "member" | "admin" | "master"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  isActive: boolean
  profileComplete?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes - in production this would be Firebase
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@organisasi.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
    isActive: true,
    profileComplete: true,
  },
  {
    id: "2",
    email: "master@organisasi.com",
    name: "Master Admin",
    role: "master",
    createdAt: new Date(),
    isActive: true,
    profileComplete: true,
  },
  {
    id: "3",
    email: "member@organisasi.com",
    name: "Member User",
    role: "member",
    createdAt: new Date(),
    isActive: true,
    profileComplete: false,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      // Mock authentication - in production this would be Firebase Auth
      const foundUser = mockUsers.find((u) => u.email === email)

      if (!foundUser) {
        return { success: false, error: "Email tidak ditemukan" }
      }

      if (!foundUser.isActive) {
        return { success: false, error: "Akun Anda tidak aktif" }
      }

      // In production, password would be verified by Firebase
      if (password.length < 6) {
        return { success: false, error: "Password minimal 6 karakter" }
      }

      setUser(foundUser)
      localStorage.setItem("auth_user", JSON.stringify(foundUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Terjadi kesalahan saat login" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email)
      if (existingUser) {
        return { success: false, error: "Email sudah terdaftar" }
      }

      // Validate input
      if (password.length < 6) {
        return { success: false, error: "Password minimal 6 karakter" }
      }

      if (name.length < 2) {
        return { success: false, error: "Nama minimal 2 karakter" }
      }

      // Create new user - in production this would be Firebase Auth
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: "member", // New users start as members
        createdAt: new Date(),
        isActive: true,
        profileComplete: false,
      }

      // Add to mock users array (in production this would be handled by Firebase)
      mockUsers.push(newUser)

      setUser(newUser)
      localStorage.setItem("auth_user", JSON.stringify(newUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Terjadi kesalahan saat mendaftar" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: "User tidak ditemukan" }
      }

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("auth_user", JSON.stringify(updatedUser))

      // In production, this would update Firebase Firestore
      const userIndex = mockUsers.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Terjadi kesalahan saat update profil" }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to check if user has required role
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false

  const roleHierarchy: Record<UserRole, number> = {
    guest: 0,
    member: 1,
    admin: 2,
    master: 3,
  }

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}
