'use client'

import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { TemplateGallery } from '@/components/templates/template-gallery'
import { AboutSection } from '@/components/landing/about-section'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Template Gallery & Builder */}
      <TemplateGallery />

      {/* About / Contact Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
