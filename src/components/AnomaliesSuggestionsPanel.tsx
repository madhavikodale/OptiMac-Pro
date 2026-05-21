import React, { useState } from 'react'
import { AlertCircle, Lightbulb, Check, X } from 'lucide-react'

interface Anomaly {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  icon?: React.ReactNode
}

interface Suggestion {
  id: string
  title: string
  description: string
  category: string
  icon?: React.ReactNode
  actionLabel?: string
}

interface AnomaliesSuggestionsProps {
  anomalies?: Anomaly[]
  suggestions?: Suggestion[]
  onDismissAnomaly?: (id: string) => void
  onApplySuggestion?: (id: string) => void
}

export const AnomaliesSuggestionsPanel: React.FC<AnomaliesSuggestionsProps> = ({
  anomalies = [
    {
      id: '1',
      title: 'No anomalies detected.',
      description: 'Your system is running perfectly.',
      severity: 'low',
    },
  ],
  suggestions = [
    {
      id: '1',
      title: 'No suggestions at this time.',
      description: "We'll notify you when optimization opportunities are found.",
      category: 'System',
    },
  ],
  onDismissAnomaly,
  onApplySuggestion,
}) => {
  const [dismissedAnomalies, setDismissedAnomalies] = useState<string[]>([])
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([])

  const handleDismissAnomaly = (id: string) => {
    setDismissedAnomalies([...dismissedAnomalies, id])
    onDismissAnomaly?.(id)
  }

  const handleApplySuggestion = (id: string) => {
    setAppliedSuggestions([...appliedSuggestions, id])
    onApplySuggestion?.(id)
  }

  const visibleAnomalies = anomalies.filter(
    (a) => !dismissedAnomalies.includes(a.id)
  )
  const visibleSuggestions = suggestions.filter(
    (s) => !appliedSuggestions.includes(s.id)
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: 'text-red-400',
        }
      case 'high':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          icon: 'text-orange-400',
        }
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
        }
      case 'low':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'text-green-400',
        }
      default:
        return {
          bg: 'bg-neutral-800/30',
          border: 'border-neutral-700/30',
          icon: 'text-neutral-400',
        }
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      {/* ANOMALIES PANEL */}
      <div
        className="glass rounded-2xl p-6"
        style={{
          background: 'rgba(26, 31, 53, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={20} className="text-red-400" />
          <h2 className="text-lg font-semibold text-neutral-50">
            Anomalies ({visibleAnomalies.length})
          </h2>
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
          {visibleAnomalies.length === 0 ? (
            <div className="text-center py-8">
              <Check size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">All clear!</p>
            </div>
          ) : (
            visibleAnomalies.map((anomaly) => {
              const colors = getSeverityColor(anomaly.severity)
              return (
                <div
                  key={anomaly.id}
                  className={`
                    p-4 rounded-lg border
                    ${colors.bg} ${colors.border}
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-0.5 ${colors.icon}`}>
                      {anomaly.icon || <AlertCircle size={18} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-200">
                        {anomaly.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {anomaly.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismissAnomaly(anomaly.id)}
                      className="flex-shrink-0 p-1.5 hover:bg-neutral-700 rounded transition-colors"
                      title="Dismiss"
                    >
                      <X size={16} className="text-neutral-400" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* SUGGESTIONS PANEL */}
      <div
        className="glass rounded-2xl p-6"
        style={{
          background: 'rgba(26, 31, 53, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-neutral-50">
            Suggestions ({visibleSuggestions.length})
          </h2>
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
          {visibleSuggestions.length === 0 ? (
            <div className="text-center py-8">
              <Check size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">No suggestions at this time.</p>
            </div>
          ) : (
            visibleSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`
                  p-4 rounded-lg border
                  bg-cyan-500/10 border-cyan-500/30
                  transition-all duration-200
                  hover:bg-cyan-500/20
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 text-cyan-400">
                    {suggestion.icon || <Lightbulb size={18} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-200">
                      {suggestion.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplySuggestion(suggestion.id)}
                    className="
                      flex-shrink-0 px-2 py-1
                      bg-cyan-500 text-white text-xs font-semibold
                      rounded transition-all hover:bg-cyan-600
                    "
                  >
                    {suggestion.actionLabel || 'Apply'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AnomaliesSuggestionsPanel
