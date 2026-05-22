import React, { useState, useEffect } from 'react'
import { Thermometer, Flame, Snowflake, AlertTriangle, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getTemperatures, type TemperatureInfo } from '../lib/tauri'
import { useToast } from '../components/Toast'

export default function Temperature() {
  const [temps, setTemps] = useState<TemperatureInfo[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTemperatures()
        setTemps(data)
      } catch (e) {
        toast?.addToast('Failed to fetch temperatures', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
    const interval = setInterval(fetch, 5000)
    return () => clearInterval(interval)
  }, [toast])

  const getTempColor = (value: number) => {
    if (value > 80) return '#ef4444'
    if (value > 65) return '#f59e0b'
    if (value > 50) return '#fbbf24'
    return '#4ade80'
  }

  const getTempIcon = (value: number) => {
    if (value > 80) return <Flame size={20} />
    if (value < 40) return <Snowflake size={20} />
    return <Thermometer size={20} />
  }

  const getTempStatus = (value: number) => {
    if (value > 80) return 'Critical'
    if (value > 65) return 'Hot'
    if (value > 50) return 'Warm'
    return 'Normal'
  }

  return (
    <PageLayout title="Temperature" subtitle="Monitor CPU and system thermal sensors">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
          ))
        ) : temps.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Thermometer size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            No temperature sensors found
          </div>
        ) : (
          temps.map((temp) => (
            <div
              key={temp.sensor}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${getTempColor(temp.value)}20 0%, ${getTempColor(temp.value)}10 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getTempColor(temp.value),
                  }}>
                    {getTempIcon(temp.value)}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{temp.sensor}</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: getTempColor(temp.value) }}>{getTempStatus(temp.value)}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: getTempColor(temp.value) }}>
                    {temp.value.toFixed(1)}{temp.unit}
                  </div>
                </div>
              </div>

              <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min((temp.value / 100) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${getTempColor(temp.value)}, ${getTempColor(temp.value)}aa)`,
                  borderRadius: '4px',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>

              {temp.value > 80 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  <AlertTriangle size={14} />
                  High temperature detected - check cooling
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}
