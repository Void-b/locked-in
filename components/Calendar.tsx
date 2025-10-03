import React, { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, subMonths, addMonths } from 'date-fns'

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

interface CalendarProps {
  logs: DailyLog[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

const getTaskCompletionCount = (log: DailyLog) => {
  let count = 0
  if (log.personalGrowth) count++
  if (log.physicalActivity) count++
  if (log.waterIntake) count++
  if (log.dailyTask) count++
  if (log.prayerMeditation) count++
  if (log.weeklyChallenge) count++
  return count
}

const getColorForCompletion = (count: number, max: number) => {
  // Map count from 0 to max to a color from light red to light green
  const red = 255 - Math.floor((count / max) * 255)
  const green = Math.floor((count / max) * 255)
  return `rgba(${red}, ${green}, 0, 0.3)`
}

const Calendar: React.FC<CalendarProps> = ({ logs, currentMonth, onMonthChange }) => {
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = 'd'
  const days = []
  let day = startDate
  let formattedDate = ''

  // Create array of weeks with days
  const weeks = []
  let daysInWeek = []

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day

      // Find log for this day
      const log = logs.find(l => isSameDay(new Date(l.submittedAt), cloneDay))

      // Calculate color based on tasks done
      const maxTasks = 6
      const tasksDone = log ? getTaskCompletionCount(log) : 0
      const bgColor = log ? getColorForCompletion(tasksDone, maxTasks) : 'transparent'

      daysInWeek.push(
        <div
          className={`border border-gray-200 h-16 p-1 cursor-pointer select-none ${
            !isSameMonth(day, monthStart) ? 'text-gray-300' : 'text-gray-900'
          }`}
          key={day.toString()}
          title={log ? 'Submitted' : 'No submission'}
          style={{ backgroundColor: bgColor }}
          onClick={() => {
            if (log) setSelectedLog(log)
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">{formattedDate}</span>
            {log ? (
              <span className="text-green-600 font-bold" aria-label="Submitted">&#10003;</span>
            ) : null}
          </div>
        </div>
      )
      day = addDays(day, 1)
    }
    weeks.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {daysInWeek}
      </div>
    )
    daysInWeek = []
  }

  const onPrev = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const onNext = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onPrev}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          aria-label="Previous Month"
        >
          {'<'}
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          aria-label="Next Month"
        >
          {'>'}
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-gray-700 mb-2">
        {dayNames.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div>{weeks}</div>

      {/* Popup for selected log */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setSelectedLog(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Log Details - {new Date(selectedLog.submittedAt).toLocaleDateString()}</h3>
            <ul className="space-y-2">
              <li>
                Personal Growth: {selectedLog.personalGrowth ? '✅' : '❌'}
              </li>
              <li>
                Physical Activity: {selectedLog.physicalActivity ? '✅' : '❌'}
              </li>
              <li>
                Water Intake: {selectedLog.waterIntake ? '✅' : '❌'}
              </li>
              <li>
                Daily Task: {selectedLog.dailyTask ? '✅' : '❌'}
              </li>
              <li>
                Prayer/Meditation: {selectedLog.prayerMeditation ? '✅' : '❌'}
              </li>
              <li>
                Weekly Challenge: {selectedLog.weeklyChallenge ? '✅' : '❌'}
              </li>
              <li>
                Journal Entry:
                <p className="mt-1 p-2 bg-gray-100 rounded">{selectedLog.journal || 'No journal entry.'}</p>
              </li>
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
