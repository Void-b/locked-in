'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import DataTable from '@/components/DataTable'

interface Submission {
  id: number
  content: string
  submittedAt: string
  user: { email: string }
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  async function fetchSubmissions() {
    try {
      const res = await fetch('/api/submissions')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setSubmissions(data)
    } catch (err) {
      setError('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  async function exportCSV() {
    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'submissions.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed')
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <button
          onClick={exportCSV}
          className="mb-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
        <DataTable submissions={submissions} />
      </div>
    </div>
  )
}
