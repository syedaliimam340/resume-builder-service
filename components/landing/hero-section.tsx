'use client'

import { ArrowRight, FileText, Download, Palette, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  'No sign-up required',
  'Free professional templates',
  'PDF & Word download',
  'Save & edit anytime',
]

export function HeroSection() {
  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-6">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Free Resume Templates</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight mb-6">
              Create your perfect
              <span className="text-primary"> resume in minutes</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Choose from beautifully designed templates, customize your content, 
              and download your professional resume instantly. No sign-up needed.
            </p>

            {/* Benefits list */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={scrollToTemplates}
                className="text-base px-8 gap-2 group"
              >
                Browse Templates
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-base px-8"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right side - Resume preview mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              {/* Floating cards effect */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-2xl blur-xl" />
              
              {/* Resume mockup */}
              <div className="relative bg-card border border-border rounded-xl p-6 shadow-2xl shadow-primary/5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">John Doe</h3>
                    <p className="text-sm text-primary">Software Engineer</p>
                    <p className="text-xs text-muted-foreground mt-1">San Francisco, CA</p>
                  </div>
                </div>

                {/* Content sections */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Experience</h4>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full w-full" />
                      <div className="h-2 bg-muted rounded-full w-4/5" />
                      <div className="h-2 bg-muted rounded-full w-3/4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'AWS'].map((skill) => (
                        <span key={skill} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -right-4 top-1/4 bg-card border border-border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">6 Templates</span>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-1/4 bg-card border border-border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">PDF Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
