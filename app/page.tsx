import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { BuilderSection } from '@/components/builder/builder-section'
import { ExportSection } from '@/components/export/export-section'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Scroll 1: Landing / Hero */}
      <HeroSection />

      {/* Features */}
      <FeaturesSection />

      {/* Scroll 2: Resume Builder */}
      <BuilderSection />

      {/* Scroll 3: Preview & Export */}
      <ExportSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
