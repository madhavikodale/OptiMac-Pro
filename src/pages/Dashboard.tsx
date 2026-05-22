import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { TrendingUp, TrendingDown, Zap, BarChart3, HardDrive, Cpu, MemoryStick, ShieldCheck, Sparkles } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import RealtimeChart from '../components/RealtimeChart'
import AiInsights from '../components/AiInsights'
import { getSystemInfo, getCpuUsage, getMemoryInfo, type SystemInfo } from '../lib/tauri'
import { useToast } from '../components/Toast'

function StatCard({ label, value, sub, icon: Icon, trend, color }: any) {
  const isUp = trend === 'up'
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.borderColor = 'var(--border-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border-color)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            border: `1px solid ${color}25`,
          }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {trend && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: isUp ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
              color: isUp ? '#4ade80' : '#ef4444',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {sub}
          </div>
        )}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: '1.1', marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  )
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{Math.round(value)}%</span>
        </div>
      </div>
      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  )
}

function PerformanceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{value.toFixed(1)}%</span>
      </div>
      <div style={{ height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(value, 100)}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            borderRadius: '3px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [cpuHistory, setCpuHistory] = useState<{ time: string; value: number }[]>([])
  const [memHistory, setMemHistory] = useState<{ time: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getSystemInfo()
        setSystemInfo(info)

        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

        setCpuHistory(prev => {
          const next = [...prev, { time: now, value: info.cpu.usage }]
          return next.slice(-20)
        })
        setMemHistory(prev => {
          const next = [...prev, { time: now, value: info.memory.usage_percent }]
          return next.slice(-20)
        })
      } catch (e) {
        console.error('Failed to fetch system info:', e)
        toast?.addToast('Failed to fetch system metrics', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [toast])

  const stats = useMemo(() => {
    if (!systemInfo) return []
    return [
      { label: 'CPU Usage', value: `${systemInfo.cpu.usage.toFixed(1)}%`, sub: `${systemInfo.cpu.cores} cores`, icon: Cpu, trend: systemInfo.cpu.usage > 50 ? 'up' : 'down', color: '#06b6d4' },
      { label: 'Memory', value: `${systemInfo.memory.usage_percent.toFixed(1)}%`, sub: `${formatBytes(systemInfo.memory.used)} / ${formatBytes(systemInfo.memory.total)}`, icon: MemoryStick, trend: systemInfo.memory.usage_percent > 80 ? 'up' : 'down', color: '#8b5cf6' },
      { label: 'Disk Usage', value: systemInfo.disks[0] ? `${systemInfo.disks[0].usage_percent.toFixed(1)}%` : '0%', sub: systemInfo.disks[0]?.name || 'N/A', icon: HardDrive, trend: 'down', color: '#f59e0b' },
      { label: 'Processes', value: `${systemInfo.processes.length}`, sub: 'Active', icon: BarChart3, trend: 'up', color: '#10b981' },
    ]
  }, [systemInfo, formatBytes])

  if (loading) {
    return (
      <PageLayout title="Dashboard" subtitle="System health and performance metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '16px' }} />
          ))}
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Dashboard" subtitle={`${systemInfo?.hostname || 'System'} · ${systemInfo?.os_version || ''}`}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <RealtimeChart data={cpuHistory} color="#06b6d4" title="CPU Usage History" />
        <RealtimeChart data={memHistory} color="#8b5cf6" title="Memory Usage History" />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* System Health */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <ShieldCheck size={18} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>System Health</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
            <HealthRing value={100 - (systemInfo?.cpu.usage || 0)} label="CPU" color="#06b6d4" />
            <HealthRing value={100 - (systemInfo?.memory.usage_percent || 0)} label="Memory" color="#8b5cf6" />
            <HealthRing value={systemInfo?.disks[0] ? 100 - systemInfo.disks[0].usage_percent : 100} label="Disk" color="#f59e0b" />
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <PerformanceBar label="CPU Load" value={systemInfo?.cpu.usage || 0} color="#06b6d4" />
            <PerformanceBar label="Memory Pressure" value={systemInfo?.memory.usage_percent || 0} color="#8b5cf6" />
            <PerformanceBar label="Disk Activity" value={systemInfo?.disks[0]?.usage_percent || 0} color="#f59e0b" />
          </div>
        </div>

        {/* AI Insights */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>AI Insights</h3>
          </div>
          <AiInsights />
        </div>
      </div>
    </PageLayout>
  )
}
