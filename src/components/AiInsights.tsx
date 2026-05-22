import React, { useEffect, useState } from 'react'
import { Sparkles, AlertTriangle, Zap, TrendingUp, ChevronRight, Loader2 } from 'lucide-react'
import { getSystemInfo, type SystemInfo } from '../lib/tauri'

interface Insight {
  id: string
  type: 'warning' | 'tip' | 'critical' | 'info'
  title: string
  description: string
  action?: string
  icon: React.ElementType
}

function generateInsights(info: SystemInfo | null): Insight[] {
  if (!info) return []
  const insights: Insight[] = []

  if (info.memory.usage_percent > 85) {
    insights.push({
      id: 'mem-high',
      type: 'critical',
      title: 'High Memory Usage',
      description: `Memory at ${info.memory.usage_percent.toFixed(1)}%. Close unused applications to free up RAM.`,
      action: 'Optimize Now',
      icon: AlertTriangle,
    })
  } else if (info.memory.usage_percent > 70) {
    insights.push({
      id: 'mem-med',
      type: 'warning',
      title: 'Memory Pressure',
      description: `Memory usage is ${info.memory.usage_percent.toFixed(1)}%. Consider closing heavy apps.`,
      action: 'View Processes',
      icon: Zap,
    })
  }

  if (info.cpu.usage > 80) {
    insights.push({
      id: 'cpu-high',
      type: 'critical',
      title: 'CPU Under Heavy Load',
      description: `CPU at ${info.cpu.usage.toFixed(1)}%. A background process may be consuming resources.`,
      action: 'Check Processes',
      icon: AlertTriangle,
    })
  }

  const mainDisk = info.disks[0]
  if (mainDisk && mainDisk.usage_percent > 90) {
    insights.push({
      id: 'disk-full',
      type: 'critical',
      title: 'Disk Almost Full',
      description: `${mainDisk.name} is ${mainDisk.usage_percent.toFixed(1)}% full. Clean up files to prevent slowdowns.`,
      action: 'Clean Storage',
      icon: AlertTriangle,
    })
  } else if (mainDisk && mainDisk.usage_percent > 75) {
    insights.push({
      id: 'disk-high',
      type: 'warning',
      title: 'Disk Space Running Low',
      description: `${mainDisk.name} is ${mainDisk.usage_percent.toFixed(1)}% full.`,
      action: 'Free Space',
      icon: Zap,
    })
  }

  if (info.processes.length > 40) {
    insights.push({
      id: 'many-procs',
      type: 'info',
      title: 'Many Active Processes',
      description: `${info.processes.length} processes running. Some may be unnecessary.`,
      action: 'Review',
      icon: TrendingUp,
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'healthy',
      type: 'info',
      title: 'System Running Smoothly',
      description: 'All metrics are within normal ranges. Your Mac is performing well.',
      icon: Sparkles,
    })
  }

  return insights.slice(0, 4)
}

export default function AiInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const info = await getSystemInfo()
        setInsights(generateInsights(info))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
    const interval = setInterval(fetch, 5000)
    return () => clearInterval(interval)
  }, [])

  const colors = {
    critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '#ef4444' },
    warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', icon: '#fbbf24' },
    tip: { bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', icon: '#06b6d4' },
    info: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '#10b981' },
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', color: 'var(--text-muted)' }}>
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', fontWeight: '500' }}>Analyzing system...</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {insights.map((insight) => {
        const color = colors[insight.type]
        const Icon = insight.icon
        return (
          <div
            key={insight.id}
            style={{
              padding: '14px 16px',
              background: color.bg,
              border: `1px solid ${color.border}`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'all 0.2s',
              cursor: insight.action ? 'pointer' : 'default',
            }}
            onMouseEnter={(e) => {
              if (insight.action) {
                e.currentTarget.style.transform = 'translateX(4px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              <Icon size={16} style={{ color: color.icon }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {insight.title}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {insight.description}
              </div>
            </div>
            {insight.action && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: color.icon, fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                {insight.action}
                <ChevronRight size={14} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
