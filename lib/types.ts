// ============================================
// RESUME DATA TYPES
// ============================================

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  links: { type: 'linkedin' | 'github' | 'portfolio' | 'other'; url: string; label?: string }[]
  photo?: string
}

export interface ExperienceItem {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string | 'present'
  bullets: string[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
  honors?: string[]
}

export interface SkillCategory {
  category: string
  items: { name: string; level: 1 | 2 | 3 | 4 | 5 }[]
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface LanguageItem {
  language: string
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  url?: string
  technologies: string[]
}

export interface ResumeContent {
  personalInfo: PersonalInfo
  summary: string
  jobDescription: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillCategory[]
  certifications: CertificationItem[]
  languages: LanguageItem[]
  projects: ProjectItem[]
  sectionOrder: string[]
}

export interface ResumeCustomizations {
  fontFamily: string
  fontSize: 'small' | 'medium' | 'large'
  primaryColor: string
  accentColor: string
  spacing: 'compact' | 'normal' | 'relaxed'
  showPhoto: boolean
}

// ============================================
// TEMPLATE TYPES
// ============================================

export interface TemplateData {
  id: string
  name: string
  slug: string
  description: string
  thumbnailUrl: string
  category: 'MODERN' | 'CLASSIC' | 'CREATIVE' | 'MINIMAL' | 'PROFESSIONAL'
  tierRequired: 'FREE' | 'PRO' | 'ENTERPRISE'
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ============================================
// BUILDER STATE TYPES
// ============================================

export type BuilderStep = 'personal' | 'experience' | 'education' | 'skills' | 'extras'

export interface BuilderState {
  currentStep: BuilderStep
  resume: ResumeContent
  selectedTemplateId: string
  customizations: ResumeCustomizations
  isDirty: boolean
  lastSaved: Date | null
}

// ============================================
// EXPORT TYPES
// ============================================

export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'png' | 'json'
