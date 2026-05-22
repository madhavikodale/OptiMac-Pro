import React, { useState, useEffect } from 'react'
import { Battery, BatteryCharging, BatteryWarning, Thermometer, Zap, RotateCcw, Activity, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getBatteryInfo, type BatteryInfo } from '../lib/tauri'
import { useToast } from '../components/Toast'

export default function BatteryPage() {
  const [battery, setBattery] = useState<BatteryInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBatteryInfo()
        setBattery(data)
      } catch (e) {
        toast?.addToast('Failed to fetch battery info', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [toast])

  const getHealthColor = (health: number) => {
    if (health > 80) return '#4ade80'
    if (health > 60) return '#fbbf24'
    return '#ef4444'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Charging': return <BatteryCharging size={20} />
      case 'Discharging': return <Battery size={20} />
      default: return <Activity size={20} />
    }
  }

  if (loading) {
    return (
      <PageLayout title="Battery" subtitle="Monitor battery health and status">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginRight: '12px' }} />
          Loading battery info...
        </div>
      </PageLayout>
    )
  }

  if (!battery || !battery.has_battery) {
    return (
      <PageLayout title="Battery" subtitle="Monitor battery health and status">
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <BatteryWarning size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Battery Detected</div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>This appears to be a desktop Mac without a battery.</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Battery" subtitle="Monitor battery health and status">
      {/* Main Battery Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${getHealthColor(battery.health_percent)}20 0%, ${getHealthColor(battery.health_percent)}10 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getHealthColor(battery.health_percent),
            }}>
              {getStatusIcon(battery.status)}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{battery.status}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>{battery.time_remaining} remaining</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '36px', fontWeight: '800', color: getHealthColor(battery.health_percent) }}>{battery.health_percent.toFixed(1)}%</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Battery Health</div>
          </div>
        </div>

        {/* Health Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(battery.health_percent, 100)}%`,
              background: `linear-gradient(90deg, ${getHealthColor(battery.health_percent)}, ${getHealthColor(battery.health_percent)}aa)`,
              borderRadius: '5px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={<RotateCcw size={18} />} label="Cycle Count" value={battery.cycle_count.toString()} color="#8b5cf6" />
        <StatCard icon={<Zap size={18} />} label="Voltage" value={`${battery.voltage.toFixed(2)}V`} color="#06b6d4" />
        <StatCard icon={<Thermometer size={18} />} label="Temperature" value={`${battery.temperature.toFixed(1)}°C`} color="#f59e0b" />
      </div>

      {/* Capacity Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Design Capacity</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{battery.design_capacity} mAh</div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginTop: '4px' }}>Factory original capacity</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Current Capacity</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{battery.current_capacity} mAh</div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginTop: '4px' }}>Current maximum capacity</div>
        </div>
      </div>
    </PageLayout>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ color: color }}>{icon}</div>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}
