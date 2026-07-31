import { useState } from 'react'
import type { FormEvent } from 'react'
import PageIntro from '../components/PageIntro'
import { contactSubjects, initialContactForm, type ContactFormErrors, type ContactFormState } from '../data/contactData'
import { ApiRequestError, submitContactMessage } from '../services/api'
import { validateContactForm } from '../utils/contactValidation'

function Contact() {
  const [form, setForm] = useState<ContactFormState>(initialContactForm)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSuccessMessage('')
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const nextErrors = validateContactForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage('')
      setSubmitError('')
      return
    }

    const subject = form.subject
    if (!subject) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')
    setSubmitError('')

    try {
      const response = await submitContactMessage({
        name: form.name,
        email: form.email,
        subject,
        message: form.message,
      })

      setSuccessMessage(response.message)
      setForm(initialContactForm)
      setErrors({})
    } catch (error) {
      if (error instanceof ApiRequestError && Object.keys(error.fieldErrors).length > 0) {
        setErrors(mapApiErrors(error.fieldErrors))
      } else {
        setSubmitError('Message could not be sent. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main id="contact" className="content-page narrow-page">
      <PageIntro
        eyebrow="Contact"
        title="Send feedback, questions or accessibility notes."
        description="Send accessibility feedback, bug reports, feature ideas or general questions to the VisionUp team."
      />

      <form className="contact-form" noValidate onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={Boolean(errors.name)}
            id="name"
            name="name"
            onChange={(event) => updateField('name', event.target.value)}
            type="text"
            value={form.name}
          />
          {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={Boolean(errors.email)}
            id="email"
            name="email"
            onChange={(event) => updateField('email', event.target.value)}
            type="email"
            value={form.email}
          />
          {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="subject">Subject</label>
          <select
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            aria-invalid={Boolean(errors.subject)}
            id="subject"
            name="subject"
            onChange={(event) => updateField('subject', event.target.value)}
            value={form.subject}
          >
            <option value="">Select a subject</option>
            {contactSubjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
          {errors.subject && <p className="field-error" id="subject-error">{errors.subject}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea
            aria-describedby={errors.message ? 'message-error' : undefined}
            aria-invalid={Boolean(errors.message)}
            id="message"
            name="message"
            onChange={(event) => updateField('message', event.target.value)}
            rows={6}
            value={form.message}
          />
          {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
        </div>

        <button className="send-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

        {submitError && (
          <p className="error-message" role="alert">
            {submitError}
          </p>
        )}

        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}
      </form>
    </main>
  )
}

function mapApiErrors(fieldErrors: ApiRequestError['fieldErrors']): ContactFormErrors {
  return Object.entries(fieldErrors).reduce<ContactFormErrors>((errors, [field, messages]) => {
    errors[field as keyof ContactFormState] = messages?.join(' ')
    return errors
  }, {})
}

export default Contact
