"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { getMembers, updateMember, deleteMember, type MemberData } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react"

export default function AdminMembersPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<MemberData[]>(getMembers())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null)
  const [editingMember, setEditingMember] = useState<MemberData | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)

  // Filter and search members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = (() => {
      switch (filterStatus) {
        case "active":
          return member.isActive
        case "inactive":
          return !member.isActive
        case "verified":
          return member.verified
        case "unverified":
          return !member.verified
        case "incomplete":
          return !member.profileComplete
        default:
          return true
      }
    })()

    return matchesSearch && matchesFilter
  })

  const handleVerifyMember = (memberId: string, verified: boolean) => {
    if (updateMember(memberId, { verified })) {
      setMembers(getMembers())
    }
  }

  const handleActivateMember = (memberId: string, isActive: boolean) => {
    if (updateMember(memberId, { isActive })) {
      setMembers(getMembers())
    }
  }

  const handleDeleteMember = (memberId: string) => {
    if (deleteMember(memberId)) {
      setMembers(getMembers())
      setShowDeleteDialog(null)
    }
  }

  const handleUpdateNotes = (memberId: string, notes: string) => {
    if (updateMember(memberId, { notes })) {
      setMembers(getMembers())
      setEditingMember(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "master":
        return <Badge className="bg-gradient-to-r from-primary to-secondary">Master</Badge>
      case "admin":
        return <Badge variant="default">Admin</Badge>
      case "member":
        return <Badge variant="secondary">Member</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (member: MemberData) => {
    if (!member.isActive) return <Badge variant="destructive">Tidak Aktif</Badge>
    if (!member.verified) return <Badge variant="secondary">Belum Verifikasi</Badge>
    if (!member.profileComplete) return <Badge variant="outline">Profil Belum Lengkap</Badge>
    return <Badge variant="default">Aktif</Badge>
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navigation userRole={user?.role} userName={user?.name} />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Kelola Anggota</h1>
                <p className="text-muted-foreground">Manage dan monitor data anggota organisasi</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Anggota</CardTitle>
              <CardDescription>Total {filteredMembers.length} anggota ditemukan</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="verified">Terverifikasi</SelectItem>
                    <SelectItem value="unverified">Belum Verifikasi</SelectItem>
                    <SelectItem value="incomplete">Profil Belum Lengkap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Members Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Anggota</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bergabung</TableHead>
                      <TableHead>Terakhir Aktif</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{getStatusBadge(member)}</TableCell>
                        <TableCell>{member.joinDate.toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>
                          {member.lastActive.toLocaleDateString("id-ID") === new Date().toLocaleDateString("id-ID")
                            ? "Hari ini"
                            : member.lastActive.toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedMember(member)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detail Anggota</DialogTitle>
                                  <DialogDescription>Informasi lengkap anggota</DialogDescription>
                                </DialogHeader>
                                {selectedMember && (
                                  <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Nama Lengkap</Label>
                                        <div className="text-sm">{selectedMember.name}</div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <div className="text-sm">{selectedMember.email}</div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Telepon</Label>
                                        <div className="text-sm">{selectedMember.phone || "-"}</div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Role</Label>
                                        <div className="text-sm">{getRoleBadge(selectedMember.role)}</div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <div className="text-sm">{getStatusBadge(selectedMember)}</div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Bergabung</Label>
                                        <div className="text-sm">
                                          {selectedMember.joinDate.toLocaleDateString("id-ID")}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Alamat</Label>
                                      <div className="text-sm">{selectedMember.address || "-"}</div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Catatan Admin</Label>
                                      <div className="text-sm">{selectedMember.notes || "Tidak ada catatan"}</div>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t">
                                      {!selectedMember.verified && (
                                        <Button size="sm" onClick={() => handleVerifyMember(selectedMember.id, true)}>
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Verifikasi
                                        </Button>
                                      )}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingMember(selectedMember)}
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Catatan
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {!member.verified && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVerifyMember(member.id, true)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivateMember(member.id, !member.isActive)}
                              className={
                                member.isActive
                                  ? "text-red-600 hover:text-red-700"
                                  : "text-green-600 hover:text-green-700"
                              }
                            >
                              {member.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeleteDialog(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada anggota ditemukan</h3>
                  <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Notes Dialog */}
          <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Catatan Anggota</DialogTitle>
                <DialogDescription>Tambahkan atau edit catatan untuk {editingMember?.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    defaultValue={editingMember?.notes || ""}
                    placeholder="Tambahkan catatan tentang anggota ini..."
                    rows={4}
                    onBlur={(e) => {
                      if (editingMember) {
                        handleUpdateNotes(editingMember.id, e.target.value)
                      }
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Anggota</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Data anggota akan dihapus permanen dari sistem. Pastikan Anda sudah membackup data jika diperlukan.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                  Batal
                </Button>
                <Button variant="destructive" onClick={() => showDeleteDialog && handleDeleteMember(showDeleteDialog)}>
                  Hapus
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </AuthGuard>
  )
}
