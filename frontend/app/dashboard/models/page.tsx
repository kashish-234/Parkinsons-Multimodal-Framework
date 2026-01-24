'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, Play, Square, Settings, MoreVertical, TrendingUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ModelsPage() {
  const [models] = useState([
    {
      id: 1,
      name: 'Tremor Detection Model',
      version: 'v2.1',
      accuracy: 94.2,
      status: 'active',
      trained: 'Jan 8, 2024',
      dataset: 'Tremor Recording Dataset',
      model_type: 'CNN',
      training_time: '4.5 hours',
      performance: 'Production',
    },
    {
      id: 2,
      name: 'Disease Progression Predictor',
      version: 'v1.8',
      accuracy: 87.6,
      status: 'active',
      trained: 'Dec 28, 2023',
      dataset: 'Q1 2024 Patient Cohort',
      model_type: 'LSTM',
      training_time: '6.2 hours',
      performance: 'Production',
    },
    {
      id: 3,
      name: 'Medication Response Classification',
      version: 'v1.0',
      accuracy: 81.4,
      status: 'training',
      trained: 'In progress',
      dataset: 'Medication Response Tracking',
      model_type: 'Random Forest',
      training_time: '2.8 hours',
      performance: '67%',
    },
    {
      id: 4,
      name: 'Cognitive Decline Detector',
      version: 'v1.2',
      accuracy: 89.7,
      status: 'active',
      trained: 'Nov 15, 2023',
      dataset: 'Cognitive Assessment Data',
      model_type: 'Gradient Boosting',
      training_time: '3.1 hours',
      performance: 'Production',
    },
    {
      id: 5,
      name: 'Biomarker Predictor',
      version: 'v0.9',
      accuracy: 76.3,
      status: 'archived',
      trained: 'Oct 20, 2023',
      dataset: 'Biomarker Analysis',
      model_type: 'SVM',
      training_time: '1.8 hours',
      performance: 'Archived',
    },
  ])

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">ML Models</h1>
          <p className="text-foreground/70">Train and manage models</p>
        </div>
        <Button className="gap-2 w-full md:w-auto text-black">
          <Brain className="w-4 h-4 text-black" />
          Train Model
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-foreground/70 text-sm mb-2">Total Models</div>
            <p className="text-3xl font-bold text-foreground">7</p>
            <p className="text-xs text-primary mt-2">4 active</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-foreground/70 text-sm mb-2">Avg Accuracy</div>
            <p className="text-3xl font-bold text-foreground">87.4%</p>
            <p className="text-xs text-primary mt-2">+2.3% this month</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-foreground/70 text-sm mb-2">In Training</div>
            <p className="text-3xl font-bold text-foreground">1</p>
            <p className="text-xs text-foreground/60 mt-2">67% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <div className="space-y-3">
        {models.map((model) => (
          <Card key={model.id} className="border-border hover:border-primary/50 transition">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
                    <Badge variant={model.status === 'active' ? 'default' : model.status === 'training' ? 'secondary' : 'outline'}>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-foreground/60 text-xs">Version</p>
                      <p className="text-foreground font-medium">{model.version}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Type</p>
                      <p className="text-foreground font-medium">{model.model_type}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Trained</p>
                      <p className="text-foreground font-medium">{model.trained}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Dataset</p>
                      <p className="text-foreground font-medium text-sm truncate">{model.dataset}</p>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {model.status === 'active' && (
                      <>
                        <DropdownMenuItem>
                          <Play className="w-4 h-4 mr-2" />
                          Make Predictions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Accuracy and Performance */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Accuracy</span>
                  <span className="text-foreground font-medium">{model.accuracy}%</span>
                </div>
                <Progress value={model.accuracy} className="h-2" />
              </div>

              {model.status === 'training' && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Training Progress</span>
                    <span className="text-primary font-medium">{model.performance}</span>
                  </div>
                  <Progress value={parseFloat(model.performance)} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
