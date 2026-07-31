import type { ContactFormErrors, ContactFormState } from '../data/contactData'

export function validateContactForm(form: ContactFormState) {
  const errors: ContactFormErrors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.subject) {
    errors.subject = 'Subject is required.'
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required.'
  }

  return errors
}
