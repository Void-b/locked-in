import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

interface DailyLog {
  personalGrowth: boolean
  physicalActivity: boolean
  waterIntake: boolean
  dailyTask: boolean
  prayerMeditation: boolean
  weeklyChallenge: boolean
}

interface StatisticsProps {
  logs: DailyLog[]
  chartType?: 'pie' | 'bar'
}

const Statistics: React.FC<StatisticsProps> = ({ logs, chartType = 'pie' }) => {
  // Aggregate counts for each category
  const categories = [
    'Personal Growth',
    'Physical Activity',
    'Water Intake',
    'Daily Task',
    'Prayer/Meditation',
    'Weekly Challenge',
  ]

  const counts = {
    personalGrowth: 0,
    physicalActivity: 0,
    waterIntake: 0,
    dailyTask: 0,
    prayerMeditation: 0,
    weeklyChallenge: 0,
  }

  logs.forEach(log => {
    if (log.personalGrowth) counts.personalGrowth++
    if (log.physicalActivity) counts.physicalActivity++
    if (log.waterIntake) counts.waterIntake++
    if (log.dailyTask) counts.dailyTask++
    if (log.prayerMeditation) counts.prayerMeditation++
    if (log.weeklyChallenge) counts.weeklyChallenge++
  })

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Completed',
        data: [
          counts.personalGrowth,
          counts.physicalActivity,
          counts.waterIntake,
          counts.dailyTask,
          counts.prayerMeditation,
          counts.weeklyChallenge,
        ],
        backgroundColor: [
          '#4f46e5', // Indigo
          '#10b981', // Green
          '#3b82f6', // Blue
          '#f59e0b', // Amber
          '#ef4444', // Red
          '#8b5cf6', // Purple
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        stepSize: 1,
      },
    } : undefined,
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Statistics</h2>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 h-64">
          {chartType === 'pie' ? (
            <Pie data={data} options={options} />
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
        <div className="flex-1 lg:flex-none lg:w-1/3">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {categories.map((category, index) => (
              <div key={category} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-sm text-gray-700">{category}: {Object.values(counts)[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Focus areas: {categories.filter((_, i) => Object.values(counts)[i] < logs.length / 2).join(', ')}</p>
      </div>
    </div>
  )
}

export default Statistics
