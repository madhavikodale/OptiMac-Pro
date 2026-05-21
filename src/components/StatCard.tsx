import React from 'react'

interface SparklinePoint {
  value: number
  timestamp: number
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  value: string | number
  unit?: string
  percentage?: number
  sparkline?: number[]
  status?: 'idle' | 'active' | 'warning' | 'critical'
  colorClass?: string
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  subtitle,
  value,
  unit,
  percentage,
  sparkline = [20, 30, 25, 40, 35, 50, 45, 55, 48, 60],
  status = 'idle',
  colorClass = 'from-cyan-400 to-blue-600',
  onClick,
}) => {
  // Generate SVG sparkline
  const svgWidth = 100
  const svgHeight = 40
  const padding = 2
  const innerWidth = svgWidth - padding * 2
  const innerHeight = svgHeight - padding * 2

  const maxValue = Math.max(...sparkline, 100)
  const minValue = 0

  const points = sparkline.map((value, index) => {
    const x = padding + (index / (sparkline.length - 1)) * innerWidth
    const y = padding + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight
    return `${x},${y}`
  })

  const pathData = `M${points.join(' L')}`

  const getStatusColor = () => {
    switch (status) {
      case 'idle':
        return 'from-cyan-400 to-blue-600'
      case 'active':
        return 'from-purple-400 to-pink-600'
      case 'warning':
        return 'from-yellow-400 to-orange-600'
      case 'critical':
        return 'from-red-400 to-orange-600'
      default:
        return colorClass
    }
  }

  const getGlowColor = () => {
    switch (status) {
      case 'idle':
        return 'rgba(0, 217, 255, 0.3)'
      case 'active':
        return 'rgba(168, 85, 247, 0.3)'
      case 'warning':
        return 'rgba(255, 165, 0, 0.3)'
      case 'critical':
        return 'rgba(255, 71, 87, 0.3)'
      default:
        return 'rgba(0, 217, 255, 0.3)'
    }
  }

  return (
    <button
      onClick={onClick}
      className="
        glass rounded-xl p-5 w-full
        transition-all duration-200
        hover:scale-105 hover:border-electric-900
        group
      "
      style={{
        background: 'rgba(26, 31, 53, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: `0 0 20px ${getGlowColor()}`,
      }}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        {/* ICON & TITLE */}
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`
              w-10 h-10 rounded-lg
              bg-gradient-to-br ${getStatusColor()}
              flex items-center justify-center
              text-white shadow-lg
              group-hover:shadow-xl transition-shadow
            `}
          >
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* PERCENTAGE BADGE */}
        {percentage !== undefined && (
          <div
            className={`
              px-2.5 py-1 rounded-md text-xs font-bold
              ${
                percentage < 40
                  ? 'bg-green-500/20 text-green-400'
                  : percentage < 70
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }
            `}
          >
            {percentage}%
          </div>
        )}
      </div>

      {/* VALUE */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-neutral-50 font-mono">
            {value}
          </span>
          {unit && <span className="text-sm text-neutral-400">{unit}</span>}
        </div>
      </div>

      {/* SPARKLINE CHART */}
      {sparkline && sparkline.length > 0 && (
        <div className="mb-3">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto"
            style={{ filter: `drop-shadow(0 0 8px ${getGlowColor()})` }}
          >
            {/* BACKGROUND AREA */}
            <defs>
              <linearGradient
                id={`sparklineGradient-${title}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={
                    status === 'idle'
                      ? '#00d9ff'
                      : status === 'active'
                        ? '#a855f7'
                        : status === 'warning'
                          ? '#ffa500'
                          : '#ff4757'
                  }
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor={
                    status === 'idle'
                      ? '#00d9ff'
                      : status === 'active'
                        ? '#a855f7'
                        : status === 'warning'
                          ? '#ffa500'
                          : '#ff4757'
                  }
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* AREA FILL */}
            <path
              d={`${pathData} L${padding + innerWidth},${padding + innerHeight} L${padding},${padding + innerHeight} Z`}
              fill={`url(#sparklineGradient-${title})`}
            />

            {/* LINE STROKE */}
            <path
              d={pathData}
              fill="none"
              stroke={
                status === 'idle'
                  ? '#00d9ff'
                  : status === 'active'
                    ? '#a855f7'
                    : status === 'warning'
                      ? '#ffa500'
                      : '#ff4757'
              }
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* FOOTER INFO */}
      {percentage !== undefined && (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-700/30">
          <span className="text-xs text-neutral-500">Usage</span>
          <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getStatusColor()}`}
              style={{
                width: `${percentage}%`,
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>
        </div>
      )}
    </button>
  )
}

export default StatCard
