"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2, UserPlus, Settings, Shield, Users, Building } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Mock data for admin users
const mockAdmins = [
  { id: "1", name: "Admin User 1", email: "admin1@org.com", role: "admin", status: "active", createdAt: "2024-01-15" },
  { id: "2", name: "Admin User 2", email: "admin2@org.com", role: "admin", status: "active", createdAt: "2024-02-20" },
]

const mockOrgSettings = {
  name: "Organisasi Pemuda Indonesia",
  description: "Organisasi yang bergerak dalam bidang pemberdayaan pemuda dan pengembangan masyarakat",
  vision: "Menjadi organisasi pemuda terdepan dalam membangun generasi yang berkarakter dan berdaya saing",
  mission: "Memberdayakan pemuda melalui program-program inovatif dan berkelanjutan",
  contact: {
    email: "info@organisasi.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Pemuda No. 123, Jakarta",
  },
  settings: {
    allowRegistration: true,
    requireApproval: true,
    maxMembers: 1000,
  },
}

export default function MasterAdminSettings() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState(mockAdmins)
  const [orgSettings, setOrgSettings] = useState(mockOrgSettings)
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "admin" })
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)

  // Redirect if not master admin
  if (user?.role !== "master") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Akses ditolak. Hanya Master Admin yang dapat mengakses halaman ini.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast({
        title: "Error",
        description: "Nama dan email harus diisi",
        variant: "destructive",
      })
      return
    }

    const admin = {
      id: Date.now().toString(),
      ...newAdmin,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setAdmins([...admins, admin])
    setNewAdmin({ name: "", email: "", role: "admin" })
    setIsAddingAdmin(false)

    toast({
      title: "Berhasil",
      description: "Admin baru berhasil ditambahkan",
    })
  }

  const handleRemoveAdmin = (adminId: string) => {
    setAdmins(admins.filter((admin) => admin.id !== adminId))
    toast({
      title: "Berhasil",
      description: "Admin berhasil dihapus",
    })
  }

  const handleUpdateOrgSettings = () => {
    toast({
      title: "Berhasil",
      description: "Pengaturan organisasi berhasil diperbarui",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Shield className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Master Admin Settings</h1>
          <p className="text-muted-foreground">Kelola admin dan pengaturan organisasi</p>
        </div>
      </div>

      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Kelola Admin
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Pengaturan Organisasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daftar Admin</CardTitle>
                <CardDescription>Kelola akses admin untuk sistem</CardDescription>
              </div>
              <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Tambah Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Admin Baru</DialogTitle>
                    <DialogDescription>Tambahkan admin baru untuk mengelola sistem</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        placeholder="Masukkan nama admin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        placeholder="Masukkan email admin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newAdmin.role}
                        onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingAdmin(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleAddAdmin}>Tambah Admin</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{admin.name}</h3>
                        <Badge variant="secondary">{admin.role}</Badge>
                        <Badge variant={admin.status === "active" ? "default" : "secondary"}>{admin.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <p className="text-xs text-muted-foreground">Dibuat: {admin.createdAt}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Organisasi</CardTitle>
              <CardDescription>Kelola informasi dasar organisasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgName">Nama Organisasi</Label>
                <Input
                  id="orgName"
                  value={orgSettings.name}
                  onChange={(e) => setOrgSettings({ ...orgSettings, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="orgDesc">Deskripsi</Label>
                <Textarea
                  id="orgDesc"
                  value={orgSettings.description}
                  onChange={(e) => setOrgSettings({ ...orgSettings, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="orgVision">Visi</Label>
                <Textarea
                  id="orgVision"
                  value={orgSettings.vision}
                  onChange={(e) => setOrgSettings({ ...orgSettings, vision: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="orgMission">Misi</Label>
                <Textarea
                  id="orgMission"
                  value={orgSettings.mission}
                  onChange={(e) => setOrgSettings({ ...orgSettings, mission: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak Organisasi</CardTitle>
              <CardDescription>Informasi kontak yang ditampilkan di website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgEmail">Email</Label>
                <Input
                  id="orgEmail"
                  type="email"
                  value={orgSettings.contact.email}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      contact: { ...orgSettings.contact, email: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="orgPhone">Telepon</Label>
                <Input
                  id="orgPhone"
                  value={orgSettings.contact.phone}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      contact: { ...orgSettings.contact, phone: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="orgAddress">Alamat</Label>
                <Textarea
                  id="orgAddress"
                  value={orgSettings.contact.address}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      contact: { ...orgSettings.contact, address: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
              <CardDescription>Konfigurasi sistem dan kebijakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Izinkan Pendaftaran</Label>
                  <p className="text-sm text-muted-foreground">Memungkinkan pengguna baru mendaftar</p>
                </div>
                <Switch
                  checked={orgSettings.settings.allowRegistration}
                  onCheckedChange={(checked) =>
                    setOrgSettings({
                      ...orgSettings,
                      settings: { ...orgSettings.settings, allowRegistration: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Persetujuan Manual</Label>
                  <p className="text-sm text-muted-foreground">Memerlukan persetujuan admin untuk anggota baru</p>
                </div>
                <Switch
                  checked={orgSettings.settings.requireApproval}
                  onCheckedChange={(checked) =>
                    setOrgSettings({
                      ...orgSettings,
                      settings: { ...orgSettings.settings, requireApproval: checked },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxMembers">Maksimal Anggota</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={orgSettings.settings.maxMembers}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      settings: { ...orgSettings.settings, maxMembers: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleUpdateOrgSettings} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
