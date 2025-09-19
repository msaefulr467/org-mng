import type { User } from "@/lib/auth"

// Mock member data for admin management
export interface MemberData extends User {
  phone?: string
  address?: string
  joinDate: Date
  lastActive: Date
  profileComplete: boolean
  documentsUploaded: boolean
  verified: boolean
  notes?: string
}

export const mockMembers: MemberData[] = [
  {
    id: "1",
    email: "admin@organisasi.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-15"),
    isActive: true,
    phone: "+62 812-1111-1111",
    address: "Jakarta Selatan",
    joinDate: new Date("2024-01-15"),
    lastActive: new Date(),
    profileComplete: true,
    documentsUploaded: true,
    verified: true,
  },
  {
    id: "2",
    email: "master@organisasi.com",
    name: "Master Admin",
    role: "master",
    createdAt: new Date("2024-01-01"),
    isActive: true,
    phone: "+62 812-0000-0000",
    address: "Jakarta Pusat",
    joinDate: new Date("2024-01-01"),
    lastActive: new Date(),
    profileComplete: true,
    documentsUploaded: true,
    verified: true,
  },
  {
    id: "3",
    email: "member@organisasi.com",
    name: "Member User",
    role: "member",
    createdAt: new Date("2024-02-01"),
    isActive: true,
    phone: "+62 812-2222-2222",
    address: "Jakarta Timur",
    joinDate: new Date("2024-02-01"),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    profileComplete: false,
    documentsUploaded: false,
    verified: false,
    notes: "Perlu follow up untuk melengkapi biodata",
  },
  {
    id: "4",
    email: "john.doe@email.com",
    name: "John Doe",
    role: "member",
    createdAt: new Date("2024-02-15"),
    isActive: true,
    phone: "+62 812-3333-3333",
    address: "Jakarta Barat",
    joinDate: new Date("2024-02-15"),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    profileComplete: true,
    documentsUploaded: true,
    verified: false,
    notes: "Menunggu verifikasi dokumen",
  },
  {
    id: "5",
    email: "jane.smith@email.com",
    name: "Jane Smith",
    role: "member",
    createdAt: new Date("2024-03-01"),
    isActive: false,
    phone: "+62 812-4444-4444",
    address: "Jakarta Utara",
    joinDate: new Date("2024-03-01"),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    profileComplete: true,
    documentsUploaded: false,
    verified: false,
    notes: "Tidak aktif, perlu follow up",
  },
]

export const getMembers = (): MemberData[] => {
  return mockMembers
}

export const getMemberById = (id: string): MemberData | undefined => {
  return mockMembers.find((member) => member.id === id)
}

export const updateMember = (id: string, updates: Partial<MemberData>): boolean => {
  const index = mockMembers.findIndex((member) => member.id === id)
  if (index !== -1) {
    mockMembers[index] = { ...mockMembers[index], ...updates }
    return true
  }
  return false
}

export const deleteMember = (id: string): boolean => {
  const index = mockMembers.findIndex((member) => member.id === id)
  if (index !== -1) {
    mockMembers.splice(index, 1)
    return true
  }
  return false
}

// Statistics
export const getMemberStats = () => {
  const total = mockMembers.length
  const active = mockMembers.filter((m) => m.isActive).length
  const verified = mockMembers.filter((m) => m.verified).length
  const profileComplete = mockMembers.filter((m) => m.profileComplete).length

  return {
    total,
    active,
    inactive: total - active,
    verified,
    unverified: total - verified,
    profileComplete,
    profileIncomplete: total - profileComplete,
  }
}
