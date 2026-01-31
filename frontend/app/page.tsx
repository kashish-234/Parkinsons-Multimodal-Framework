'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Users, BarChart3, Lock, Zap, Database } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-foreground">ParkinsonHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition">Features</a>
            <a href="#research" className="text-foreground/70 hover:text-foreground transition">Research</a>
            <a href="#about" className="text-foreground/70 hover:text-foreground transition">About</a>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="text-black">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent-foreground">Advanced Research Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            Transform Parkinson's Research
          </h1>
          
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Unified platform for managing patient data, datasets, ML models, and research insights. Accelerate discovery with collaborative tools built for modern neuroscience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 text-black">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>

          <div className="pt-8 text-sm text-foreground/60">
            No credit card required. Trusted by leading research institutions.
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-foreground/70">Everything you need for comprehensive research management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: 'Patient Management',
              description: 'Centralized patient records with secure HIPAA-compliant storage and easy access controls.',
            },
            {
              icon: Database,
              title: 'Dataset Management',
              description: 'Organize, annotate, and version control research datasets with collaborative tools.',
            },
            {
              icon: Brain,
              title: 'ML Models',
              description: 'Train, evaluate, and deploy machine learning models for predictive analysis and insights.',
            },
            {
              icon: BarChart3,
              title: 'Research Analytics',
              description: 'Real-time dashboards with advanced visualization and statistical analysis tools.',
            },
            {
              icon: Lock,
              title: 'Security & Privacy',
              description: 'Enterprise-grade security with role-based access and comprehensive audit logs.',
            },
            {
              icon: Zap,
              title: 'Team Collaboration',
              description: 'Work seamlessly with team members with real-time updates and shared workflows.',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">AI-Powered Insights</h2>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Leverage advanced machine learning algorithms to uncover patterns in complex neurological data. Our models are built on years of research and continuously improve with new data.
            </p>
            <ul className="space-y-3">
              {[
                'Predictive symptom tracking',
                'Disease progression modeling',
                'Treatment response prediction',
                'Biomarker discovery',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/80">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg aspect-square flex items-center justify-center border border-primary/30">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-foreground/60 text-sm">Research Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Research?</h2>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join leading research institutions using ParkinsonHub to accelerate Parkinson's disease research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className='text-black'>
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/60">
          <p>&copy; 2026 ParkinsonHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
