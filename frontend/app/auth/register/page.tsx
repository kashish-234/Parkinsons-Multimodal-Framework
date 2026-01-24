'use client'

import React from "react"

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Brain, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'role' | 'form' | 'success'>('role')
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    institution: '',
    password: '',
    confirmPassword: '',
  })

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role })
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    // Simulate registration - in a real app, this would call your auth API
    setTimeout(() => {
      setStep('success')
      setIsLoading(false)
      
      setTimeout(() => {
        sessionStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: formData.name,
          role: formData.role,
        }))
        router.push('/dashboard')
      }, 2000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">ParkinsonHub</span>
        </Link>

        {step === 'role' && (
          <Card className="border-border">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>Choose your role to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => handleRoleSelect('clinician')}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
              >
                <h3 className="font-semibold text-foreground mb-1">Clinician</h3>
                <p className="text-sm text-foreground/60">Manage patient data and clinical insights</p>
              </button>

              <button
                onClick={() => handleRoleSelect('researcher')}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
              >
                <h3 className="font-semibold text-foreground mb-1">Researcher</h3>
                <p className="text-sm text-foreground/60">Analyze datasets and train ML models</p>
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition text-left"
              >
                <h3 className="font-semibold text-foreground mb-1">Institute Admin</h3>
                <p className="text-sm text-foreground/60">Manage institutional resources and team</p>
              </button>
            </CardContent>
          </Card>
        )}

        {step === 'form' && (
          <Card className="border-border">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
              <CardDescription>Set up your {formData.role} account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Dr. Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="Medical Research Institute"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setStep('role')
                      setFormData({ ...formData, role: '' })
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 text-black"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Account'}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-sm text-foreground/70">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card className="border-border border-primary/50 bg-primary/5">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
              <p className="text-foreground/70 mb-6">
                Welcome to ParkinsonHub. Redirecting to your dashboard...
              </p>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" />
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-center text-foreground/60 mt-6">
          By signing up, you agree to our{' '}
          <Link href="#" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
