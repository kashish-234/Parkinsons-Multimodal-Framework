'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Plus, Search, MoreVertical, Eye, Edit, Trash2, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'

const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()

  const patients = [
    {
      id: 'P001',
      name: 'James Anderson',
      age: 68,
      gender: 'M',
      status: 'Active',
      diagnosis_date: 'Jan 2019',
      updrs_score: 38,
      last_visit: 'Jan 15, 2024',
      severity: 'Moderate',
    },
    {
      id: 'P002',
      name: 'Margaret Chen',
      age: 72,
      gender: 'F',
      status: 'Active',
      diagnosis_date: 'Mar 2018',
      updrs_score: 52,
      last_visit: 'Jan 18, 2024',
      severity: 'Severe',
    },
    {
      id: 'P003',
      name: 'Robert Martinez',
      age: 65,
      gender: 'M',
      status: 'Active',
      diagnosis_date: 'Jun 2020',
      updrs_score: 28,
      last_visit: 'Jan 17, 2024',
      severity: 'Mild',
    },
    {
      id: 'P004',
      name: 'Patricia Johnson',
      age: 70,
      gender: 'F',
      status: 'Active',
      diagnosis_date: 'Sep 2019',
      updrs_score: 44,
      last_visit: 'Jan 16, 2024',
      severity: 'Moderate',
    },
    {
      id: 'P005',
      name: 'Michael Williams',
      age: 66,
      gender: 'M',
      status: 'Inactive',
      diagnosis_date: 'Feb 2017',
      updrs_score: 48,
      last_visit: 'Dec 10, 2023',
      severity: 'Moderate',
    },
    {
      id: 'P006',
      name: 'Susan Thompson',
      age: 73,
      gender: 'F',
      status: 'Active',
      diagnosis_date: 'Apr 2018',
      updrs_score: 56,
      last_visit: 'Jan 19, 2024',
      severity: 'Severe',
    },
    {
      id: 'P007',
      name: 'David Garcia',
      age: 69,
      gender: 'M',
      status: 'Active',
      diagnosis_date: 'Jul 2021',
      updrs_score: 22,
      last_visit: 'Jan 18, 2024',
      severity: 'Mild',
    },
    {
      id: 'P008',
      name: 'Linda Brown',
      age: 71,
      gender: 'F',
      status: 'Active',
      diagnosis_date: 'Nov 2019',
      updrs_score: 40,
      last_visit: 'Jan 15, 2024',
      severity: 'Moderate',
    },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Mild': 'bg-green-500/10 text-green-700 border-green-500/30',
      'Moderate': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
      'Severe': 'bg-red-500/10 text-red-700 border-red-500/30',
    }
    return colors[severity] || ''
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Patient Records</h1>
            <p className="text-foreground/70">Manage patient data</p>
          </div>
          <Button className="gap-2 w-full md:w-auto text-black">
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-foreground/70 text-sm mb-2">Total Patients</div>
              <p className="text-3xl font-bold text-foreground">254</p>
              <p className="text-xs text-primary mt-2">+12 this month</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-foreground/70 text-sm mb-2">Active</div>
              <p className="text-3xl font-bold text-foreground">242</p>
              <p className="text-xs text-foreground/60 mt-2">95.3% rate</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-foreground/70 text-sm mb-2">Avg Age</div>
              <p className="text-3xl font-bold text-foreground">69.5</p>
              <p className="text-xs text-foreground/60 mt-2">years</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search patients by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patients Table */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">Age</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">Severity</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">UPDRS</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">Last Visit</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/70 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/60">
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border hover:bg-card/50 transition">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{patient.name}</p>
                            <p className="text-xs text-foreground/60">Diagnosed: {patient.diagnosis_date}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground font-mono text-sm">{patient.id}</td>
                        <td className="py-4 px-4 text-foreground">{patient.age}</td>
                        <td className="py-4 px-4">
                          <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className='text-black'>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getSeverityColor(patient.severity)}>
                            {patient.severity}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-foreground font-medium">{patient.updrs_score}</td>
                        <td className="py-4 px-4 text-foreground text-sm">{patient.last_visit}</td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Record
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="w-4 h-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}

export default PatientsPage
