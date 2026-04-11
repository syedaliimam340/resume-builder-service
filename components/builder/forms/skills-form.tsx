'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SkillCategory } from '@/lib/types'

const skillLevels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Elementary' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
]

export function SkillsForm() {
  const { resume, setSkills, nextStep, prevStep } = useResumeStore()
  const [newCategory, setNewCategory] = useState('')
  const [newSkill, setNewSkill] = useState({ category: '', name: '', level: 3 as 1 | 2 | 3 | 4 | 5 })

  const handleAddCategory = () => {
    if (newCategory.trim() && !resume.skills.find(s => s.category === newCategory.trim())) {
      setSkills([...resume.skills, { category: newCategory.trim(), items: [] }])
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (categoryName: string) => {
    setSkills(resume.skills.filter(s => s.category !== categoryName))
  }

  const handleAddSkill = (categoryName: string) => {
    if (newSkill.name.trim() && newSkill.category === categoryName) {
      const updatedSkills = resume.skills.map(cat => {
        if (cat.category === categoryName) {
          return {
            ...cat,
            items: [...cat.items, { name: newSkill.name.trim(), level: newSkill.level }],
          }
        }
        return cat
      })
      setSkills(updatedSkills)
      setNewSkill({ category: '', name: '', level: 3 })
    }
  }

  const handleRemoveSkill = (categoryName: string, skillName: string) => {
    const updatedSkills = resume.skills.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          items: cat.items.filter(item => item.name !== skillName),
        }
      }
      return cat
    })
    setSkills(updatedSkills)
  }

  const handleUpdateSkillLevel = (categoryName: string, skillName: string, level: 1 | 2 | 3 | 4 | 5) => {
    const updatedSkills = resume.skills.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.name === skillName ? { ...item, level } : item
          ),
        }
      }
      return cat
    })
    setSkills(updatedSkills)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Skills</h3>
        <p className="text-sm text-muted-foreground">Add your technical and professional skills</p>
      </div>

      {/* Skill categories */}
      <div className="space-y-4">
        {resume.skills.map((category) => (
          <div key={category.category} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">{category.category}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(category.category)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {/* Skills in category */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category.items.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md"
                >
                  <span className="text-sm text-foreground">{skill.name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleUpdateSkillLevel(category.category, skill.name, level as 1 | 2 | 3 | 4 | 5)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          level <= skill.level ? 'bg-primary' : 'bg-border'
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(category.category, skill.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add skill to category */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill.category === category.category ? newSkill.name : ''}
                onChange={(e) => setNewSkill({ ...newSkill, category: category.category, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSkill(category.category)
                  }
                }}
                className="flex-1"
              />
              <select
                value={newSkill.category === category.category ? newSkill.level : 3}
                onChange={(e) => setNewSkill({ ...newSkill, category: category.category, level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                className="w-32 px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAddSkill(category.category)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new category */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill category (e.g., Programming Languages, Soft Skills)..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddCategory()
            }
          }}
          className="flex-1"
        />
        <Button variant="outline" onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Suggested categories */}
      {resume.skills.length === 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">Quick start with suggested categories:</p>
          <div className="flex flex-wrap gap-2">
            {['Technical Skills', 'Programming Languages', 'Tools & Technologies', 'Soft Skills'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSkills([...resume.skills, { category: cat, items: [] }])
                }}
                className="px-3 py-1.5 text-sm bg-card border border-border rounded-md text-foreground hover:border-primary/50 transition-colors"
              >
                + {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="pt-4 border-t border-border flex gap-3">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1 gap-2 group">
          Continue to Extras
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
