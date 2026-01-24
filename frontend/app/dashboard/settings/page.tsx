'use client'

import { Badge } from "@/components/ui/badge"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bell, Lock, Users, Zap, Eye } from 'lucide-react'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70">Manage your account</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-2xl">
                  R
                </div>
                <Button variant="outline">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input id="fullname" placeholder="Dr. Jane Smith" defaultValue="Dr. Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@institution.edu" defaultValue="jane@institution.edu" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input id="institution" placeholder="Medical Research Institute" defaultValue="Medical Research Institute" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Senior Researcher" defaultValue="Senior Researcher" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  placeholder="Tell us about your research focus..."
                  defaultValue="Focusing on motor symptom progression and treatment response prediction."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="text-black">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Model Training Complete</p>
                    <p className="text-sm text-foreground/60">Get notified when your models finish training</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">New Insights Generated</p>
                    <p className="text-sm text-foreground/60">Receive alerts for new research insights</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Dataset Updates</p>
                    <p className="text-sm text-foreground/60">Notify when datasets are updated or modified</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Team Activity</p>
                    <p className="text-sm text-foreground/60">Get updates on team member activities</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Weekly Digest</p>
                    <p className="text-sm text-foreground/60">Receive a weekly summary of activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="text-black">
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="text-black">
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Authenticator App</p>
                  <p className="text-sm text-foreground/60">Use an authenticator app for 2FA</p>
                </div>
                <Switch />
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your active sessions across devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Chrome on macOS</p>
                    <p className="text-sm text-foreground/60">Current session</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Safari on iPhone</p>
                    <p className="text-sm text-foreground/60">Last active: 2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Sign Out</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your research team and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2 text-black">
                <Users className="w-4 h-4 text-black" />
                Invite Team Member
              </Button>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      J
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Dr. Jane Smith</p>
                      <p className="text-xs text-foreground/60">jane@institution.edu • Admin</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-foreground/40" />
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                      A
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Dr. Alex Kim</p>
                      <p className="text-xs text-foreground/60">alex@institution.edu • Researcher</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-foreground/40" />
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 font-semibold">
                      S
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Dr. Sarah Johnson</p>
                      <p className="text-xs text-foreground/60">sarah@institution.edu • Clinician</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-foreground/40" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect external services and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Zap className="w-4 h-4" />
                Connect Service
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
