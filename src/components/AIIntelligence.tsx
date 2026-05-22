import React, { useState } from 'react'
import { Brain, Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Insight {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  recommendation: string
  impact: string
}

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Chrome Using Excessive Memory',
    description: 'Google Chrome is consuming 2.1 GB of RAM, which is 23% of your total system memory.',
    priority: 'high',
    recommendation: 'Consider closing unused tabs or switching to Safari for better efficiency.',
    impact: 'Could free up ~800 MB RAM',
  },
  {
    id: '2',
    title: 'Background App Refresh Enabled',
    description: 'Multiple applications are running in the background even when not in use.',
    priority: 'medium',
    recommendation: 'Disable background refresh for apps you don\'t need constant updates from.',
    impact: 'Could improve battery life by 15%',
  },
  {
    id: '3',
    title: 'Startup Items Slowing Boot',
    description: 'You have 8 applications starting at boot, adding ~12 seconds to startup time.',
    priority: 'medium',
    recommendation: 'Disable unnecessary startup items in System Preferences.',
    impact: 'Could reduce boot time by 12s',
  },
  {
    id: '4',
    title: 'Cache Files Accumulating',
    description: 'Browser and application cache has grown to 4.2 GB.',
    priority: 'low',
    recommendation: 'Run the Junk Cleaner to safely remove cached files.',
    impact: 'Could free up 3.5 GB space',
  },
  {
    id: '5',
    title: 'SSD Health Excellent',
    description: 'Your SSD is in perfect condition with no SMART errors detected.',
    priority: 'low',
    recommendation: 'Continue monitoring through regular health checks.',
    impact: 'No action needed',
  },
]

export const AIIntelligence: React.FC = () => {
  const { isDark } = useTheme()
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([])

  const handleDismiss = (id: string) => {
    setDismissedInsights((prev) => [...prev, id])
  }

  const visibleInsights = mockInsights.filter((i) => !dismissedInsights.includes(i.id))

  const highPriorityCount = visibleInsights.filter((i) => i.priority === 'high').length
  const avgImpact = (visibleInsights.length > 0 ? visibleInsights.length : 1)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border border-red-500/30'
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border border-green-500/30'
      default:
        return ''
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={18} />
      case 'medium':
        return <Lightbulb size={18} />
      case 'low':
        return <CheckCircle size={18} />
      default:
        return null
    }
  }

  return (
    <div className={`min-h-full p-6 md:p-8 transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
          <Brain className="text-cyan-400" size={32} />
          AI Intelligence
        </h1>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Machine learning-powered system analysis and recommendations</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Insights</p>
          <p className="text-2xl font-bold text-cyan-400">{visibleInsights.length}</p>
        </div>
        <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>High Priority</p>
          <p className="text-2xl font-bold text-red-400">{highPriorityCount}</p>
        </div>
        <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Potential Impact</p>
          <p className="text-2xl font-bold text-purple-400">{avgImpact}</p>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="space-y-4">
        {visibleInsights.length > 0 ? (
          visibleInsights.map((insight) => (
            <div
              key={insight.id}
              className={`glass rounded-xl p-6 border transition-all ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getPriorityIcon(insight.priority)}
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
                  <p className="text-sm text-white/70 mb-3">{insight.description}</p>

                  <div className="bg-black/20 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-white/80 mb-1">Recommendation:</p>
                    <p className="text-sm text-white/70">{insight.recommendation}</p>
                  </div>

                  <p className="text-xs text-white/60">Impact: {insight.impact}</p>
                </div>

                <button
                  onClick={() => handleDismiss(insight.id)}
                  className="flex-shrink-0 text-white/40 hover:text-white/60 transition-colors mt-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 glass rounded-xl border border-green-500/30 bg-green-500/10">
            <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
            <p className="text-white font-semibold mb-2">System Optimized!</p>
            <p className="text-white/50">All insights have been addressed. Your system is running optimally.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIIntelligence
