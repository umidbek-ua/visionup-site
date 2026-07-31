import { useState } from 'react'
import type { FormEvent } from 'react'
import PageIntro from '../components/PageIntro'

const subjects = [
  'General Question',
  'Bug Report',
  'Feature Request',
  'Accessibility Feedback',
]

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

type FormState = typeof initialForm
type FormErrors = Partial<Record<keyof FormState, string>>

function validateForm(form: FormState) {
  const errors: FormErrors = {}

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

function Contact() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState('')

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSuccessMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage('')
      return
    }

    setSuccessMessage('Message saved locally for now. Backend connection will be added later.')
    setForm(initialForm)
  }

  return (
    <main id="contact" className="content-page narrow-page">
      <PageIntro
        eyebrow="Contact"
        title="Send feedback, questions or accessibility notes."
        description="This form is static for now. It validates in the browser and is ready to connect to a Django API later."
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
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
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

        <button className="send-button" type="submit">
          Send Message
        </button>

        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}
      </form>
    </main>
  )
}

export default Contact
