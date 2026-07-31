export const contactSubjects = [
  'General Question',
  'Bug Report',
  'Feature Request',
  'Accessibility Feedback',
]

export const initialContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export type ContactFormState = typeof initialContactForm
export type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>
