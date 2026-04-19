'use client'

import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Link as LinkIcon, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function PersonalInfoForm() {
  const { resume, updatePersonalInfo, updateSummary, nextStep } = useResumeStore()
  const { personalInfo, summary } = resume

  const [newLink, setNewLink] = useState({ type: 'linkedin' as const, url: '' })
  const [questionnaire, setQuestionnaire] = useState({
    yearsExperience: '',
    specialty: '',
    strengths: '',
    achievement: '',
  })

  const hasQuestionnaireData = Object.values(questionnaire).some((value) => value.trim())

  const buildSummaryFromQuestionnaire = () => {
    const title = personalInfo.title.trim()
    const years = questionnaire.yearsExperience.trim()
    const specialty = questionnaire.specialty.trim()
    const strengths = questionnaire.strengths.trim()
    const achievement = questionnaire.achievement.trim()

    const introParts: string[] = []
    if (title) {
      introParts.push(title)
    }
    if (years) {
      introParts.push(`${years} years of experience`)
    }

    let intro = ''
    if (introParts.length === 2) {
      intro = `${introParts[0]} with ${introParts[1]}`
    } else if (introParts.length === 1) {
      intro = introParts[0]
    }

    if (specialty) {
      intro = intro ? `${intro} in ${specialty}` : `Professional focused in ${specialty}`
    }

    const sentences: string[] = []
    if (intro) {
      sentences.push(`${intro}.`)
    }
    if (strengths) {
      sentences.push(`Known for ${strengths}.`)
    }
    if (achievement) {
      sentences.push(`Notable achievement: ${achievement}.`)
    }

    const summaryText = sentences.join(' ').trim()
    if (summaryText) {
      updateSummary(summaryText)
    }
  }

  const handleAddLink = () => {
    if (newLink.url) {
      updatePersonalInfo({
        links: [...personalInfo.links, { type: newLink.type, url: newLink.url }],
      })
      setNewLink({ type: 'linkedin', url: '' })
    }
  }

  const handleRemoveLink = (index: number) => {
    updatePersonalInfo({
      links: personalInfo.links.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Personal Information</h3>
        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          />
        </div>

        {/* Professional Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title *</Label>
          <Input
            id="title"
            placeholder="Senior Software Engineer"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo({ title: e.target.value })}
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          />
        </div>

        {/* Links */}
        <div className="space-y-3">
          <Label>Links</Label>
          {personalInfo.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-md">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground truncate">{link.url}</span>
                <span className="text-xs text-primary uppercase">{link.type}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveLink(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <select
              value={newLink.type}
              onChange={(e) => setNewLink({ ...newLink, type: e.target.value as typeof newLink.type })}
              className="w-28 px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
              <option value="portfolio">Portfolio</option>
              <option value="other">Other</option>
            </select>
            <Input
              placeholder="https://..."
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={handleAddLink}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3 p-4 border border-dashed border-border rounded-lg">
          <div>
            <Label>Local Summary Questionnaire</Label>
            <p className="text-xs text-muted-foreground">
              Answer a few quick questions to generate a summary locally.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="summary-years">Years of Experience</Label>
              <Input
                id="summary-years"
                placeholder="5+"
                value={questionnaire.yearsExperience}
                onChange={(e) => setQuestionnaire({ ...questionnaire, yearsExperience: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary-specialty">Specialty / Industry</Label>
              <Input
                id="summary-specialty"
                placeholder="Full-stack development"
                value={questionnaire.specialty}
                onChange={(e) => setQuestionnaire({ ...questionnaire, specialty: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary-strengths">Key Strengths</Label>
            <Input
              id="summary-strengths"
              placeholder="scalable systems, stakeholder communication"
              value={questionnaire.strengths}
              onChange={(e) => setQuestionnaire({ ...questionnaire, strengths: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary-achievement">Top Achievement</Label>
            <Textarea
              id="summary-achievement"
              placeholder="Led migration that reduced page load time by 40%."
              value={questionnaire.achievement}
              onChange={(e) => setQuestionnaire({ ...questionnaire, achievement: e.target.value })}
              rows={2}
            />
          </div>
          <Button variant="outline" onClick={buildSummaryFromQuestionnaire} disabled={!hasQuestionnaireData}>
            Generate Summary
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            placeholder="A brief overview of your professional background and career goals..."
            value={summary}
            onChange={(e) => updateSummary(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            2-4 sentences highlighting your key qualifications and career objectives.
          </p>
        </div>
      </div>

      {/* Next Step */}
      <div className="pt-4 border-t border-border">
        <Button onClick={nextStep} className="w-full gap-2 group">
          Continue to Experience
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
