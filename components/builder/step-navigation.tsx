'use client'

import { useResumeStore } from '@/lib/store'
import type { BuilderStep } from '@/lib/types'
import { cn } from '@/lib/utils'
import { User, Briefcase, GraduationCap, Wrench, MoreHorizontal, Check } from 'lucide-react'

const steps: { id: BuilderStep; label: string; icon: typeof User }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'extras', label: 'Extras', icon: MoreHorizontal },
]

export function StepNavigation() {
  const { currentStep, setCurrentStep, resume } = useResumeStore()

  const getStepStatus = (stepId: BuilderStep): 'current' | 'completed' | 'upcoming' => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    const stepIndex = steps.findIndex(s => s.id === stepId)

    if (stepId === currentStep) return 'current'
    if (stepIndex < currentIndex) return 'completed'
    return 'upcoming'
  }

  const isStepFilled = (stepId: BuilderStep): boolean => {
    switch (stepId) {
      case 'personal':
        return !!(resume.personalInfo.fullName && resume.personalInfo.email)
      case 'experience':
        return resume.experience.length > 0
      case 'education':
        return resume.education.length > 0
      case 'skills':
        return resume.skills.length > 0
      case 'extras':
        return resume.certifications.length > 0 || resume.languages.length > 0 || resume.projects.length > 0
      default:
        return false
    }
  }

  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const isFilled = isStepFilled(step.id)

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full',
                  status === 'current' && 'bg-primary/10 border border-primary/30',
                  status !== 'current' && 'hover:bg-muted'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    status === 'current' && 'bg-primary text-primary-foreground',
                    status === 'completed' && isFilled && 'bg-primary/20 text-primary',
                    status === 'completed' && !isFilled && 'bg-muted text-muted-foreground',
                    status === 'upcoming' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {status === 'completed' && isFilled ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-left">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      status === 'current' && 'text-foreground',
                      status !== 'current' && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isFilled ? 'Completed' : 'Not started'}
                  </p>
                </div>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-px w-8 mx-2',
                    getStepStatus(steps[index + 1].id) !== 'upcoming'
                      ? 'bg-primary/50'
                      : 'bg-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-2 -mx-4 px-4">
        {steps.map((step) => {
          const status = getStepStatus(step.id)
          const isFilled = isStepFilled(step.id)

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all',
                status === 'current' && 'bg-primary text-primary-foreground',
                status !== 'current' && 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {isFilled && status !== 'current' ? (
                <Check className="h-4 w-4" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{step.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
