'use client'

import { 
  FileText, 
  Sparkles, 
  Download, 
  Layout, 
  Shield, 
  Zap,
  Clock,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Layout,
    title: '50+ Templates',
    description: 'Professional designs for every industry. Modern, classic, creative, and minimal styles.',
  },
  {
    icon: Sparkles,
    title: 'AI Suggestions',
    description: 'Get intelligent recommendations for bullet points, skills, and summary sections.',
  },
  {
    icon: Zap,
    title: 'ATS Optimized',
    description: 'Every template is tested against applicant tracking systems for maximum compatibility.',
  },
  {
    icon: Download,
    title: 'Multiple Formats',
    description: 'Export as PDF, DOCX, TXT, or PNG. Perfect for any application requirement.',
  },
  {
    icon: Clock,
    title: 'Real-time Preview',
    description: 'See your changes instantly. No more guessing how your resume will look.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. Delete anytime with one click.',
  },
]

const stats = [
  { value: '2M+', label: 'Resumes Created' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '50+', label: 'Templates' },
  { value: '4.9', label: 'User Rating' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything you need to create the perfect resume
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Powerful features designed to help you stand out from the competition 
            and land your dream job.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-6 bg-card border border-border rounded-2xl">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`text-center ${index < stats.length - 1 ? 'md:border-r md:border-border' : ''}`}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to create your professional resume?
          </p>
          <button
            onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Start Building Now
            <span className="text-lg">{'>'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
