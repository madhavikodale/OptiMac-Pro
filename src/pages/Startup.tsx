import React, { useState, useEffect } from 'react'
import { Power, Trash2, Loader2, Shield, User, Zap } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getStartupItems, removeStartupItem, type StartupItem } from '../lib/tauri'
import { useToast } from '../components/Toast'

export default function Startup() {
  const [items, setItems] = useState<StartupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getStartupItems()
        setItems(data)
      } catch (e) {
        toast?.addToast('Failed to fetch startup items', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [toast])

  const handleRemove = async (item: StartupItem) => {
    const key = `${item.name}-${item.kind}`
    setRemoving(key)
    try {
      const success = await removeStartupItem(item.name, item.kind)
      if (success) {
        toast?.addToast(`Removed ${item.name}`, 'success')
        setItems(prev => prev.filter(i => !(i.name === item.name && i.kind === item.kind)))
      } else {
        toast?.addToast(`Failed to remove ${item.name}`, 'error')
      }
    } catch (e) {
      toast?.addToast('Error removing startup item', 'error')
    } finally {
      setRemoving(null)
    }
  }

  const getIcon = (kind: string) => {
    switch (kind) {
      case 'LaunchAgent': return <User size={16} />
      case 'LaunchDaemon': return <Shield size={16} />
      case 'Login Item': return <Power size={16} />
      default: return <Zap size={16} />
    }
  }

  const getColor = (kind: string) => {
    switch (kind) {
      case 'LaunchAgent': return '#06b6d4'
      case 'LaunchDaemon': return '#8b5cf6'
      case 'Login Item': return '#f59e0b'
      default: return '#10b981'
    }
  }

  return (
    <PageLayout title="Startup Items" subtitle="Manage applications that launch at login">
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 100px', padding: '14px 20px', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Status</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Action</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            Loading startup items...
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Power size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            No startup items found
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={`${item.name}-${item.kind}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px 100px 100px',
                padding: '14px 20px',
                alignItems: 'center',
                borderBottom: i < items.length - 1 ? '1px solid var(--border-color)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${getColor(item.kind)}20 0%, ${getColor(item.kind)}10 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getColor(item.kind),
                }}>
                  {getIcon(item.kind)}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</span>
              </div>

              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: getColor(item.kind),
                padding: '4px 10px',
                background: `${getColor(item.kind)}15`,
                borderRadius: '6px',
                display: 'inline-block',
                width: 'fit-content',
              }}>
                {item.kind}
              </span>

              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: item.enabled ? '#4ade80' : '#ef4444',
                  padding: '4px 10px',
                  background: item.enabled ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                  borderRadius: '6px',
                }}>
                  {item.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleRemove(item)}
                  disabled={removing === `${item.name}-${item.kind}`}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '6px',
                    color: '#ef4444',
                    cursor: removing === `${item.name}-${item.kind}` ? 'wait' : 'pointer',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {removing === `${item.name}-${item.kind}` ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={12} />}
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}
