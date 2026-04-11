'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowRight, ArrowLeft, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExperienceItem } from '@/lib/types'

export function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience, nextStep, prevStep } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newExperience, setNewExperience] = useState<Omit<ExperienceItem, 'id'>>({
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    bullets: [''],
  })

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.title) {
      addExperience({
        ...newExperience,
        id: crypto.randomUUID(),
        bullets: newExperience.bullets.filter(b => b.trim() !== ''),
      })
      setNewExperience({
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        bullets: [''],
      })
      setIsAddingNew(false)
    }
  }

  const handleUpdateBullet = (expId: string, bulletIndex: number, value: string) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp) {
      const newBullets = [...exp.bullets]
      newBullets[bulletIndex] = value
      updateExperience(expId, { bullets: newBullets })
    }
  }

  const handleAddBullet = (expId: string) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, { bullets: [...exp.bullets, ''] })
    }
  }

  const handleRemoveBullet = (expId: string, bulletIndex: number) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp && exp.bullets.length > 1) {
      updateExperience(expId, { bullets: exp.bullets.filter((_, i) => i !== bulletIndex) })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Work Experience</h3>
        <p className="text-sm text-muted-foreground">Add your professional experience</p>
      </div>

      {/* Existing experiences */}
      <div className="space-y-3">
        {resume.experience.map((exp) => (
          <div
            key={exp.id}
            className={cn(
              'border border-border rounded-lg transition-all',
              expandedId === exp.id ? 'bg-card' : 'bg-muted/30'
            )}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{exp.title}</p>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
                {expandedId === exp.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded content */}
            {expandedId === exp.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      placeholder="Present"
                      value={exp.endDate === 'present' ? '' : exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value || 'present' })}
                    />
                  </div>
                </div>

                {/* Bullet points */}
                <div className="space-y-2">
                  <Label>Key Achievements</Label>
                  {exp.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(exp.id, idx, e.target.value)}
                        placeholder="Describe an achievement or responsibility..."
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBullet(exp.id, idx)}
                        disabled={exp.bullets.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBullet(exp.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Bullet
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove Experience
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new experience */}
      {isAddingNew ? (
        <div className="border border-primary/50 rounded-lg p-4 space-y-4 bg-card">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                value={newExperience.title}
                onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={newExperience.location}
                onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                placeholder="New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="month"
                value={newExperience.startDate}
                onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                placeholder="Present"
                value={newExperience.endDate === 'present' ? '' : newExperience.endDate}
                onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value || 'present' })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddExperience}>Save Experience</Button>
            <Button variant="ghost" onClick={() => setIsAddingNew(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setIsAddingNew(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      )}

      {/* Navigation */}
      <div className="pt-4 border-t border-border flex gap-3">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1 gap-2 group">
          Continue to Education
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
