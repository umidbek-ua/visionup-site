const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')

export interface LatestRelease {
  id: number
  version: string
  platform: string
  architecture: string
  download_url: string
  file_size: string
  released_at: string
}

export type ContactSubject =
  | 'general_question'
  | 'bug_report'
  | 'feature_request'
  | 'accessibility_feedback'

export interface ContactMessageRequest {
  name: string
  email: string
  subject: ContactSubject
  message: string
}

export type ApiFieldErrors = Partial<Record<keyof ContactMessageRequest, string[]>>

export class ApiRequestError extends Error {
  status: number
  fieldErrors: ApiFieldErrors

  constructor(message: string, status: number, fieldErrors: ApiFieldErrors = {}) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export async function getLatestRelease(): Promise<LatestRelease> {
  const response = await fetch(`${API_BASE_URL}/releases/latest/`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new ApiRequestError('Latest release is unavailable.', response.status)
  }

  return response.json()
}

export async function submitContactMessage(data: ContactMessageRequest) {
  const response = await fetch(`${API_BASE_URL}/contact/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const responseData = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiRequestError(
      'Contact message could not be sent.',
      response.status,
      normalizeFieldErrors(responseData),
    )
  }

  return responseData as { message: string; id: number }
}

function normalizeFieldErrors(data: unknown): ApiFieldErrors {
  if (!data || typeof data !== 'object') {
    return {}
  }

  return Object.entries(data).reduce<ApiFieldErrors>((errors, [field, value]) => {
    if (!['name', 'email', 'subject', 'message'].includes(field)) {
      return errors
    }

    errors[field as keyof ContactMessageRequest] = Array.isArray(value)
      ? value.map(String)
      : [String(value)]

    return errors
  }, {})
}
