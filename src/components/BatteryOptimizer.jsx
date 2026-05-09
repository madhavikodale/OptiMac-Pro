import { useState } from 'react'
import { FiZap, FiTrendingDown } from 'react-icons/fi'

function BatteryOptimizer({ uiMode, battery = 58 }) {
  const batteryApps = [
    { name: 'Google Chrome', drain: 24, usage: '5h 32m', icon: '🌐' },
    { name: 'VS Code', drain: 18, usage: '4h 15m', icon: '💻' },
    { name: 'Spotify', drain: 12, usage: '2h 48m', icon: '🎵' },
    { name: 'Docker', drain: 15, usage: '3h 22m', icon: '🐳' },
    { name: 'Slack', drain: 11, usage: '2h 30m', icon: '💬' },
  ]

  const optimizations = [
    { name: 'Reduce Screen Brightness', saving: '15%', enabled: false },
    { name: 'Enable Low Power Mode', saving: '20%', enabled: false },
    { name: 'Close Background Apps', saving: '12%', enabled: true },
    { name: 'Disable Location Services', saving: '8%', enabled: false },
  ]

  const timeRemaining = battery > 20 ? `${Math.round(battery / 5)} hours` : `${Math.round(battery)} minutes`

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          🔋 Battery Optimizer
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Analyze battery drain and extend usage time
        </p>
      </div>

      {/* Battery Status */}
      <div className={`p-4 rounded-lg mb-6 ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
            Battery Level
          </p>
          <p className={`text-2xl font-bold ${battery > 50 ? (uiMode === 'premium' ? 'text-green-400' : 'text-green-600') : (uiMode === 'premium' ? 'text-yellow-400' : 'text-yellow-600')}`}>
            {battery}%
          </p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-green-500"
            style={{ width: `${battery}%` }}
          ></div>
        </div>
        <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
          Time Remaining: <strong>{timeRemaining}</strong>
        </p>
      </div>

      {/* Top Battery Drainers */}
      <div className="mb-6">
        <h3 className={`text-sm font-semibold mb-3 ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
          Top Battery Drainers
        </h3>
        <div className="space-y-2">
          {batteryApps.map((app, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                uiMode === 'premium'
                  ? 'glass hover:bg-purple-500/10'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl">{app.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {app.name}
                  </p>
                  <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                    {app.usage}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${uiMode === 'premium' ? 'text-red-400' : 'text-red-600'}`}>
                  {app.drain}%
                </p>
                <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                  drain
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Options */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
          Battery Optimizations
        </h3>
        <div className="space-y-2">
          {optimizations.map((opt, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                uiMode === 'premium'
                  ? 'glass hover:bg-purple-500/10'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <FiTrendingDown size={18} className={opt.enabled ? (uiMode === 'premium' ? 'text-green-400' : 'text-green-600') : (uiMode === 'premium' ? 'text-gray-500' : 'text-gray-500')} />
                <div>
                  <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {opt.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${opt.enabled ? (uiMode === 'premium' ? 'text-green-400' : 'text-green-600') : (uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600')}`}>
                  {opt.enabled ? '✓ Active' : `+${opt.saving}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
        uiMode === 'premium'
          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg'
          : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
      }`}>
        <FiZap className="inline mr-2" size={18} />
        Activate All Optimizations
      </button>
    </div>
  )
}

export default BatteryOptimizer
