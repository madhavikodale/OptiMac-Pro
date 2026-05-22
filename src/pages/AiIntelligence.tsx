import React, { useState, useEffect, useCallback } from 'react'
import { BrainCircuit, Sparkles, AlertTriangle, Zap, TrendingUp, ShieldCheck, Loader2, ChevronRight, Lightbulb, Gauge } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getSystemInfo, runOptimization, type SystemInfo } from '../lib/tauri'
import { useToast } from '../components/Toast'

interface Insight {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  category: string
  action?: string
  actionLabel?: string
}

export default function AiIntelligence() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [healthScore, setHealthScore] = useState(0)
  const toast = useToast()

  const generateInsights = useCallback((info: SystemInfo): Insight[] => {
    const results: Insight[] = []

    // Memory analysis
    if (info.memory.usage_percent > 85) {
      results.push({
        id: 'mem-critical',
        title: 'Critical Memory Usage',
        description: `Memory is at ${info.memory.usage_percent.toFixed(1)}%. Close unused applications or restart to free up RAM.`,
        severity: 'critical',
        category: 'Memory',
        action: 'free_memory',
        actionLabel: 'Free Memory Now',
      })
    } else if (info.memory.usage_percent > 70) {
      results.push({
        id: 'mem-warning',
        title: 'High Memory Usage',
        description: `Memory usage is at ${info.memory.usage_percent.toFixed(1)}%. Consider closing heavy applications.`,
        severity: 'warning',
        category: 'Memory',
      })
    } else {
      results.push({
        id: 'mem-ok',
        title: 'Memory Usage Healthy',
        description: `Memory usage is at ${info.memory.usage_percent.toFixed(1)}% - well within normal range.`,
        severity: 'success',
        category: 'Memory',
      })
    }

    // CPU analysis
    if (info.cpu.usage > 80) {
      results.push({
        id: 'cpu-high',
        title: 'High CPU Load',
        description: `CPU is at ${info.cpu.usage.toFixed(1)}%. Check Processes tab for resource hogs.`,
        severity: 'critical',
        category: 'CPU',
        action: 'view_processes',
        actionLabel: 'View Processes',
      })
    } else if (info.cpu.usage > 50) {
      results.push({
        id: 'cpu-moderate',
        title: 'Moderate CPU Usage',
        description: `CPU usage is ${info.cpu.usage.toFixed(1)}%. Normal for active workloads.`,
        severity: 'info',
        category: 'CPU',
      })
    } else {
      results.push({
        id: 'cpu-low',
        title: 'CPU Running Efficiently',
        description: `CPU usage is only ${info.cpu.usage.toFixed(1)}%. System is running efficiently.`,
        severity: 'success',
        category: 'CPU',
      })
    }

    // Disk analysis
    const fullDisks = info.disks.filter(d => d.usage_percent > 90)
    if (fullDisks.length > 0) {
      results.push({
        id: 'disk-critical',
        title: 'Disk Space Critical',
        description: `${fullDisks.length} disk(s) are over 90% full. Free up space immediately to avoid system slowdown.`,
        severity: 'critical',
        category: 'Storage',
        action: 'clear_cache',
        actionLabel: 'Clean Up Storage',
      })
    } else {
      const avgUsage = info.disks.length > 0
        ? info.disks.reduce((s, d) => s + d.usage_percent, 0) / info.disks.length
        : 0
      results.push({
        id: 'disk-ok',
        title: 'Storage Space Adequate',
        description: `Average disk usage is ${avgUsage.toFixed(1)}%. You have sufficient free space.`,
        severity: 'success',
        category: 'Storage',
      })
    }

    // Process analysis
    const highCpuProcs = info.processes.filter(p => p.cpu_usage > 10)
    if (highCpuProcs.length > 3) {
      results.push({
        id: 'procs-many',
        title: 'Multiple CPU-Intensive Processes',
        description: `${highCpuProcs.length} processes are using significant CPU. Consider closing unnecessary apps.`,
        severity: 'warning',
        category: 'Processes',
      })
    }

    // Uptime analysis
    const uptimeHours = info.uptime / 3600
    if (uptimeHours > 168) {
      results.push({
        id: 'uptime-high',
        title: 'System Uptime Very High',
        description: `System has been running for ${Math.floor(uptimeHours / 24)} days. A restart may improve performance.`,
        severity: 'info',
        category: 'System',
      })
    }

    // General recommendations
    if (results.filter(r => r.severity === 'critical' || r.severity === 'warning').length === 0) {
      results.push({
        id: 'system-healthy',
        title: 'System Running Optimally',
        description: 'All metrics are within healthy ranges. Your Mac is performing well!',
        severity: 'success',
        category: 'System',
      })
    }

    return results
  }, [])

  const calculateHealthScore = useCallback((info: SystemInfo): number => {
    let score = 100

    // Memory penalty
    if (info.memory.usage_percent > 85) score -= 25
    else if (info.memory.usage_percent > 70) score -= 15
    else if (info.memory.usage_percent > 50) score -= 5

    // CPU penalty
    if (info.cpu.usage > 80) score -= 20
    else if (info.cpu.usage > 50) score -= 10

    // Disk penalty
    const fullDisks = info.disks.filter(d => d.usage_percent > 90)
    score -= fullDisks.length * 15

    const highDisks = info.disks.filter(d => d.usage_percent > 75 && d.usage_percent <= 90)
    score -= highDisks.length * 5

    // Process penalty
    const highCpuProcs = info.processes.filter(p => p.cpu_usage > 10)
    score -= Math.min(highCpuProcs.length * 3, 15)

    return Math.max(0, Math.min(100, score))
  }, [])

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSystemInfo()
        setSystemInfo(data)
        setInsights(generateInsights(data))
        setHealthScore(calculateHealthScore(data))
      } catch (e) {
        toast?.addToast('Failed to analyze system', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
    const interval = setInterval(fetch, 5000)
    return () => clearInterval(interval)
  }, [generateInsights, calculateHealthScore, toast])

  const handleAction = async (action: string) => {
    if (action === 'view_processes') {
      window.location.hash = '#/processes'
      return
    }

    setOptimizing(true)
    try {
      const result = await runOptimization(action)
      toast?.addToast(result, 'success')
      const data = await getSystemInfo()
      setSystemInfo(data)
      setInsights(generateInsights(data))
      setHealthScore(calculateHealthScore(data))
    } catch (e) {
      toast?.addToast('Action failed', 'error')
    } finally {
      setOptimizing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#ef4444', icon: AlertTriangle }
      case 'warning': return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', icon: TrendingUp }
      case 'info': return { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', text: '#06b6d4', icon: Lightbulb }
      case 'success': return { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981', icon: ShieldCheck }
      default: return { bg: 'var(--bg-card)', border: 'var(--border-color)', text: 'var(--text-secondary)', icon: Sparkles }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#fbbf24'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 40) return 'Poor'
    return 'Critical'
  }

  return (
    <PageLayout title="AI Intelligence" subtitle="Smart system analysis and recommendations">
      {/* Health Score Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
      }}>
        <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-input)" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke={getScoreColor(healthScore)}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60 * (healthScore / 100)} ${2 * Math.PI * 60}`}
              strokeDashoffset={2 * Math.PI * 60 * 0.25}
              transform="rotate(-90 70 70)"
              style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: getScoreColor(healthScore) }}>
              {healthScore}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>Score</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {getScoreLabel(healthScore)}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Based on CPU, memory, disk, and process analysis
          </div>

          {systemInfo && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <MiniStat label="CPU" value={`${systemInfo.cpu.usage.toFixed(1)}%`} color={systemInfo.cpu.usage > 80 ? '#ef4444' : '#4ade80'} />
              <MiniStat label="Memory" value={`${systemInfo.memory.usage_percent.toFixed(1)}%`} color={systemInfo.memory.usage_percent > 85 ? '#ef4444' : '#4ade80'} />
              <MiniStat label="Disks" value={`${systemInfo.disks.length}`} color="#06b6d4" />
              <MiniStat label="Processes" value={`${systemInfo.processes.length}`} color="#8b5cf6" />
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
          ))
        ) : insights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <BrainCircuit size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            No insights available
          </div>
        ) : (
          insights.map(insight => {
            const style = getSeverityColor(insight.severity)
            const Icon = style.icon
            return (
              <div
                key={insight.id}
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${style.text}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: style.text,
                  flexShrink: 0,
                }}>
                  <Icon size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {insight.title}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: style.text,
                      padding: '2px 8px',
                      background: `${style.text}15`,
                      borderRadius: '4px',
                    }}>
                      {insight.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: insight.action ? '12px' : '0' }}>
                    {insight.description}
                  </div>
                  {insight.action && (
                    <button
                      onClick={() => handleAction(insight.action!)}
                      disabled={optimizing}
                      style={{
                        padding: '8px 16px',
                        background: style.text,
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: optimizing ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {optimizing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={14} />}
                      {insight.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </PageLayout>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-input)', borderRadius: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: '800', color }}>{value}</div>
    </div>
  )
}
