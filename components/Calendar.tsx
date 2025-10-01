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

const Calendar: React.FC<CalendarProps> = ({ logs, currentMonth, onMonthChange }) => {
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

      daysInWeek.push(
        <div
          className={`border border-gray-200 h-16 p-1 cursor-default ${
            !isSameMonth(day, monthStart) ? 'text-gray-300' : 'text-gray-900'
          }`}
          key={day.toString()}
          title={log ? 'Submitted' : 'No submission'}
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
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
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
    </div>
  )
}

export default Calendar
