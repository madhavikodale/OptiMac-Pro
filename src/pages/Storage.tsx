import React, { useState, useEffect } from 'react'
import { HardDrive, FolderOpen, Trash2, Loader2, Zap } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getDiskInfo, runOptimization, type DiskInfo } from '../lib/tauri'
import { useToast } from '../components/Toast'

export default function Storage() {
  const [disks, setDisks] = useState<DiskInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getDiskInfo()
        setDisks(data)
      } catch (e) {
        toast?.addToast('Failed to fetch disk info', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [toast])

  const handleClean = async () => {
    setCleaning(true)
    try {
      const result = await runOptimization('clear_cache')
      toast?.addToast(result, 'success')
      const data = await getDiskInfo()
      setDisks(data)
    } catch (e) {
      toast?.addToast('Cleanup failed', 'error')
    } finally {
      setCleaning(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <PageLayout title="Storage" subtitle="View detailed storage breakdown and usage">
      {/* Quick Clean */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Quick Cleanup</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Clear system cache and temporary files</div>
            </div>
          </div>
          <button
            onClick={handleClean}
            disabled={cleaning}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              cursor: cleaning ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(6,182,212,0.25)',
            }}
          >
            {cleaning ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
            {cleaning ? 'Cleaning...' : 'Clean Now'}
          </button>
        </div>
      </div>

      {/* Disks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
          ))
        ) : disks.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <HardDrive size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            No disks found
          </div>
        ) : (
          disks.map((disk) => (
            <div
              key={disk.name}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <HardDrive size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{disk.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>{disk.mount_point}</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Usage</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{disk.usage_percent.toFixed(1)}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(disk.usage_percent, 100)}%`,
                      background: disk.usage_percent > 90 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : disk.usage_percent > 75 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: '4px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Total</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{formatBytes(disk.total)}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Used</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{formatBytes(disk.used)}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Free</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#4ade80' }}>{formatBytes(disk.free)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}
