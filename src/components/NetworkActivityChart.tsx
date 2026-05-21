import React, { useEffect, useState } from 'react'

interface ChartDataPoint {
  timestamp: string
  cpu: number
  memory: number
  disk: number
  network: number
}

interface NetworkActivityChartProps {
  data?: ChartDataPoint[]
  title?: string
  height?: number
}

export const NetworkActivityChart: React.FC<NetworkActivityChartProps> = ({
  title = 'Real-time Activity',
  height = 280,
  data = Array.from({ length: 7 }, (_, i) => ({
    timestamp: `10:${20 + i}`,
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    disk: Math.floor(Math.random() * 100),
    network: Math.floor(Math.random() * 100),
  })),
}) => {
  const [animatedData, setAnimatedData] = useState(data)

  useEffect(() => {
    setAnimatedData(data)
  }, [data])

  const chartHeight = height
  const chartWidth = 500
  const padding = { top: 20, right: 20, bottom: 40, left: 40 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calculate scales
  const maxValue = 100
  const xStep = innerWidth / (animatedData.length - 1)

  // Generate SVG path for a data series
  const generatePath = (dataKey: 'cpu' | 'memory' | 'disk' | 'network') => {
    const points = animatedData.map((d, i) => {
      const x = padding.left + i * xStep
      const y =
        padding.top +
        innerHeight -
        (d[dataKey] / maxValue) * innerHeight
      return `${x},${y}`
    })
    return `M${points.join(' L')}`
  }

  const colors = {
    cpu: '#0099ff',
    memory: '#a855f7',
    disk: '#ffa500',
    network: '#00d084',
  }

  const labels = {
    cpu: 'CPU',
    memory: 'Memory',
    disk: 'Disk',
    network: 'Network',
  }

  return (
    <div
      className="glass rounded-2xl p-6 w-full"
      style={{
        background: 'rgba(26, 31, 53, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-50">{title}</h2>
        <div className="flex items-center gap-4">
          {(Object.keys(colors) as Array<keyof typeof colors>).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors[key] }}
              />
              <span className="text-xs text-neutral-500">{labels[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full"
          style={{ minWidth: '600px' }}
        >
          {/* GRID LINES */}
          <defs>
            <linearGradient
              id="cpuGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0099ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0099ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="memoryGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="diskGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffa500" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffa500" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="networkGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00d084" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00d084" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* HORIZONTAL GRID */}
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={`grid-${value}`}>
              <line
                x1={padding.left}
                y1={padding.top + innerHeight - (value / maxValue) * innerHeight}
                x2={chartWidth - padding.right}
                y2={padding.top + innerHeight - (value / maxValue) * innerHeight}
                stroke="rgba(74, 80, 102, 0.2)"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={padding.left - 10}
                y={padding.top + innerHeight - (value / maxValue) * innerHeight + 4}
                fontSize="11"
                fill="rgba(156, 163, 175, 0.6)"
                textAnchor="end"
              >
                {value}%
              </text>
            </g>
          ))}

          {/* AREA FILLS */}
          {(['cpu', 'memory', 'disk', 'network'] as const).map((key) => {
            const path = generatePath(key)
            const points = animatedData.map((d, i) => {
              const x = padding.left + i * xStep
              const y =
                padding.top +
                innerHeight -
                (d[key] / maxValue) * innerHeight
              return `${x},${y}`
            })
            const areaPath = `M${points.join(' L')} L${padding.left + (animatedData.length - 1) * xStep},${padding.top + innerHeight} L${padding.left},${padding.top + innerHeight} Z`

            return (
              <g key={`area-${key}`}>
                <path
                  d={areaPath}
                  fill={`url(#${key}Gradient)`}
                  opacity="0.5"
                />
              </g>
            )
          })}

          {/* LINE STROKES */}
          {(['cpu', 'memory', 'disk', 'network'] as const).map((key) => (
            <path
              key={`line-${key}`}
              d={generatePath(key)}
              fill="none"
              stroke={colors[key]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[key]}40)`,
              }}
            />
          ))}

          {/* X-AXIS LABELS */}
          {animatedData.map((point, i) => (
            <text
              key={`label-${i}`}
              x={padding.left + i * xStep}
              y={chartHeight - 10}
              fontSize="11"
              fill="rgba(156, 163, 175, 0.6)"
              textAnchor="middle"
            >
              {point.timestamp}
            </text>
          ))}

          {/* AXES */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="rgba(74, 80, 102, 0.3)"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="rgba(74, 80, 102, 0.3)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* FOOTER */}
      <div className="mt-4 text-xs text-neutral-500 text-center">
        Updated every 1 second
      </div>
    </div>
  )
}

export default NetworkActivityChart
