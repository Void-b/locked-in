'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { startOfMonth, endOfMonth, subMonths, addMonths, formatISO } from 'date-fns'
import Calendar from '@/components/Calendar'
import Statistics from '@/components/Statistics'

interface DailyLog {
  personalGrowth: boolean
  physicalActivity: boolean
  waterIntake: boolean
  dailyTask: boolean
  journal?: string
  prayerMeditation: boolean
  weeklyChallenge: boolean
  submittedAt: string
}

interface User {
  email: string
  name: string
}

export default function TodayPage() {
  const router = useRouter()
  const [log, setLog] = useState<DailyLog | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    personalGrowth: false,
    physicalActivity: false,
    waterIntake: false,
    dailyTask: false,
    journal: '',
    prayerMeditation: false,
    weeklyChallenge: false,
  })

  // Calendar and Statistics state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarLogs, setCalendarLogs] = useState<DailyLog[]>([])
  const [calendarLoading, setCalendarLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user
        const userRes = await fetch('/api/auth/me')
        if (!userRes.ok) {
          if (userRes.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch user')
        }
        const userData = await userRes.json()
        setUser(userData)

        // Fetch log
        const logRes = await fetch('/api/logs/me?from=today&to=today')
        if (!logRes.ok) throw new Error('Failed to fetch log')
        const data = await logRes.json()
        if (data.length > 0) {
          setLog(data[0])
          setForm({
            personalGrowth: data[0].personalGrowth,
            physicalActivity: data[0].physicalActivity,
            waterIntake: data[0].waterIntake,
            dailyTask: data[0].dailyTask,
            journal: data[0].journal || '',
            prayerMeditation: data[0].prayerMeditation,
            weeklyChallenge: data[0].weeklyChallenge,
          })
        }

        // Fetch calendar logs for current month
        await fetchCalendarLogs(currentMonth)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  async function fetchCalendarLogs(month: Date) {
    setCalendarLoading(true)
    try {
      const from = formatISO(startOfMonth(month), { representation: 'date' })
      const to = formatISO(endOfMonth(month), { representation: 'date' })
      const res = await fetch(`/api/logs/me?from=${from}&to=${to}`)
      if (!res.ok) throw new Error('Failed to fetch calendar logs')
      const data = await res.json()
      setCalendarLogs(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setCalendarLoading(false)
    }
  }

  function handleMonthChange(newMonth: Date) {
    setCurrentMonth(newMonth)
    fetchCalendarLogs(newMonth)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Submission failed')
      } else {
        const data = await res.json()
        setLog(data)
      }
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch {
      // Fallback redirect
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Please log in'}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info and Logout */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{user.name}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Calendar and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Calendar
            logs={calendarLogs}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
          <Statistics logs={calendarLogs} />
        </div>

        {log ? (
          /* Submitted View */
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Today's Submission</h1>
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Submitted</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className={`text-xl ${log.personalGrowth ? 'text-green-600' : 'text-gray-400'}`}>{log.personalGrowth ? '✅' : '❌'}</span>
                  <span className="font-medium">Personal Growth</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className={`text-xl ${log.physicalActivity ? 'text-green-600' : 'text-gray-400'}`}>{log.physicalActivity ? '✅' : '❌'}</span>
                  <span className="font-medium">Physical Activity</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className={`text-xl ${log.waterIntake ? 'text-green-600' : 'text-gray-400'}`}>{log.waterIntake ? '✅' : '❌'}</span>
                  <span className="font-medium">Water Intake</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className={`text-xl ${log.dailyTask ? 'text-green-600' : 'text-gray-400'}`}>{log.dailyTask ? '✅' : '❌'}</span>
                  <span className="font-medium">Daily Task</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className={`text-xl ${log.prayerMeditation ? 'text-green-600' : 'text-gray-400'}`}>{log.prayerMeditation ? '✅' : '❌'}</span>
                  <span className="font-medium">Prayer/Meditation</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className={`text-xl ${log.weeklyChallenge ? 'text-green-600' : 'text-gray-400'}`}>{log.weeklyChallenge ? '✅' : '❌'}</span>
                  <span className="font-medium">Weekly Challenge</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h2 className="font-semibold text-gray-900 mb-3">Journal Entry</h2>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {log.journal || 'No journal entry today.'}
              </div>
            </div>
            <div className="mt-4 text-right text-sm text-gray-500">
              Submitted on {new Date(log.submittedAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">Daily Submission</h1>
            <p className="text-center text-gray-600">Track your progress and stay committed</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.personalGrowth}
                    onChange={e => setForm({ ...form, personalGrowth: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span className="font-medium text-gray-900">Personal Growth</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.physicalActivity}
                    onChange={e => setForm({ ...form, physicalActivity: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-medium text-gray-900">Physical Activity</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.waterIntake}
                    onChange={e => setForm({ ...form, waterIntake: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h6M9 15l3 3m0 0l3-3m-3 3V9a3 3 0 00-3-3H5a3 3 0 00-3 3v8a3 3 0 003 3H6" />
                    </svg>
                    <span className="font-medium text-gray-900">Water Intake</span>
                  </div>
                </label>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.dailyTask}
                    onChange={e => setForm({ ...form, dailyTask: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-900">Daily Task</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.prayerMeditation}
                    onChange={e => setForm({ ...form, prayerMeditation: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="font-medium text-gray-900">Prayer/Meditation</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.weeklyChallenge}
                    onChange={e => setForm({ ...form, weeklyChallenge: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-gray-900">Weekly Challenge</span>
                  </div>
                </label>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Journal (private)</span>
              <textarea
                value={form.journal}
                onChange={e => setForm({ ...form, journal: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows={4}
                placeholder="Reflect on your day, challenges, and wins..."
              />
            </label>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Submit Daily Log</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
