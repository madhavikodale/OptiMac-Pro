import { useEffect, useState } from 'react'

function SystemHealth({ health, uiMode }) {
  const [displayHealth, setDisplayHealth] = useState(0)

  useEffect(() => {
    setDisplayHealth(health)
  }, [health])

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayHealth / 100) * circumference

  const getHealthColor = () => {
    if (displayHealth >= 85) return uiMode === 'premium' ? '#10B981' : '#22C55E'
    if (displayHealth >= 70) return uiMode === 'premium' ? '#3B82F6' : '#06B6D4'
    return uiMode === 'premium' ? '#F59E0B' : '#EF4444'
  }

  const getHealthStatus = () => {
    if (displayHealth >= 85) return 'Excellent'
    if (displayHealth >= 70) return 'Good'
    if (displayHealth >= 50) return 'Fair'
    return 'Poor'
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-dark-900 border border-gray-700'
    }`}>
      <h3 className="text-lg font-semibold mb-6">System Health</h3>
      
      {/* SVG Circular Progress */}
      <div className="flex justify-center mb-6">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={uiMode === 'premium' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(107, 114, 128, 0.2)'}
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={getHealthColor()}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              filter: uiMode === 'premium' ? `drop-shadow(0 0 10px ${getHealthColor()})` : 'none'
            }}
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold gradient-text mb-2">
          {Math.round(displayHealth)}%
        </div>
        <div className={`text-sm font-semibold ${
          uiMode === 'premium' ? 'text-cyan-400' : 'text-green-400'
        }`}>
          {getHealthStatus()}
        </div>
        <div className="text-xs text-gray-500 mt-2">Your system is optimized</div>
      </div>

      {/* Optimize Button */}
      <button className={`w-full py-3 rounded-xl font-semibold transition ${
        uiMode === 'premium'
          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
          : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90'
      }`}>
        ⚡ One Click Optimize
      </button>

      <div className="text-xs text-gray-500 text-center mt-4">
        Last optimized: Today, 9:41 AM
      </div>
    </div>
  )
}

export default SystemHealth
