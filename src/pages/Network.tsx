import React, { useState, useEffect } from 'react'
import { Wifi, ArrowDown, ArrowUp, Activity, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import RealtimeChart from '../components/RealtimeChart'
import { getNetworkInfo, type NetworkInfo } from '../lib/tauri'

export default function Network() {
  const [networks, setNetworks] = useState<NetworkInfo[]>([])
  const [rxHistory, setRxHistory] = useState<{ time: string; value: number }[]>([])
  const [txHistory, setTxHistory] = useState<{ time: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNetworkInfo()
        setNetworks(data)

        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        const totalRx = data.reduce((sum, n) => sum + n.rx_bytes, 0)
        const totalTx = data.reduce((sum, n) => sum + n.tx_bytes, 0)

        setRxHistory(prev => {
          const next = [...prev, { time: now, value: totalRx / 1024 / 1024 }]
          return next.slice(-20)
        })
        setTxHistory(prev => {
          const next = [...prev, { time: now, value: totalTx / 1024 / 1024 }]
          return next.slice(-20)
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
    const interval = setInterval(fetch, 2000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <PageLayout title="Network" subtitle="Monitor network connections and bandwidth">
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <ArrowDown size={18} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Received</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {loading ? '...' : formatBytes(networks.reduce((s, n) => s + n.rx_bytes, 0))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <ArrowUp size={18} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Sent</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {loading ? '...' : formatBytes(networks.reduce((s, n) => s + n.tx_bytes, 0))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Wifi size={18} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Active Interfaces</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {loading ? '...' : networks.length}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <RealtimeChart data={rxHistory} color="#06b6d4" title="Download (MB)" unit="MB" />
        <RealtimeChart data={txHistory} color="#8b5cf6" title="Upload (MB)" unit="MB" />
      </div>

      {/* Interfaces Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px 100px', padding: '14px 20px', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interface</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Received</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Sent</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>RX Errors</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>TX Errors</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            Loading network info...
          </div>
        ) : networks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Activity size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            No network interfaces found
          </div>
        ) : (
          networks.map((net, i) => (
            <div
              key={net.interface_name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px 100px 100px',
                padding: '12px 20px',
                alignItems: 'center',
                borderBottom: i < networks.length - 1 ? '1px solid var(--border-color)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{net.interface_name}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>{formatBytes(net.rx_bytes)}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>{formatBytes(net.tx_bytes)}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: net.rx_errors > 0 ? '#ef4444' : 'var(--text-muted)', textAlign: 'right' }}>{net.rx_errors}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: net.tx_errors > 0 ? '#ef4444' : 'var(--text-muted)', textAlign: 'right' }}>{net.tx_errors}</span>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}
