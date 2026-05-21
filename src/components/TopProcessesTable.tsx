import React, { useState } from 'react'
import { ChevronRight, MoreVertical } from 'lucide-react'

interface Process {
  id: string
  name: string
  icon?: string
  usage: number
  memory: string
  cpu?: number
  gpu?: number
}

interface TopProcessesTableProps {
  processes?: Process[]
  title?: string
  onViewAll?: () => void
}

export const TopProcessesTable: React.FC<TopProcessesTableProps> = ({
  title = 'Top Processes',
  onViewAll,
  processes = [
    {
      id: '1',
      name: 'Google Chrome',
      icon: '🔍',
      usage: 23.4,
      memory: '1.2 GB',
      cpu: 15,
    },
    {
      id: '2',
      name: 'VS Code',
      icon: '💻',
      usage: 12.7,
      memory: '890 MB',
      cpu: 8,
    },
    {
      id: '3',
      name: 'Docker',
      icon: '🐳',
      usage: 8.3,
      memory: '512 MB',
      cpu: 5,
    },
    {
      id: '4',
      name: 'Telegram',
      icon: '💬',
      usage: 6.1,
      memory: '378 MB',
      cpu: 2,
    },
    {
      id: '5',
      name: 'Spotify',
      icon: '🎵',
      usage: 4.8,
      memory: '256 MB',
      cpu: 1,
    },
  ],
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

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
        <button
          onClick={onViewAll}
          className="
            text-sm text-electric-900 hover:text-electric-800
            font-medium transition-colors
            flex items-center gap-1
          "
        >
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700/30">
              <th
                className="
                  text-left text-xs font-semibold text-neutral-500
                  uppercase tracking-wider py-3 px-4
                "
              >
                Process
              </th>
              <th
                className="
                  text-right text-xs font-semibold text-neutral-500
                  uppercase tracking-wider py-3 px-4
                "
              >
                Usage
              </th>
              <th
                className="
                  text-right text-xs font-semibold text-neutral-500
                  uppercase tracking-wider py-3 px-4
                "
              >
                Memory
              </th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr
                key={process.id}
                onMouseEnter={() => setHoveredRow(process.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`
                  border-b border-neutral-700/20
                  transition-all duration-150
                  ${
                    hoveredRow === process.id
                      ? 'bg-neutral-800/50'
                      : 'hover:bg-neutral-800/30'
                  }
                `}
              >
                {/* PROCESS NAME */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {/* ICON */}
                    <div
                      className="
                        w-8 h-8 rounded-lg
                        bg-neutral-800 flex items-center justify-center
                        text-sm
                      "
                    >
                      {process.icon}
                    </div>
                    {/* NAME */}
                    <div>
                      <p className="text-sm font-medium text-neutral-200">
                        {process.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* USAGE PERCENTAGE */}
                <td className="py-3 px-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-electric-900">
                      {process.usage.toFixed(1)}%
                    </span>
                    {process.cpu && (
                      <span className="text-xs text-neutral-500">
                        CPU: {process.cpu}%
                      </span>
                    )}
                  </div>
                </td>

                {/* MEMORY */}
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-mono text-neutral-400">
                    {process.memory}
                  </span>
                </td>

                {/* ACTION BUTTON */}
                <td className="py-3 px-4">
                  <button
                    className={`
                      p-2 rounded-lg transition-all
                      ${
                        hoveredRow === process.id
                          ? 'bg-neutral-700 text-neutral-200'
                          : 'text-neutral-600'
                      }
                    `}
                    title="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-4 text-xs text-neutral-500 text-center">
        Showing top 5 processes by usage
      </div>
    </div>
  )
}

export default TopProcessesTable
