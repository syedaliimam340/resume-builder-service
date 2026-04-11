'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { StepNavigation } from './step-navigation'
import { PersonalInfoForm } from './forms/personal-info-form'
import { ExperienceForm } from './forms/experience-form'
import { EducationForm } from './forms/education-form'
import { SkillsForm } from './forms/skills-form'
import { ExtrasForm } from './forms/extras-form'
import { TemplateSelector } from './template-selector'
import { ResumePreview } from './resume-preview'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export function BuilderSection() {
  const { currentStep } = useResumeStore()
  const [showPreview, setShowPreview] = useState(false)

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoForm />
      case 'experience':
        return <ExperienceForm />
      case 'education':
        return <EducationForm />
      case 'skills':
        return <SkillsForm />
      case 'extras':
        return <ExtrasForm />
      default:
        return <PersonalInfoForm />
    }
  }

  const scrollToExport = () => {
    document.getElementById('export')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="builder" className="py-24 min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container relative z-10 px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Build Your Resume
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill in your details, choose a template, and watch your resume come to life.
          </p>
        </div>

        {/* Step navigation */}
        <div className="mb-8">
          <StepNavigation />
        </div>

        {/* Main builder area */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6">
              {renderStepContent()}
            </div>

            {/* Template selector (shown on smaller screens) */}
            <div className="mt-6 lg:hidden">
              <TemplateSelector />
            </div>

            {/* Mobile preview toggle */}
            <div className="lg:hidden mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
            </div>

            {/* Mobile preview panel */}
            {showPreview && (
              <div className="lg:hidden mt-6">
                <ResumePreview />
              </div>
            )}
          </div>

          {/* Right side - Preview & Templates */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Template selector */}
            <TemplateSelector />

            {/* Live preview */}
            <ResumePreview />

            {/* Continue to export button */}
            <Button 
              size="lg" 
              className="w-full gap-2 group"
              onClick={scrollToExport}
            >
              Continue to Export
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
