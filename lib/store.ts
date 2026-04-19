'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeContent, ResumeCustomizations, BuilderStep } from './types'

// ============================================
// DEFAULT VALUES
// ============================================

export const defaultResumeContent: ResumeContent = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    photo: undefined,
  },
  summary: '',
  jobDescription: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  projects: [],
  sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'certifications', 'languages', 'projects'],
}

export const defaultCustomizations: ResumeCustomizations = {
  fontFamily: 'Inter',
  fontSize: 'medium',
  primaryColor: '#0f172a',
  accentColor: '#3b82f6',
  spacing: 'normal',
  showPhoto: false,
}

// ============================================
// STORE INTERFACE
// ============================================

interface ResumeStore {
  // State
  resume: ResumeContent
  customizations: ResumeCustomizations
  selectedTemplateId: string
  currentStep: BuilderStep
  isDirty: boolean
  lastSaved: Date | null

  // Actions - Resume Content
  setResume: (resume: ResumeContent) => void
  updatePersonalInfo: (info: Partial<ResumeContent['personalInfo']>) => void
  updateSummary: (summary: string) => void
  updateJobDescription: (jobDescription: string) => void
  addExperience: (experience: ResumeContent['experience'][0]) => void
  updateExperience: (id: string, experience: Partial<ResumeContent['experience'][0]>) => void
  removeExperience: (id: string) => void
  addEducation: (education: ResumeContent['education'][0]) => void
  updateEducation: (id: string, education: Partial<ResumeContent['education'][0]>) => void
  removeEducation: (id: string) => void
  setSkills: (skills: ResumeContent['skills']) => void
  addCertification: (certification: ResumeContent['certifications'][0]) => void
  removeCertification: (id: string) => void
  setLanguages: (languages: ResumeContent['languages']) => void
  addProject: (project: ResumeContent['projects'][0]) => void
  updateProject: (id: string, project: Partial<ResumeContent['projects'][0]>) => void
  removeProject: (id: string) => void
  reorderSections: (newOrder: string[]) => void

  // Actions - Customizations
  setCustomizations: (customizations: ResumeCustomizations) => void
  updateCustomization: <K extends keyof ResumeCustomizations>(key: K, value: ResumeCustomizations[K]) => void

  // Actions - Navigation
  setCurrentStep: (step: BuilderStep) => void
  nextStep: () => void
  prevStep: () => void

  // Actions - Template
  setSelectedTemplateId: (id: string) => void

  // Actions - Save State
  markSaved: () => void
  resetStore: () => void
}

const STEP_ORDER: BuilderStep[] = ['personal', 'experience', 'education', 'skills', 'extras']

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial State
      resume: defaultResumeContent,
      customizations: defaultCustomizations,
      selectedTemplateId: 'modern-professional',
      currentStep: 'personal',
      isDirty: false,
      lastSaved: null,

      // Resume Content Actions
      setResume: (resume) => set({ resume, isDirty: true }),

      updatePersonalInfo: (info) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, ...info },
          },
          isDirty: true,
        })),

      updateSummary: (summary) =>
        set((state) => ({
          resume: { ...state.resume, summary },
          isDirty: true,
        })),

      updateJobDescription: (jobDescription) =>
        set((state) => ({
          resume: { ...state.resume, jobDescription },
          isDirty: true,
        })),

      addExperience: (experience) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [...state.resume.experience, experience],
          },
          isDirty: true,
        })),

      updateExperience: (id, experience) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((exp) =>
              exp.id === id ? { ...exp, ...experience } : exp
            ),
          },
          isDirty: true,
        })),

      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((exp) => exp.id !== id),
          },
          isDirty: true,
        })),

      addEducation: (education) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, education],
          },
          isDirty: true,
        })),

      updateEducation: (id, education) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((edu) =>
              edu.id === id ? { ...edu, ...education } : edu
            ),
          },
          isDirty: true,
        })),

      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((edu) => edu.id !== id),
          },
          isDirty: true,
        })),

      setSkills: (skills) =>
        set((state) => ({
          resume: { ...state.resume, skills },
          isDirty: true,
        })),

      addCertification: (certification) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: [...state.resume.certifications, certification],
          },
          isDirty: true,
        })),

      removeCertification: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter((cert) => cert.id !== id),
          },
          isDirty: true,
        })),

      setLanguages: (languages) =>
        set((state) => ({
          resume: { ...state.resume, languages },
          isDirty: true,
        })),

      addProject: (project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [...state.resume.projects, project],
          },
          isDirty: true,
        })),

      updateProject: (id, project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((proj) =>
              proj.id === id ? { ...proj, ...project } : proj
            ),
          },
          isDirty: true,
        })),

      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((proj) => proj.id !== id),
          },
          isDirty: true,
        })),

      reorderSections: (newOrder) =>
        set((state) => ({
          resume: { ...state.resume, sectionOrder: newOrder },
          isDirty: true,
        })),

      // Customization Actions
      setCustomizations: (customizations) => set({ customizations, isDirty: true }),

      updateCustomization: (key, value) =>
        set((state) => ({
          customizations: { ...state.customizations, [key]: value },
          isDirty: true,
        })),

      // Navigation Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const currentIndex = STEP_ORDER.indexOf(get().currentStep)
        if (currentIndex < STEP_ORDER.length - 1) {
          set({ currentStep: STEP_ORDER[currentIndex + 1] })
        }
      },

      prevStep: () => {
        const currentIndex = STEP_ORDER.indexOf(get().currentStep)
        if (currentIndex > 0) {
          set({ currentStep: STEP_ORDER[currentIndex - 1] })
        }
      },

      // Template Actions
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id, isDirty: true }),

      // Save State Actions
      markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

      resetStore: () =>
        set({
          resume: defaultResumeContent,
          customizations: defaultCustomizations,
          selectedTemplateId: 'modern-professional',
          currentStep: 'personal',
          isDirty: false,
          lastSaved: null,
        }),
    }),
    {
      name: 'resume-builder-storage',
      partialize: (state) => ({
        resume: state.resume,
        customizations: state.customizations,
        selectedTemplateId: state.selectedTemplateId,
      }),
    }
  )
)
