'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Database, Brain, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Patients',
      value: '254',
      change: '+12%',
      icon: Users,
      href: '/dashboard/patients',
    },
    {
      title: 'Datasets',
      value: '18',
      change: '+3 this month',
      icon: Database,
      href: '/dashboard/datasets',
    },
    {
      title: 'ML Models',
      value: '7',
      change: '2 in training',
      icon: Brain,
      href: '/dashboard/models',
    },
  ]

  const recentActivity = [
    {
      title: 'Model Training Complete',
      description: 'Tremor Detection Model v2.1 completed with 94.2% accuracy',
      timestamp: '2 hours ago',
      icon: Brain,
    },
    {
      title: 'New Patient Data Imported',
      description: '156 patient records imported from Boston Medical Center',
      timestamp: '4 hours ago',
      icon: Users,
    },
    {
      title: 'Dataset Published',
      description: 'Q1 Research Dataset made available for team collaboration',
      timestamp: '1 day ago',
      icon: Database,
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-foreground/70">Your research overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="hover:border-primary/50 transition cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon
                return (
                  <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-foreground/70">{activity.description}</p>
                      <p className="text-xs text-foreground/50 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Events */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/patients">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Users className="w-4 h-4" />
                  Add Patient
                </Button>
              </Link>
              <Link href="/dashboard/datasets">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Database className="w-4 h-4" />
                  Upload Dataset
                </Button>
              </Link>
              <Link href="/dashboard/models">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Brain className="w-4 h-4" />
                  Train Model
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          {/* <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Team Meeting</p>
                  <p className="text-xs text-foreground/60">Tomorrow at 2 PM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Model Review</p>
                  <p className="text-xs text-foreground/60">Friday at 10 AM</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
