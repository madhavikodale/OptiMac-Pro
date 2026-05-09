import { useState } from 'react'
import { FiClock, FiCheck, FiPower } from "react-icons/fi"

function MaintenanceScheduler({ uiMode }) {
  const [schedules, setSchedules] = useState([
    { id: 1, task: 'Daily Deep Clean', time: '02:00 AM', frequency: 'Daily', enabled: true, lastRun: 'Today 2:15 AM', icon: '🧹' },
    { id: 2, task: 'Weekly Optimization', time: 'Sunday 11:00 PM', frequency: 'Weekly', enabled: true, lastRun: 'Last Sunday 11:05 PM', icon: '⚡' },
    { id: 3, task: 'Monthly Maintenance', time: '1st of Month 03:00 AM', frequency: 'Monthly', enabled: true, lastRun: 'May 1st 3:12 AM', icon: '🔧' },
    { id: 4, task: 'Cache Clear', time: '06:00 AM', frequency: 'Daily', enabled: false, lastRun: 'Apr 30th 6:00 AM', icon: '🧠' },
  ])

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const enabledCount = schedules.filter(s => s.enabled).length
  const nextRun = schedules.find(s => s.enabled)

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          📅 Maintenance Scheduler
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Automate system optimization with smart scheduling
        </p>
      </div>

      {/* Schedule Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
          <p className={`text-xs uppercase text-gray-500 tracking-wider mb-2`}>Active Schedules</p>
          <p className={`text-3xl font-bold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
            {enabledCount}
          </p>
          <p className={`text-xs mt-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
            of {schedules.length}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
          <p className={`text-xs uppercase text-gray-500 tracking-wider mb-2`}>Next Run</p>
          <p className={`text-sm font-bold ${uiMode === 'premium' ? 'text-green-400' : 'text-green-600'}`}>
            {nextRun?.time || 'None scheduled'}
          </p>
          <p className={`text-xs mt-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
            {nextRun?.task || 'Enable a schedule'}
          </p>
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
          Maintenance Tasks
        </p>
        {schedules.map(schedule => (
          <div
            key={schedule.id}
            className={`p-4 rounded-lg transition ${
              uiMode === 'premium'
                ? 'glass hover:bg-purple-500/10'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{schedule.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {schedule.task}
                  </p>
                  <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                    <FiClock size={12} className="inline mr-1" />
                    {schedule.time} • {schedule.frequency}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSchedule(schedule.id)}
                className={`px-3 py-2 rounded-lg font-semibold transition ${
                  schedule.enabled
                    ? uiMode === 'premium'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-green-100 text-green-700'
                    : uiMode === 'premium'
                    ? 'bg-gray-700/20 text-gray-400'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <FiPower size={16} className="inline" />
              </button>
            </div>

            {/* Last Run Info */}
            <div className={`pt-2 border-t ${uiMode === 'premium' ? 'border-purple-500/20' : 'border-gray-200'}`}>
              <p className={`text-xs flex items-center gap-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                <FiCheck size={12} className={schedule.enabled ? (uiMode === 'premium' ? 'text-green-400' : 'text-green-600') : 'text-gray-500'} />
                Last run: {schedule.lastRun}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className={`mt-6 p-3 rounded-lg text-sm ${
        uiMode === 'premium'
          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
          : 'bg-blue-50 border border-blue-200 text-blue-900'
      }`}>
        ⏰ Schedules run automatically in the background. Keep your Mac running or sleeping for best results.
      </div>
    </div>
  )
}

export default MaintenanceScheduler
