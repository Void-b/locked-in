'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DailyLog {
  id: string
  userId: string
  user?: {
    email: string
    name: string
  }
  userEmail?: string
  date: string
  personalGrowth: boolean
  physicalActivity: boolean
  waterIntake: boolean
  dailyTask: boolean
  journal?: string
  prayerMeditation: boolean
  weeklyChallenge: boolean
  submittedAt: string
}

export default function AdminLogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => {
    // Set to current date in local timezone
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  const limit = 50

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      try {
        const from = selectedDate + 'T00:00:00.000Z'
        const to = selectedDate + 'T23:59:59.999Z'

        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        params.append('from', from)
        params.append('to', to)

        const res = await fetch(`/api/submissions?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (res.status === 401) {
          router.push('/login')
          return
        }
        if (!res.ok) {
          throw new Error('Failed to fetch logs')
        }
        const data = await res.json()
        setLogs(data.logs)
        setTotal(data.total)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [router, page, selectedDate])

  const totalPages = Math.ceil(total / limit)

  // Calculate total entries for selectedDate
  const totalSelectedDate = logs.length

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900">Admin: User Logs</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <input
            type="date"
            id="selectedDate"
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value)
              setPage(1) // reset to first page on date change
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="ml-auto text-sm text-gray-700 font-semibold">
          Total Entries on {selectedDate}: {totalSelectedDate}
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center text-gray-600">Loading logs...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">Error: {error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Growth</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physical Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Intake</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prayer/Meditation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Challenge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At (Lagos)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user?.email || log.userEmail || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.date).toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.personalGrowth ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.physicalActivity ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.waterIntake ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.dailyTask ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.prayerMeditation ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.weeklyChallenge ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.journal || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.submittedAt).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
