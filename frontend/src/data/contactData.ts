import type { ContactSubject } from '../services/api'

export const contactSubjects: Array<{ label: string; value: ContactSubject }> = [
  { label: 'General Question', value: 'general_question' },
  { label: 'Bug Report', value: 'bug_report' },
  { label: 'Feature Request', value: 'feature_request' },
  { label: 'Accessibility Feedback', value: 'accessibility_feedback' },
]

export const initialContactForm = {
  name: '',
  email: '',
  subject: '' as '' | ContactSubject,
  message: '',
}

export type ContactFormState = typeof initialContactForm
export type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>
