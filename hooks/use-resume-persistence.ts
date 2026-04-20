'use client'

import { useEffect, useRef } from 'react'
import { useResumeStore, defaultResumeContent, defaultCustomizations } from '@/lib/store'

/**
 * Custom hook that manages resume data persistence.
 * Validates store data on mount and provides recovery mechanisms.
 */
export function useResumePersistence() {
  const { resume, customizations, setResume, setCustomizations } = useResumeStore()
  const hasValidated = useRef(false)

  useEffect(() => {
    if (hasValidated.current) return
    hasValidated.current = true

    // Validate personal info exists
    if (!resume.personalInfo) {
      setResume({ ...defaultResumeContent })
      return
    }

    // Repair any missing array fields
    let needsRepair = false
    const repairedResume = { ...resume }

    if (!Array.isArray(resume.experience)) {
      repairedResume.experience = []
      needsRepair = true
    }
    if (!Array.isArray(resume.education)) {
      repairedResume.education = []
      needsRepair = true
    }
    if (!Array.isArray(resume.skills)) {
      repairedResume.skills = []
      needsRepair = true
    }
    if (!Array.isArray(resume.certifications)) {
      repairedResume.certifications = []
      needsRepair = true
    }
    if (!Array.isArray(resume.languages)) {
      repairedResume.languages = []
      needsRepair = true
    }
    if (!Array.isArray(resume.projects)) {
      repairedResume.projects = []
      needsRepair = true
    }
    if (!Array.isArray(resume.sectionOrder)) {
      repairedResume.sectionOrder = defaultResumeContent.sectionOrder
      needsRepair = true
    }
    if (!Array.isArray(resume.personalInfo?.links)) {
      repairedResume.personalInfo = {
        ...resume.personalInfo,
        links: [],
      }
      needsRepair = true
    }

    if (needsRepair) {
      setResume(repairedResume)
    }

    // Validate customizations
    if (!customizations || !customizations.fontFamily) {
      setCustomizations({ ...defaultCustomizations })
    }
  }, [resume, customizations, setResume, setCustomizations])

  return { resume, customizations }
}
