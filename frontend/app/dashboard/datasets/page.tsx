'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Database, Upload, Search, MoreVertical, Copy, Download, Trash2, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>('motor')
  const searchParams = useSearchParams()

  const biomarkerGroups = {
    motor: {
      title: 'Motor Biomarkers',
      description: 'Movement and tremor measurements',
      icon: '🏃',
      datasets: [
        {
          id: 2,
          name: 'Tremor Recording Dataset',
          description: 'Accelerometer and gyroscope data from wearable sensors',
          size: '5.8 GB',
          records: 45600,
          status: 'active',
          created: 'Dec 20, 2023',
          version: 'v1.0',
        },
        {
          id: 1,
          name: 'Q1 2024 Patient Cohort',
          description: 'Clinical assessments and motor scores from Q1 patient visits',
          size: '2.4 GB',
          records: 1240,
          status: 'active',
          created: 'Jan 15, 2024',
          version: 'v2.1',
        },
      ],
    },
    imaging: {
      title: 'Imaging Biomarkers',
      description: 'Neuroimaging and structural data',
      icon: '🧠',
      datasets: [
        {
          id: 3,
          name: 'MRI Brain Imaging',
          description: 'Structural MRI scans with neurologist annotations',
          size: '12.1 GB',
          records: 486,
          status: 'active',
          created: 'Nov 30, 2023',
          version: 'v3.2',
        },
      ],
    },
    biochemical: {
      title: 'Biochemical Biomarkers',
      description: 'Blood and CSF measurements',
      icon: '🧪',
      datasets: [
        {
          id: 5,
          name: 'Biomarker Analysis',
          description: 'CSF and blood biomarker measurements with lab results',
          size: '420 MB',
          records: 156,
          status: 'active',
          created: 'Sep 5, 2023',
          version: 'v2.0',
        },
      ],
    },
    cognitive: {
      title: 'Cognitive Biomarkers',
      description: 'Cognitive assessment and neuropsychological data',
      icon: '🧩',
      datasets: [
        {
          id: 6,
          name: 'Cognitive Assessment Data',
          description: 'Montreal Cognitive Assessment and UPDRS scores',
          size: '850 MB',
          records: 520,
          status: 'active',
          created: 'Aug 22, 2023',
          version: 'v1.3',
        },
      ],
    },
    clinical: {
      title: 'Clinical Response',
      description: 'Treatment response and medication data',
      icon: '💊',
      datasets: [
        {
          id: 4,
          name: 'Medication Response Tracking',
          description: 'Patient compliance and symptom response data over 6 months',
          size: '1.2 GB',
          records: 320,
          status: 'archived',
          created: 'Oct 10, 2023',
          version: 'v1.5',
        },
      ],
    },
  }

  const filteredGroups = Object.entries(biomarkerGroups).reduce(
    (acc, [key, group]) => {
      const filtered = group.datasets.filter(
        (dataset) =>
          dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filtered.length > 0) {
        acc[key] = { ...group, datasets: filtered }
      }
      return acc
    },
    {} as typeof biomarkerGroups
  )

  const toggleBiomarker = (key: string) => {
    setExpandedBiomarker(expandedBiomarker === key ? null : key)
  }

  const filteredDatasets = Object.values(filteredGroups).flatMap((group) => group.datasets)

  return (
    <Suspense fallback={<Loading />}>
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Datasets</h1>
            <p className="text-foreground/70">Manage your research data</p>
          </div>
          <Button className="gap-2 w-full md:w-auto text-black">
            <Upload className="w-4 h-4 text-black" />
            Upload
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-foreground/70 text-sm mb-2">Total Datasets</div>
              <p className="text-3xl font-bold text-foreground">18</p>
              <p className="text-xs text-primary mt-2">6 active</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-foreground/70 text-sm mb-2">Storage Used</div>
              <p className="text-3xl font-bold text-foreground">23.8 GB</p>
              <p className="text-xs text-foreground/60 mt-2">of 100 GB</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-foreground/70 text-sm mb-2">Total Records</div>
              <p className="text-3xl font-bold text-foreground">49K</p>
              <p className="text-xs text-primary mt-2">+2,400 this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Biomarker Groups */}
        <div className="space-y-4">
          {Object.entries(filteredGroups).length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <Database className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">No datasets found</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(biomarkerGroups).map(([key, group]) => (
              <div key={key}>
                {/* Biomarker Header */}
                <button
                  onClick={() => toggleBiomarker(key)}
                  className="w-full mb-3"
                >
                  <Card className="border-border hover:border-primary/50 transition cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-2xl">{group.icon}</span>
                          <div className="text-left">
                            <h3 className="text-lg font-semibold text-foreground">
                              {group.title}
                            </h3>
                            <p className="text-sm text-foreground/60">{group.description}</p>
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            {group.datasets.length} dataset{group.datasets.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-foreground/60 transition-transform ${
                            expandedBiomarker === key ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </button>

                {/* Datasets in Category */}
                {expandedBiomarker === key && (
                  <div className="space-y-3 ml-4 mb-4">
                    {group.datasets.map((dataset) => (
                      <Card key={dataset.id} className="border-border hover:border-primary/50 transition">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-foreground truncate">
                                  {dataset.name}
                                </h3>
                                <Badge
                                  variant={dataset.status === 'active' ? 'default' : 'secondary'}
                                >
                                  {dataset.status}
                                </Badge>
                              </div>
                              <p className="text-foreground/70 text-sm mb-4">{dataset.description}</p>

                              <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                                <div>
                                  <span className="text-foreground/40">Size:</span> {dataset.size}
                                </div>
                                <div>
                                  <span className="text-foreground/40">Records:</span> {dataset.records.toLocaleString()}
                                </div>
                                <div>
                                  <span className="text-foreground/40">Version:</span> {dataset.version}
                                </div>
                                <div>
                                  <span className="text-foreground/40">Created:</span> {dataset.created}
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Suspense>
  )
}
