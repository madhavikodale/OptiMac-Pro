import React from 'react'
import {
  Trash2,
  Zap,
  HardDrive,
  Stethoscope,
  ChevronRight,
} from 'lucide-react'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  description?: string
  color: 'cyan' | 'purple' | 'orange' | 'green' | 'red'
  onClick?: () => void
  badge?: string
}

interface QuickActionsPanelProps {
  actions?: QuickAction[]
  title?: string
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  title = 'Quick Actions',
  actions = [
    {
      id: 'clean-junk',
      icon: <Trash2 size={20} />,
      label: 'Clean Junk Files',
      color: 'cyan',
      description: 'Remove temporary files',
    },
    {
      id: 'free-memory',
      icon: <Zap size={20} />,
      label: 'Free Up Memory',
      color: 'purple',
      description: 'Release unused RAM',
    },
    {
      id: 'optimize-storage',
      icon: <HardDrive size={20} />,
      label: 'Optimize Storage',
      color: 'orange',
      description: 'Optimize disk usage',
    },
    {
      id: 'run-diagnostics',
      icon: <Stethoscope size={20} />,
      label: 'Run Diagnostics',
      color: 'green',
      description: 'System health check',
    },
  ],
}) => {
  const getColorClasses = (color: QuickAction['color']) => {
    switch (color) {
      case 'cyan':
        return {
          bg: 'bg-cyan-500/20',
          text: 'text-cyan-400',
          hover: 'hover:bg-cyan-500/30',
          border: 'border-cyan-500/30',
          gradient: 'from-cyan-400 to-cyan-600',
        }
      case 'purple':
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-400',
          hover: 'hover:bg-purple-500/30',
          border: 'border-purple-500/30',
          gradient: 'from-purple-400 to-purple-600',
        }
      case 'orange':
        return {
          bg: 'bg-orange-500/20',
          text: 'text-orange-400',
          hover: 'hover:bg-orange-500/30',
          border: 'border-orange-500/30',
          gradient: 'from-orange-400 to-orange-600',
        }
      case 'green':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          hover: 'hover:bg-green-500/30',
          border: 'border-green-500/30',
          gradient: 'from-green-400 to-green-600',
        }
      case 'red':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          hover: 'hover:bg-red-500/30',
          border: 'border-red-500/30',
          gradient: 'from-red-400 to-red-600',
        }
      default:
        return {
          bg: 'bg-neutral-800',
          text: 'text-neutral-400',
          hover: 'hover:bg-neutral-700',
          border: 'border-neutral-700',
          gradient: 'from-neutral-400 to-neutral-600',
        }
    }
  }

  return (
    <div
      className="glass rounded-2xl p-6 w-full h-fit"
      style={{
        background: 'rgba(26, 31, 53, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* HEADER */}
      <h2 className="text-lg font-semibold text-neutral-50 mb-4">{title}</h2>

      {/* ACTIONS GRID */}
      <div className="space-y-2">
        {actions.map((action) => {
          const colors = getColorClasses(action.color)

          return (
            <button
              key={action.id}
              onClick={() => {}}
              className={`
                w-full flex items-center gap-4 p-4
                rounded-lg border
                transition-all duration-200
                group hover:scale-105
                ${colors.bg} ${colors.border} ${colors.hover}
              `}
            >
              {/* ICON */}
              <div className={`flex-shrink-0 ${colors.text}`}>
                {action.icon}
              </div>

              {/* TEXT CONTENT */}
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${colors.text}`}>
                  {action.label}
                </p>
                {action.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {action.description}
                  </p>
                )}
              </div>

              {/* ARROW */}
              <div className={`flex-shrink-0 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <ChevronRight size={18} />
              </div>
            </button>
          )
        })}
      </div>

      {/* INFO FOOTER */}
      <div className="mt-6 pt-4 border-t border-neutral-700/30">
        <p className="text-xs text-neutral-500 text-center">
          💡 Run one-click optimize for best results
        </p>
      </div>
    </div>
  )
}

export default QuickActionsPanel
