import React, { useEffect, useState } from 'react'

interface SystemHealthRingProps {
  healthScore: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  systemInfo?: string
  lastOptimized?: string
  onOptimizeClick?: () => void
}

export const SystemHealthRing: React.FC<SystemHealthRingProps> = ({
  healthScore = 92,
  status = 'excellent',
  systemInfo = 'Your system is optimized',
  lastOptimized = 'Today, 9:41 AM',
  onOptimizeClick,
}) => {
  const [displayScore, setDisplayScore] = useState(0)
  const circumference = 2 * Math.PI * 85

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(healthScore)
    }, 100)
    return () => clearTimeout(timer)
  }, [healthScore])

  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return {
          gradient: 'from-cyan-400 to-purple-600',
          text: 'text-green-400',
          bg: 'bg-green-400/10',
        }
      case 'good':
        return {
          gradient: 'from-blue-400 to-purple-600',
          text: 'text-blue-400',
          bg: 'bg-blue-400/10',
        }
      case 'warning':
        return {
          gradient: 'from-yellow-400 to-orange-600',
          text: 'text-yellow-400',
          bg: 'bg-yellow-400/10',
        }
      case 'critical':
        return {
          gradient: 'from-red-400 to-orange-600',
          text: 'text-red-400',
          bg: 'bg-red-400/10',
        }
      default:
        return {
          gradient: 'from-cyan-400 to-purple-600',
          text: 'text-neutral-400',
          bg: 'bg-neutral-800',
        }
    }
  }

  const colors = getStatusColor()

  const getStatusLabel = () => {
    switch (status) {
      case 'excellent':
        return 'Excellent'
      case 'good':
        return 'Good'
      case 'warning':
        return 'Warning'
      case 'critical':
        return 'Critical'
      default:
        return 'Unknown'
    }
  }

  return (
    <div
      className="
        relative glass rounded-2xl p-8
        flex flex-col items-center justify-center
        w-full h-full min-h-96
        overflow-hidden
      "
      style={{
        background: 'rgba(26, 31, 53, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${
            status === 'excellent'
              ? '#00d9ff'
              : status === 'good'
                ? '#0066ff'
                : status === 'warning'
                  ? '#ffa500'
                  : '#ff4757'
          } 0%, transparent 70%)`,
        }}
      />

      {/* SVG RING */}
      <div className="relative w-56 h-56">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.2))' }}
        >
          {/* BACKGROUND RING */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(74, 80, 102, 0.2)"
            strokeWidth="8"
          />

          {/* PROGRESS RING - GRADIENT STROKE */}
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={status === 'excellent' ? '#00d9ff' : status === 'good' ? '#0066ff' : status === 'warning' ? '#ffa500' : '#ff4757'}
              />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </svg>

        {/* CENTER CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-neutral-50 font-mono mb-2">
              {displayScore}%
            </div>
            <div className={`text-lg font-semibold ${colors.text}`}>
              {getStatusLabel()}
            </div>
            <div className="text-xs text-neutral-500 mt-3 max-w-xs">
              {systemInfo}
            </div>
          </div>
        </div>
      </div>

      {/* OPTIMIZE BUTTON */}
      <button
        onClick={onOptimizeClick}
        className="
          mt-8 px-6 py-3 rounded-xl
          bg-gradient-blue-purple
          text-white font-semibold text-sm
          shadow-lg hover:shadow-xl
          transition-all duration-200
          flex items-center gap-2
          hover:scale-105
        "
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        One Click Optimize
      </button>

      {/* LAST OPTIMIZED INFO */}
      <div className="mt-6 text-center text-xs text-neutral-500">
        Last optimized: {lastOptimized}
      </div>
    </div>
  )
}

export default SystemHealthRing
