import React, { useState, useEffect } from 'react'
import { Layers, XCircle, Search, ArrowUpDown, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getProcesses, killProcess, type ProcessInfo } from '../lib/tauri'
import { useToast } from '../components/Toast'

export default function Processes() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'cpu' | 'memory'>('cpu')
  const [loading, setLoading] = useState(true)
  const [killing, setKilling] = useState<number | null>(null)
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProcesses()
        setProcesses(data)
      } catch (e) {
        toast?.addToast('Failed to fetch processes', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetch()
    const interval = setInterval(fetch, 3000)
    return () => clearInterval(interval)
  }, [toast])

  const filtered = processes
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortBy === 'cpu' ? b.cpu_usage - a.cpu_usage : b.memory_mb - a.memory_mb))

  const handleKill = async (pid: number) => {
    setKilling(pid)
    try {
      const success = await killProcess(pid)
      if (success) {
        toast?.addToast(`Process ${pid} terminated`, 'success')
        setProcesses((prev) => prev.filter((p) => p.pid !== pid))
      } else {
        toast?.addToast(`Failed to kill process ${pid}`, 'error')
      }
    } catch (e) {
      toast?.addToast('Error killing process', 'error')
    } finally {
      setKilling(null)
    }
  }

  return (
    <PageLayout title="Processes" subtitle="Manage running applications and processes">
      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search processes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'cpu' ? 'memory' : 'cpu')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          <ArrowUpDown size={14} />
          Sort by {sortBy === 'cpu' ? 'CPU' : 'Memory'}
        </button>
      </div>

      {/* Process Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 100px 80px', padding: '14px 20px', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PID</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>CPU %</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Memory</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Status</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Action</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            Loading processes...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Layers size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            No processes found
          </div>
        ) : (
          filtered.map((process, i) => (
            <div
              key={process.pid}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 100px 100px 100px 80px',
                padding: '12px 20px',
                alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border-color)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{process.pid}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{process.name}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: process.cpu_usage > 50 ? '#ef4444' : process.cpu_usage > 20 ? '#fbbf24' : '#4ade80', textAlign: 'right' }}>
                {process.cpu_usage.toFixed(1)}%
              </span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>{process.memory_mb} MB</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>{process.status}</span>
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleKill(process.pid)}
                  disabled={killing === process.pid}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '6px',
                    color: '#ef4444',
                    cursor: killing === process.pid ? 'wait' : 'pointer',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {killing === process.pid ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={12} />}
                  Kill
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  )
}
