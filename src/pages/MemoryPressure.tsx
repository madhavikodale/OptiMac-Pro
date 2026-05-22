import React, { useState, useEffect } from 'react'
import { Gauge, AlertTriangle, Activity, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getMemoryPressure, type MemoryPressure } from '../lib/tauri'

export default function MemoryPressurePage() {
  const [pressure, setPressure] = useState<MemoryPressure | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPressure()
    const interval = setInterval(loadPressure, 5000)
    return () => clearInterval(interval)
  }, [])

  async function loadPressure() {
    try {
      setLoading(true)
      const data = await getMemoryPressure()
      setPressure(data)
    } catch (err) {
      console.error('Failed to load memory pressure:', err)
    } finally {
      setLoading(false)
    }
  }

  function getPressureColor(level: string): string {
    switch (level) {
      case 'Normal': return '#4ade80'
      case 'Moderate': return '#fbbf24'
      case 'High': return '#fb923c'
      case 'Critical': return '#f87171'
      default: return '#9ca3af'
    }
  }

  function formatPages(pages: number): string {
    const bytes = pages * 4096
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  }

  return (
    <PageLayout title="Memory Pressure" subtitle="Detailed memory usage analysis">
      {loading && !pressure ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pressure Level */}
          <div
            className="rounded-2xl p-6 border backdrop-blur-xl"
            style={{
              background: `rgba(${pressure?.pressure_level === 'Normal' ? '34,197,94' : pressure?.pressure_level === 'Moderate' ? '251,191,36' : pressure?.pressure_level === 'High' ? '251,146,60' : '239,68,68'},0.1)`,
              borderColor: `rgba(${pressure?.pressure_level === 'Normal' ? '34,197,94' : pressure?.pressure_level === 'Moderate' ? '251,191,36' : pressure?.pressure_level === 'High' ? '251,146,60' : '239,68,68'},0.3)`,
            }}
          >
            <div className="flex items-center gap-4">
              {pressure?.pressure_level === 'Normal' ? (
                <Gauge className="w-12 h-12" style={{ color: '#4ade80' }} />
              ) : (
                <AlertTriangle className="w-12 h-12" style={{ color: getPressureColor(pressure?.pressure_level || '') }} />
              )}
              <div>
                <h3 className="text-2xl font-bold" style={{ color: getPressureColor(pressure?.pressure_level || '') }}>
                  {pressure?.pressure_level}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Memory pressure indicates how hard your system is working to allocate memory
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active', value: pressure?.pages_active || 0, color: '#22d3ee' },
              { label: 'Inactive', value: pressure?.pages_inactive || 0, color: '#a78bfa' },
              { label: 'Wired', value: pressure?.pages_wired || 0, color: '#f472b6' },
              { label: 'Free', value: pressure?.pages_free || 0, color: '#4ade80' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 border backdrop-blur-xl"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </p>
                <p className="text-xl font-bold" style={{ color: stat.color }}>
                  {formatPages(stat.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Swap & Compression */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-6 border backdrop-blur-xl"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-orange-400" />
                <span className="font-medium">Swap Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Used</span>
                  <span>{formatPages(pressure?.swap_used || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Total</span>
                  <span>{formatPages(pressure?.swap_total || 0)}</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 border backdrop-blur-xl"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">Memory Compression</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Compressions</span>
                  <span>{(pressure?.compressions || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Decompressions</span>
                  <span>{(pressure?.decompressions || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
