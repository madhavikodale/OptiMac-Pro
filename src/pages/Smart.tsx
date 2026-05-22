import React, { useState, useEffect } from 'react'
import { HardDrive, Thermometer, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getSmartData, type SmartData } from '../lib/tauri'

export default function Smart() {
  const [disks, setDisks] = useState<SmartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSmart()
  }, [])

  async function loadSmart() {
    try {
      setLoading(true)
      const data = await getSmartData()
      setDisks(data)
    } catch (err) {
      console.error('Failed to load SMART data:', err)
    } finally {
      setLoading(false)
    }
  }

  function getHealthColor(health: string): string {
    if (health === 'Verified') return '#4ade80'
    if (health === 'Failing') return '#f87171'
    return '#fbbf24'
  }

  return (
    <PageLayout title="Disk Health" subtitle="S.M.A.R.T. status monitoring">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {disks.length === 0 ? (
            <div
              className="rounded-2xl p-8 border text-center"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <HardDrive className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium">No disk information available</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                SMART data may require elevated permissions
              </p>
            </div>
          ) : (
            disks.map((disk) => (
              <div
                key={disk.disk_name}
                className="rounded-2xl border overflow-hidden"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(6,182,212,0.1)' }}
                    >
                      <HardDrive className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{disk.disk_name}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        S.M.A.R.T. Status
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {disk.overall_health === 'Verified' ? (
                      <CheckCircle className="w-5 h-5" style={{ color: '#4ade80' }} />
                    ) : (
                      <AlertTriangle className="w-5 h-5" style={{ color: '#f87171' }} />
                    )}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `${getHealthColor(disk.overall_health)}20`,
                        color: getHealthColor(disk.overall_health),
                      }}
                    >
                      {disk.overall_health}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Thermometer className="w-5 h-5 mx-auto mb-2 text-orange-400" />
                    <p className="text-lg font-bold">{disk.temperature.toFixed(0)}°C</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Temperature</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                    <p className="text-lg font-bold">{disk.power_on_hours.toLocaleString()}h</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Power On</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
                    <p className="text-lg font-bold">{disk.reallocated_sectors}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reallocated</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                      <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{disk.life_remaining}%</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Life Remaining</p>
                  </div>
                </div>

                {/* Life Bar */}
                <div className="px-6 pb-6">
                  <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    <span>Disk Life</span>
                    <span>{disk.life_remaining}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${disk.life_remaining}%`,
                        background: disk.life_remaining > 80 ? '#4ade80' : disk.life_remaining > 50 ? '#fbbf24' : '#f87171',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </PageLayout>
  )
}
