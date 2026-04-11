'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ArrowLeft, Award, Globe, FolderOpen, X } from 'lucide-react'
import type { CertificationItem, LanguageItem, ProjectItem } from '@/lib/types'

type TabType = 'certifications' | 'languages' | 'projects'

export function ExtrasForm() {
  const { 
    resume, 
    addCertification, 
    removeCertification, 
    setLanguages,
    addProject,
    updateProject,
    removeProject,
    prevStep 
  } = useResumeStore()
  
  const [activeTab, setActiveTab] = useState<TabType>('certifications')

  // Certification state
  const [newCert, setNewCert] = useState<Omit<CertificationItem, 'id'>>({
    name: '',
    issuer: '',
    date: '',
    url: '',
  })

  // Language state
  const [newLanguage, setNewLanguage] = useState<LanguageItem>({
    language: '',
    proficiency: 'Intermediate',
  })

  // Project state
  const [newProject, setNewProject] = useState<Omit<ProjectItem, 'id'>>({
    name: '',
    description: '',
    url: '',
    technologies: [],
  })
  const [techInput, setTechInput] = useState('')

  const handleAddCertification = () => {
    if (newCert.name && newCert.issuer) {
      addCertification({ ...newCert, id: crypto.randomUUID() })
      setNewCert({ name: '', issuer: '', date: '', url: '' })
    }
  }

  const handleAddLanguage = () => {
    if (newLanguage.language && !resume.languages.find(l => l.language === newLanguage.language)) {
      setLanguages([...resume.languages, newLanguage])
      setNewLanguage({ language: '', proficiency: 'Intermediate' })
    }
  }

  const handleRemoveLanguage = (languageName: string) => {
    setLanguages(resume.languages.filter(l => l.language !== languageName))
  }

  const handleAddProject = () => {
    if (newProject.name) {
      addProject({ ...newProject, id: crypto.randomUUID() })
      setNewProject({ name: '', description: '', url: '', technologies: [] })
    }
  }

  const handleAddTech = () => {
    if (techInput.trim() && !newProject.technologies.includes(techInput.trim())) {
      setNewProject({ ...newProject, technologies: [...newProject.technologies, techInput.trim()] })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setNewProject({ ...newProject, technologies: newProject.technologies.filter(t => t !== tech) })
  }

  const scrollToExport = () => {
    document.getElementById('export')?.scrollIntoView({ behavior: 'smooth' })
  }

  const tabs = [
    { id: 'certifications' as const, label: 'Certifications', icon: Award, count: resume.certifications.length },
    { id: 'languages' as const, label: 'Languages', icon: Globe, count: resume.languages.length },
    { id: 'projects' as const, label: 'Projects', icon: FolderOpen, count: resume.projects.length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Additional Sections</h3>
        <p className="text-sm text-muted-foreground">Add certifications, languages, and projects</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          {resume.certifications.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer} - {cert.date}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="grid gap-4 p-4 border border-dashed border-border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Certification Name</Label>
                <Input
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="month"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Credential URL (Optional)</Label>
                <Input
                  value={newCert.url || ''}
                  onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <Button variant="outline" onClick={handleAddCertification}>
              <Plus className="h-4 w-4 mr-2" /> Add Certification
            </Button>
          </div>
        </div>
      )}

      {/* Languages Tab */}
      {activeTab === 'languages' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {resume.languages.map((lang) => (
              <div
                key={lang.language}
                className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg group"
              >
                <span className="text-foreground">{lang.language}</span>
                <span className="text-xs text-primary">{lang.proficiency}</span>
                <button
                  onClick={() => handleRemoveLanguage(lang.language)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 p-4 border border-dashed border-border rounded-lg">
            <Input
              value={newLanguage.language}
              onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
              placeholder="Language"
              className="flex-1"
            />
            <select
              value={newLanguage.proficiency}
              onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value as LanguageItem['proficiency'] })}
              className="w-36 px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground"
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <Button variant="outline" onClick={handleAddLanguage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {resume.projects.map((project) => (
            <div key={project.id} className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{project.name}</h4>
                <Button variant="ghost" size="icon" onClick={() => removeProject(project.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-4 p-4 border border-dashed border-border rounded-lg">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="E-commerce Platform"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Brief description of the project..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/20 text-primary rounded"
                  >
                    {tech}
                    <button onClick={() => handleRemoveTech(tech)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTech()
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={handleAddTech}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Project URL (Optional)</Label>
              <Input
                value={newProject.url || ''}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <Button variant="outline" onClick={handleAddProject}>
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="pt-4 border-t border-border flex gap-3">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={scrollToExport} className="flex-1 gap-2 group">
          Preview & Download
        </Button>
      </div>
    </div>
  )
}
