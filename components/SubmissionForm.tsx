'use client'

import { useState } from 'react'

interface SubmissionFormProps {
  onSubmit: (content: string) => Promise<void>
}

export default function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(content)
      setContent('')
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Enter your daily submission..."
        required
        maxLength={1000}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows={4}
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
