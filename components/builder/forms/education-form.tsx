'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react'
import type { EducationItem } from '@/lib/types'

export function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation, nextStep, prevStep } = useResumeStore()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newEducation, setNewEducation] = useState<Omit<EducationItem, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    graduationDate: '',
    gpa: '',
    honors: [],
  })

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      addEducation({
        ...newEducation,
        id: crypto.randomUUID(),
      })
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
        honors: [],
      })
      setIsAddingNew(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Education</h3>
        <p className="text-sm text-muted-foreground">Add your educational background</p>
      </div>

      {/* Existing education */}
      <div className="space-y-3">
        {resume.education.map((edu) => (
          <div
            key={edu.id}
            className="border border-border rounded-lg p-4 bg-card space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{edu.degree} in {edu.field}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Graduation Date</Label>
                <Input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new education */}
      {isAddingNew ? (
        <div className="border border-primary/50 rounded-lg p-4 space-y-4 bg-card">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution *</Label>
              <Input
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                placeholder="Stanford University"
              />
            </div>
            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                value={newEducation.field}
                onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                placeholder="Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation Date</Label>
              <Input
                type="month"
                value={newEducation.graduationDate}
                onChange={(e) => setNewEducation({ ...newEducation, graduationDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>GPA</Label>
              <Input
                value={newEducation.gpa || ''}
                onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                placeholder="3.8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddEducation}>Save Education</Button>
            <Button variant="ghost" onClick={() => setIsAddingNew(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setIsAddingNew(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      )}

      {/* Navigation */}
      <div className="pt-4 border-t border-border flex gap-3">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1 gap-2 group">
          Continue to Skills
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
