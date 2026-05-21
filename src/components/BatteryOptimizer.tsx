import React from 'react'
import { motion } from 'framer-motion'
import { Battery, TrendingDown, Zap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSystemData } from '../hooks/useSystemData'

interface BatteryApp {
  name: string
  drain: number
  usage: string
  icon: string
}

const batteryApps: BatteryApp[] = [
  { name: 'Google Chrome', drain: 24, usage: '5h 32m', icon: '🌐' },
  { name: 'VS Code', drain: 18, usage: '4h 15m', icon: '💻' },
  { name: 'Spotify', drain: 12, usage: '2h 48m', icon: '🎵' },
  { name: 'Docker', drain: 15, usage: '3h 22m', icon: '🐳' },
  { name: 'Slack', drain: 11, usage: '2h 30m', icon: '💬' },
]

interface Optimization {
  name: string
  saving: string
  enabled: boolean
}

const optimizations: Optimization[] = [
  { name: 'Reduce Screen Brightness', saving: '15%', enabled: false },
  { name: 'Enable Low Power Mode', saving: '20%', enabled: false },
  { name: 'Close Background Apps', saving: '12%', enabled: true },
  { name: 'Disable Location Services', saving: '8%', enabled: false },
]

export const BatteryOptimizer: React.FC = () => {
  const { isDark } = useTheme()
  const { systemData } = useSystemData()
  const battery = Math.round(systemData.batteryLevel)

  const timeRemaining = battery > 20 ? `${Math.round(battery / 5)} hours` : `${Math.round(battery)} minutes`

  const cardBg = isDark
    ? 'bg-white/[0.03] border border-white/[0.06]'
    : 'bg-white border border-black/[0.06]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 ${cardBg}`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Battery size={20} className="text-green-400" />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Battery Optimizer
          </h2>
        </div>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
          Analyze battery drain and extend usage time
        </p>
      </div>

      {/* Battery Status */}
      <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-white/[0.02]' : 'bg-neutral-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Battery Level
          </p>
          <p className={`text-2xl font-bold ${
            battery > 50
              ? isDark ? 'text-green-400' : 'text-green-600'
              : isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            {battery}%
          </p>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-green-500"
            style={{ width: `${battery}%` }}
          />
        </div>
        <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
          Time Remaining: <strong>{timeRemaining}</strong>
        </p>
      </div>

      {/* Top Battery Drainers */}
      <div className="mb-6">
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Top Battery Drainers
        </h3>
        <div className="space-y-2">
          {batteryApps.map((app, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                isDark
                  ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                  : 'bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl">{app.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {app.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                    {app.usage}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {app.drain}%
                </p>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                  drain
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Options */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Battery Optimizations
        </h3>
        <div className="space-y-2">
          {optimizations.map((opt, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                isDark
                  ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                  : 'bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <TrendingDown
                  size={18}
                  className={
                    opt.enabled
                      ? isDark ? 'text-green-400' : 'text-green-600'
                      : isDark ? 'text-neutral-500' : 'text-neutral-500'
                  }
                />
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {opt.name}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  opt.enabled
                    ? isDark ? 'text-green-400' : 'text-green-600'
                    : isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  {opt.enabled ? '✓ Active' : `+${opt.saving}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-lg font-semibold transition bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg">
        <Zap size={16} className="inline mr-2" />
        Activate All Optimizations
      </button>
    </motion.div>
  )
}

export default BatteryOptimizer
