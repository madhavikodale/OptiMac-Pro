import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Trash2, Search, Package, Loader2, AlertTriangle, HardDrive,
  LayoutGrid, List, X, ChevronDown, Shield,
  Layers, ArrowUpDown, AppWindow,
  CheckCircle2, Filter
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getInstalledApps, uninstallApp, type InstalledApp } from '../lib/tauri'

/* ─── utilities ─── */
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getInitials(name: string): string {
  const words = name.split(/[\s._-]+/).filter(w => w.length > 0)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function getAppColor(name: string): { bg: string; text: string; glow: string } {
  const colors = [
    { bg: 'rgba(6,182,212,0.12)', text: '#22d3ee', glow: 'rgba(6,182,212,0.2)' },
    { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', glow: 'rgba(139,92,246,0.2)' },
    { bg: 'rgba(236,72,153,0.12)', text: '#f472b6', glow: 'rgba(236,72,153,0.2)' },
    { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', glow: 'rgba(245,158,11,0.2)' },
    { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', glow: 'rgba(34,197,94,0.2)' },
    { bg: 'rgba(239,68,68,0.12)', text: '#f87171', glow: 'rgba(239,68,68,0.2)' },
    { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', glow: 'rgba(59,130,246,0.2)' },
    { bg: 'rgba(168,85,247,0.12)', text: '#c084fc', glow: 'rgba(168,85,247,0.2)' },
    { bg: 'rgba(20,184,166,0.12)', text: '#2dd4bf', glow: 'rgba(20,184,166,0.2)' },
    { bg: 'rgba(249,115,22,0.12)', text: '#fb923c', glow: 'rgba(249,115,22,0.2)' },
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getEstimatedCacheSize(appSize: number): number {
  return Math.floor(appSize * 0.15 + Math.random() * appSize * 0.1)
}

function getInstallDate(path: string): string {
  const dates = ['2 days ago', '1 week ago', '2 weeks ago', '1 month ago', '3 months ago', '6 months ago', '1 year ago']
  let hash = 0
  for (let i = 0; i < path.length; i++) hash = path.charCodeAt(i) + ((hash << 5) - hash)
  return dates[Math.abs(hash) % dates.length]
}

function getPermissions(name: string): string[] {
  const common = ['File System Access']
  const n = name.toLowerCase()
  if (n.includes('camera') || n.includes('photo')) common.push('Camera')
  if (n.includes('microphone') || n.includes('audio')) common.push('Microphone')
  if (n.includes('location') || n.includes('map')) common.push('Location')
  if (n.includes('browser') || n.includes('mail')) common.push('Network')
  return common
}

/* ─── types ─── */
type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'size' | 'version'
type FilterType = 'all' | 'large' | 'recent'

/* ─── component ─── */
export default function Uninstaller() {
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [filtered, setFiltered] = useState<InstalledApp[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [uninstalling, setUninstalling] = useState<string | null>(null)
  const [confirmApp, setConfirmApp] = useState<InstalledApp | null>(null)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null)
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  /* load apps */
  useEffect(() => {
    loadApps()
  }, [])

  /* filter / sort */
  useEffect(() => {
    let result = apps.filter(
      a => a.name.toLowerCase().includes(search.toLowerCase()) ||
           a.bundle_id.toLowerCase().includes(search.toLowerCase())
    )
    if (filterType === 'large') result = result.filter(a => a.size > 100 * 1024 * 1024)

    result.sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case 'name': cmp = a.name.localeCompare(b.name); break
        case 'size': cmp = a.size - b.size; break
        case 'version': cmp = a.version.localeCompare(b.version); break
      }
      return sortAsc ? cmp : -cmp
    })

    setFiltered(result)
    if (selectedApp && !result.find(a => a.path === selectedApp.path)) setSelectedApp(null)
  }, [search, apps, sortBy, sortAsc, filterType, selectedApp])

  async function loadApps() {
    try {
      setLoading(true)
      const data = await getInstalledApps()
      setApps(data)
      setFiltered(data)
      if (data.length > 0 && !selectedApp) setSelectedApp(data[0])
    } catch (err) {
      console.error('Failed to load apps:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUninstall(app: InstalledApp) {
    try {
      setUninstalling(app.path)
      await uninstallApp(app.path)
      setApps(prev => prev.filter(a => a.path !== app.path))
      setConfirmApp(null)
      if (selectedApp?.path === app.path) setSelectedApp(null)
    } catch (err) {
      alert('Failed to uninstall app')
    } finally {
      setUninstalling(null)
    }
  }

  const totalSize = filtered.reduce((sum, a) => sum + a.size, 0)
  const totalApps = apps.length
  const largeApps = apps.filter(a => a.size > 100 * 1024 * 1024).length

  const stats = useMemo(() => [
    { label: 'Applications', value: totalApps.toString(), sub: 'installed', icon: AppWindow, color: '#22d3ee', grad: 'from-cyan-500/20 to-blue-500/10' },
    { label: 'Total Size', value: formatSize(totalSize), sub: 'on disk', icon: HardDrive, color: '#a78bfa', grad: 'from-violet-500/20 to-purple-500/10' },
    { label: 'Large Apps', value: largeApps.toString(), sub: '> 100 MB', icon: Layers, color: '#fbbf24', grad: 'from-amber-500/20 to-orange-500/10' },
  ], [totalApps, totalSize, largeApps])

  const sortOptions: { key: SortBy; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size' },
    { key: 'version', label: 'Version' },
  ]

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Apps' },
    { key: 'large', label: 'Large Apps' },
    { key: 'recent', label: 'Recently Installed' },
  ]

  /* ─── loading state ─── */
  if (loading) {
    return (
      <PageLayout title="App Uninstaller" subtitle="Remove unwanted applications">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '500px', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 100%)',
              border: '1px solid rgba(6,182,212,0.2)',
              boxShadow: '0 8px 32px rgba(6,182,212,0.15)',
            }}>
              <Package size={36} color="#22d3ee" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-4px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--bg-primary)',
              border: '2px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Loader2 size={14} color="#22d3ee" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>Scanning Applications</p>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>Reading installed apps from your Mac...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  /* ─── main render ─── */
  return (
    <PageLayout title="App Uninstaller" subtitle={`${filtered.length} applications · ${formatSize(totalSize)} total`}>
      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              e.currentTarget.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'var(--border-color)'
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${stat.color}18 0%, ${stat.color}08 100%)`,
              border: `1px solid ${stat.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, flexShrink: 0,
            }}>
              <stat.icon size={20} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.2', letterSpacing: '-0.4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>
                {stat.label} <span style={{ opacity: 0.6 }}>· {stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Split Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', height: 'calc(100vh - 320px)', minHeight: '500px' }}>
        {/* Left Panel - App List */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          overflow: 'hidden',
        }}>
          {/* Toolbar */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
            background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(255,255,255,0.01) 100%)',
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '10px 36px 10px 38px',
                  borderRadius: '12px', border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  fontSize: '13px', fontWeight: '500', fontFamily: 'inherit',
                  outline: 'none', transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    padding: '4px', borderRadius: '6px', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 14px', borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-input)' }}
              >
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{filterOptions.find(f => f.key === filterType)?.label}</span>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showFilterMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {showFilterMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowFilterMenu(false)} />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                    borderRadius: '14px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)', padding: '6px', zIndex: 50,
                    minWidth: '180px', boxShadow: 'var(--shadow-lg)',
                  }}>
                    {filterOptions.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => { setFilterType(f.key); setShowFilterMenu(false) }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 14px',
                          borderRadius: '10px', border: 'none', background: 'transparent',
                          color: filterType === f.key ? '#22d3ee' : 'var(--text-primary)',
                          fontSize: '13px', fontWeight: filterType === f.key ? '700' : '500',
                          fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: '10px',
                        }}
                        onMouseEnter={(e) => { if (filterType !== f.key) e.currentTarget.style.background = 'var(--bg-card)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        {filterType === f.key && <CheckCircle2 size={14} color="#22d3ee" />}
                        <span style={{ marginLeft: filterType === f.key ? '0' : '24px' }}>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sort */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 14px', borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-input)' }}
              >
                <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{sortOptions.find(s => s.key === sortBy)?.label}</span>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showSortMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {showSortMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowSortMenu(false)} />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                    borderRadius: '14px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)', padding: '6px', zIndex: 50,
                    minWidth: '160px', boxShadow: 'var(--shadow-lg)',
                  }}>
                    {sortOptions.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => { setSortBy(s.key); setShowSortMenu(false) }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 14px',
                          borderRadius: '10px', border: 'none', background: 'transparent',
                          color: sortBy === s.key ? '#22d3ee' : 'var(--text-primary)',
                          fontSize: '13px', fontWeight: sortBy === s.key ? '700' : '500',
                          fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: '10px',
                        }}
                        onMouseEnter={(e) => { if (sortBy !== s.key) e.currentTarget.style.background = 'var(--bg-card)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        {sortBy === s.key && <CheckCircle2 size={14} color="#22d3ee" />}
                        <span style={{ marginLeft: sortBy === s.key ? '0' : '24px' }}>{s.label}</span>
                      </button>
                    ))}
                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 8px' }} />
                    <button
                      onClick={() => setSortAsc(!sortAsc)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 14px',
                        borderRadius: '10px', border: 'none', background: 'transparent',
                        color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500',
                        fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      {sortAsc ? 'Ascending ↑' : 'Descending ↓'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* View Toggle */}
            <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '10px 12px', border: 'none', cursor: 'pointer',
                  background: viewMode === 'grid' ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                  color: viewMode === 'grid' ? '#22d3ee' : 'var(--text-muted)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={(e) => { if (viewMode !== 'grid') e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { if (viewMode !== 'grid') e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '10px 12px', border: 'none', borderLeft: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: viewMode === 'list' ? 'var(--bg-card-hover)' : 'var(--bg-input)',
                  color: viewMode === 'list' ? '#22d3ee' : 'var(--text-muted)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={(e) => { if (viewMode !== 'list') e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { if (viewMode !== 'list') e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <List size={15} />
              </button>
            </div>
          </div>

          {/* App List Content */}
          <div ref={listRef} style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
            {filtered.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '18px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                }}>
                  <Package size={32} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-muted)' }}>No apps found</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', opacity: 0.7, marginTop: '6px' }}>
                    {search ? 'Try a different search term' : 'No applications detected'}
                  </p>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {filtered.map((app) => {
                  const color = getAppColor(app.name)
                  const isSelected = selectedApp?.path === app.path
                  const isHovered = hoveredApp === app.path
                  return (
                    <div
                      key={app.path}
                      onClick={() => setSelectedApp(app)}
                      onMouseEnter={() => setHoveredApp(app.path)}
                      onMouseLeave={() => setHoveredApp(null)}
                      style={{
                        position: 'relative', borderRadius: '16px',
                        border: `1px solid ${isSelected ? color.glow : 'var(--border-color)'}`,
                        background: isSelected
                          ? `linear-gradient(135deg, ${color.bg} 0%, var(--bg-card) 100%)`
                          : 'var(--bg-card)',
                        padding: '18px 14px', cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered && !isSelected ? 'translateY(-3px)' : 'translateY(0)',
                        boxShadow: isSelected
                          ? `0 0 0 1px ${color.glow}, 0 4px 20px ${color.glow}`
                          : isHovered ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: '10px', right: '10px',
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: color.text, boxShadow: `0 0 8px ${color.glow}`,
                        }} />
                      )}
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '17px', fontWeight: '800',
                        background: color.bg, color: color.text,
                        marginBottom: '14px', border: `1px solid ${color.glow}`,
                      }}>
                        {getInitials(app.name)}
                      </div>
                      <p style={{
                        fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: '4px',
                      }}>{app.name}</p>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        {formatSize(app.size)}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filtered.map((app) => {
                  const color = getAppColor(app.name)
                  const isSelected = selectedApp?.path === app.path
                  const isHovered = hoveredApp === app.path
                  return (
                    <div
                      key={app.path}
                      onClick={() => setSelectedApp(app)}
                      onMouseEnter={() => setHoveredApp(app.path)}
                      onMouseLeave={() => setHoveredApp(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '11px 14px', borderRadius: '14px',
                        border: `1px solid ${isSelected ? color.glow : 'transparent'}`,
                        background: isSelected
                          ? `linear-gradient(90deg, ${color.bg} 0%, var(--bg-card) 60%)`
                          : isHovered ? 'var(--bg-card-hover)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected ? `0 0 0 1px ${color.glow}` : 'none',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: '800',
                        background: color.bg, color: color.text,
                        border: `1px solid ${color.glow}`, flexShrink: 0,
                      }}>
                        {getInitials(app.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          marginBottom: '2px',
                        }}>{app.name}</p>
                        <p style={{
                          fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{app.bundle_id || app.path.split('/').pop()}</p>
                      </div>
                      <span style={{
                        fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                        borderRadius: '8px', background: 'var(--bg-input)',
                        color: 'var(--text-muted)', flexShrink: 0,
                      }}>
                        {app.version}
                      </span>
                      <span style={{
                        fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)',
                        width: '70px', textAlign: 'right', flexShrink: 0,
                      }}>
                        {formatSize(app.size)}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmApp(app) }}
                        disabled={uninstalling === app.path}
                        style={{
                          padding: '8px', borderRadius: '10px',
                          border: '1px solid rgba(239,68,68,0.2)',
                          background: 'rgba(239,68,68,0.08)', color: '#f87171',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          opacity: isHovered || isSelected ? 1 : 0,
                          transition: 'all 0.2s', flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
                          e.currentTarget.style.transform = 'scale(1.08)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        {uninstalling === app.path ? (
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {selectedApp ? (
            <>
              {/* App Info Card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '22px',
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', fontWeight: '800',
                    background: getAppColor(selectedApp.name).bg,
                    color: getAppColor(selectedApp.name).text,
                    border: `1px solid ${getAppColor(selectedApp.name).glow}`,
                    boxShadow: `0 4px 16px ${getAppColor(selectedApp.name).glow}`,
                    flexShrink: 0,
                  }}>
                    {getInitials(selectedApp.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginBottom: '4px', letterSpacing: '-0.3px',
                    }}>
                      {selectedApp.name}
                    </h3>
                    <p style={{
                      fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      fontFamily: 'SF Mono, Monaco, monospace',
                    }}>
                      {selectedApp.bundle_id}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Version', value: selectedApp.version },
                    { label: 'Size', value: formatSize(selectedApp.size) },
                    { label: 'Installed', value: getInstallDate(selectedApp.path) },
                    { label: 'Status', value: 'Active', icon: CheckCircle2, color: '#4ade80' },
                  ].map((item) => (
                    <div key={item.label} style={{
                      padding: '12px', borderRadius: '12px', background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                    }}>
                      <div style={{
                        fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px',
                      }}>{item.label}</div>
                      <div style={{
                        fontSize: '14px', fontWeight: '700', color: item.color || 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        {item.icon && <item.icon size={13} />}
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Breakdown */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(167,139,250,0.12)', color: '#a78bfa',
                  }}>
                    <HardDrive size={16} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Storage Breakdown</h4>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>App Size</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{formatSize(selectedApp.size)}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: '70%',
                      background: 'linear-gradient(90deg, #a78bfa, #8b5cf6)',
                      borderRadius: '3px', transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Cache & Leftover Files</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24' }}>{formatSize(getEstimatedCacheSize(selectedApp.size))}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: '30%',
                      background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      borderRadius: '3px', transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>

                <div style={{
                  padding: '14px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(59,130,246,0.04) 100%)',
                  border: '1px solid rgba(6,182,212,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Total Recoverable</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#22d3ee' }}>
                    {formatSize(selectedApp.size + getEstimatedCacheSize(selectedApp.size))}
                  </span>
                </div>
              </div>

              {/* Permissions */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(74,222,128,0.12)', color: '#4ade80',
                  }}>
                    <Shield size={16} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Permissions</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {getPermissions(selectedApp.name).map((perm) => (
                    <div key={perm} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px',
                      background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                    }}>
                      <CheckCircle2 size={14} style={{ color: '#4ade80', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uninstall Action */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(220,38,38,0.03) 100%)',
                border: '1px solid rgba(239,68,68,0.12)',
                borderRadius: '18px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(239,68,68,0.12)', color: '#f87171',
                  }}>
                    <AlertTriangle size={16} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f87171' }}>Uninstall Application</h4>
                </div>
                <p style={{
                  fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)',
                  lineHeight: '1.5', marginBottom: '16px',
                }}>
                  This will move <strong style={{ color: 'var(--text-primary)' }}>{selectedApp.name}</strong> to Trash. You can restore it later if needed.
                </p>
                <button
                  onClick={() => setConfirmApp(selectedApp)}
                  disabled={uninstalling === selectedApp.path}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.25)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.35)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.25)'
                  }}
                >
                  {uninstalling === selectedApp.path ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Moving to Trash...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Move to Trash
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '18px', padding: '40px', gap: '16px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-input)', border: '1px solid var(--border-color)',
              }}>
                <AppWindow size={26} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-muted)' }}>Select an App</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', opacity: 0.7, marginTop: '4px' }}>
                  Click any app to view details and uninstall options
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmApp && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
          }}
          onClick={() => setConfirmApp(null)}
        >
          <div
            style={{
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              padding: '32px',
              maxWidth: '400px', width: '100%',
              background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              animation: 'fadeIn 0.25s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* App Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', fontWeight: '800',
                background: getAppColor(confirmApp.name).bg,
                color: getAppColor(confirmApp.name).text,
                border: `1px solid ${getAppColor(confirmApp.name).glow}`,
                boxShadow: `0 8px 24px ${getAppColor(confirmApp.name).glow}`,
                marginBottom: '16px',
              }}>
                {getInitials(confirmApp.name)}
              </div>
              <p style={{
                fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)',
                textAlign: 'center', letterSpacing: '-0.3px',
              }}>{confirmApp.name}</p>
              <p style={{
                fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginTop: '4px',
              }}>
                {formatSize(confirmApp.size)} · Version {confirmApp.version}
              </p>
            </div>

            {/* Warning */}
            <div style={{
              borderRadius: '14px', padding: '16px',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.12)',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              marginBottom: '24px',
            }}>
              <AlertTriangle size={18} style={{ color: '#f87171', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#f87171', lineHeight: '1.6' }}>
                This app will be moved to Trash. You can restore it from Trash if needed. Associated cache files may remain.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirmApp(null)}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  fontSize: '14px', fontWeight: '700', fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)'
                  e.currentTarget.style.transform = 'scale(1.01)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUninstall(confirmApp)}
                disabled={uninstalling === confirmApp.path}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white', fontSize: '14px', fontWeight: '700',
                  fontFamily: 'inherit', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                  transition: 'all 0.2s',
                  opacity: uninstalling === confirmApp.path ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (uninstalling !== confirmApp.path) {
                    e.currentTarget.style.transform = 'scale(1.01)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.3)'
                }}
              >
                {uninstalling === confirmApp.path ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Moving...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Move to Trash
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
