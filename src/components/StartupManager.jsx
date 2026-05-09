import { useState } from "react"
import { FiPower, FiClock, FiCheck } from "react-icons/fi"

function StartupManager({ uiMode }) {
  const [startupApps, setStartupApps] = useState([
    { id: 1, name: 'Google Chrome', enabled: true, bootTime: 2.3, impact: 'High', icon: '🌐' },
    { id: 2, name: 'Slack', enabled: true, bootTime: 1.8, impact: 'Medium', icon: '💬' },
    { id: 3, name: 'Spotify', enabled: true, bootTime: 1.2, impact: 'Medium', icon: '🎵' },
    { id: 4, name: 'Docker Desktop', enabled: true, bootTime: 4.5, impact: 'High', icon: '🐳' },
    { id: 5, name: 'Dropbox', enabled: false, bootTime: 0.8, impact: 'Low', icon: '📁' },
    { id: 6, name: 'Adobe Creative Cloud', enabled: false, bootTime: 3.2, impact: 'High', icon: '🎨' },
  ])

  const toggleApp = (id) => {
    setStartupApps(startupApps.map(app =>
      app.id === id ? { ...app, enabled: !app.enabled } : app
    ))
  }

  const enabledApps = startupApps.filter(app => app.enabled)
  const totalBootTime = enabledApps.reduce((sum, app) => sum + app.bootTime, 0)

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'High': return uiMode === 'premium' ? '#EF4444' : '#DC2626'
      case 'Medium': return uiMode === 'premium' ? '#F59E0B' : '#D97706'
      case 'Low': return uiMode === 'premium' ? '#10B981' : '#059669'
      default: return '#6B7280'
    }
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          ⚡ Startup Manager
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Control startup apps and reduce boot time
        </p>
      </div>

      {/* Boot Time Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
          <p className={`text-xs uppercase text-gray-500 tracking-wider mb-2`}>Total Boot Time</p>
          <p className={`text-3xl font-bold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
            {totalBootTime.toFixed(1)}s
          </p>
          <p className={`text-xs mt-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
            {enabledApps.length} apps enabled
          </p>
        </div>

        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
          <p className={`text-xs uppercase text-gray-500 tracking-wider mb-2`}>Potential Savings</p>
          <p className={`text-3xl font-bold ${uiMode === 'premium' ? 'text-green-400' : 'text-green-600'}`}>
            {(totalBootTime / 2).toFixed(1)}s
          </p>
          <p className={`text-xs mt-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
            If optimized
          </p>
        </div>
      </div>

      {/* Startup Apps List */}
      <div className="space-y-3">
        <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
          Startup Applications
        </p>
        {startupApps.map(app => (
          <div
            key={app.id}
            className={`p-4 rounded-lg transition flex items-center justify-between ${
              uiMode === 'premium'
                ? 'glass hover:bg-purple-500/10'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{app.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                  {app.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <FiClock size={12} className={uiMode === 'premium' ? 'text-gray-500' : 'text-gray-500'} />
                  <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                    {app.bootTime}s • 
                  </p>
                  <span
                    className="text-xs font-semibold ml-1"
                    style={{ color: getImpactColor(app.impact) }}
                  >
                    {app.impact} Impact
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleApp(app.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                app.enabled
                  ? uiMode === 'premium'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-100 text-green-700'
                  : uiMode === 'premium'
                  ? 'bg-gray-700/20 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <FiCheck size={16} className="inline mr-1" />
              {app.enabled ? 'On' : 'Off'}
            </button>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className={`mt-6 p-3 rounded-lg text-sm ${
        uiMode === 'premium'
          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
          : 'bg-blue-50 border border-blue-200 text-blue-900'
      }`}>
        💡 Disabling high-impact apps like Docker could save ~4.5s on boot time
      </div>
    </div>
  )
}

export default StartupManager
