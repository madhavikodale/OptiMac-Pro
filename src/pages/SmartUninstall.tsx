import React, { useState, useEffect, useCallback } from 'react'
import {
  Trash2, Search, Package, ChevronRight, Loader2, AlertTriangle,
  ShieldCheck, Eye, EyeOff, FileX, FolderOpen, RotateCcw,
  HardDrive, Zap, CheckCircle2, X
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import {
  getInstalledApps, scanAppLeftovers, runSmartUninstall,
  type InstalledApp, type SmartUninstallResult, type UninstallActionResult
} from '../lib/tauri'
import { useToast } from '../components/Toast'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function SmartUninstall() {
  const [apps, setApps] = useState<InstalledApp[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<InstalledApp | null>(null)
  const [scanResult, setScanResult] = useState<SmartUninstallResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [dryRun, setDryRun] = useState(true)
  const [actionResult, setActionResult] = useState<UninstallActionResult | null>(null)
  const toast = useToast()

  const loadApps = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getInstalledApps()
      setApps(data)
    } catch (e) {
      toast?.addToast('Failed to load apps', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadApps()
  }, [loadApps])

  const handleSelectApp = async (app: InstalledApp) => {
    setSelectedApp(app)
    setScanResult(null)
    setActionResult(null)
    setScanning(true)
    try {
      const result = await scanAppLeftovers(app.path, app.bundle_id, app.name)
      setScanResult(result)
    } catch (e) {
      toast?.addToast('Failed to scan leftovers', 'error')
    } finally {
      setScanning(false)
    }
  }

  const handleUninstall = async () => {
    if (!selectedApp) return
    setScanning(true)
    try {
      const res = await runSmartUninstall(
        selectedApp.path,
        selectedApp.bundle_id,
        selectedApp.name,
        dryRun
      )
      setActionResult(res)
      if (!dryRun && res.success) {
        toast?.addToast(res.message, 'success')
        setApps((prev) => prev.filter((a) => a.path !== selectedApp.path))
        setSelectedApp(null)
        setScanResult(null)
      } else if (dryRun) {
        toast?.addToast('Dry run complete — review before executing', 'info')
      }
    } catch (e) {
      toast?.addToast('Uninstall failed', 'error')
    } finally {
      setScanning(false)
    }
  }

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  // Group leftovers by category
  const groupedLeftovers = scanResult
    ? scanResult.leftovers.reduce((acc, l) => {
        acc[l.category] = acc[l.category] || []
        acc[l.category].push(l)
        return acc
      }, {} as Record<string, typeof scanResult.leftovers>)
    : {}

  return (
    <PageLayout
      title="Smart Uninstaller"
      subtitle="Remove apps and all their leftover files — preferences, caches, logs, plugins, and more"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', height: 'calc(100vh - 180px)' }}>
        {/* Left: App list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search installed apps..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ height: '64px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', animation: 'pulse 2s infinite' }} />
              ))
            ) : (
              filtered.map((app) => (
                <button
                  key={app.path}
                  onClick={() => handleSelectApp(app)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: selectedApp?.path === app.path
                      ? 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 100%)'
                      : 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    boxShadow: selectedApp?.path === app.path
                      ? '0 0 0 1px rgba(6,182,212,0.25)'
                      : 'none',
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8b5cf6', flexShrink: 0,
                  }}>
                    <Package size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{app.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {app.version} · {formatBytes(app.size)}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0, overflowY: 'auto' }}>
          {!selectedApp ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '16px', color: 'var(--text-muted)', textAlign: 'center',
            }}>
              <Trash2 size={48} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: '16px', fontWeight: '700' }}>Select an app to analyze</div>
              <div style={{ fontSize: '13px', maxWidth: '280px' }}>
                OptiMac Pro will scan for leftover files across 15+ categories including preferences, caches, logs, and plugins.
              </div>
            </div>
          ) : scanning && !scanResult ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8b5cf6' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                Scanning for leftovers...
              </div>
            </div>
          ) : scanResult ? (
            <>
              {/* App header */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(245,158,11,0.1) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ef4444', flexShrink: 0,
                  }}>
                    <Package size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '800' }}>{scanResult.app_name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      App: {formatBytes(scanResult.app_size)} · Leftovers: {formatBytes(scanResult.total_leftover_size)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#f87171' }}>{formatBytes(scanResult.app_size)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>App Size</div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24' }}>{formatBytes(scanResult.total_leftover_size)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Leftover Size</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setDryRun(!dryRun)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '10px', borderRadius: '10px',
                      border: `1px solid ${dryRun ? '#f59e0b50' : 'var(--border-color)'}`,
                      background: dryRun ? 'rgba(245,158,11,0.1)' : 'transparent',
                      color: dryRun ? '#fbbf24' : 'var(--text-secondary)',
                      fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                    }}
                  >
                    {dryRun ? <Eye size={16} /> : <EyeOff size={16} />}
                    {dryRun ? 'Dry Run On' : 'Dry Run Off'}
                  </button>
                  <button
                    onClick={handleUninstall}
                    disabled={scanning}
                    style={{
                      flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      padding: '10px 20px', borderRadius: '10px', border: 'none',
                      background: dryRun
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white', fontSize: '14px', fontWeight: '800', cursor: scanning ? 'wait' : 'pointer',
                    }}
                  >
                    {scanning ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={18} />}
                    {dryRun ? 'Preview Uninstall' : 'Uninstall Now'}
                  </button>
                </div>
              </div>

              {/* Leftover categories */}
              {Object.entries(groupedLeftovers).length > 0 ? (
                Object.entries(groupedLeftovers).map(([category, items]) => (
                  <div key={category} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <FolderOpen size={16} style={{ color: '#8b5cf6' }} />
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>{category}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {items.length} items · {formatBytes(items.reduce((s, i) => s + i.size, 0))}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {items.slice(0, 5).map((item, i) => (
                        <div key={i} style={{
                          fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '3px 0',
                        }}>
                          {item.path}
                        </div>
                      ))}
                      {items.length > 5 && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '3px 0' }}>
                          ...and {items.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px',
                  padding: '24px', textAlign: 'center', color: 'var(--text-muted)',
                }}>
                  <ShieldCheck size={28} style={{ color: '#4ade80', marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>No leftovers found</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>This app appears to be clean — only the .app bundle will be removed.</div>
                </div>
              )}

              {/* Action result */}
              {actionResult && (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {actionResult.success ? <CheckCircle2 size={20} style={{ color: '#4ade80' }} /> : <AlertTriangle size={20} style={{ color: '#f87171' }} />}
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{actionResult.message}</span>
                    <button onClick={() => setActionResult(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>
                  {actionResult.freed_bytes > 0 && (
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80', marginBottom: '12px' }}>
                      {formatBytes(actionResult.freed_bytes)} freed
                    </div>
                  )}
                  {actionResult.removed_paths.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                      {actionResult.removed_paths.map((p, i) => (
                        <div key={i} style={{ fontSize: '11px', color: '#4ade80', fontFamily: 'monospace', padding: '4px 8px', background: 'rgba(74,222,128,0.06)', borderRadius: '6px' }}>
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </PageLayout>
  )
}
