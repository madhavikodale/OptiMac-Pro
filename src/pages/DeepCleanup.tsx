import React, { useState, useEffect, useCallback } from 'react'
import {
  Trash2, Folder, Globe, Code, FileText, Package, HardDrive,
  Download, Mail, Zap, ShieldCheck, Eye, EyeOff, Loader2,
  CheckCircle2, AlertTriangle, ChevronRight, RotateCcw,
  Sparkles, X
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { scanCleanupCategories, runDeepCleanup, type CleanupCategory, type CleanupResult } from '../lib/tauri'
import { useToast } from '../components/Toast'

const ICON_MAP: Record<string, React.ElementType> = {
  folder: Folder,
  globe: Globe,
  code: Code,
  'file-text': FileText,
  package: Package,
  trash: Trash2,
  download: Download,
  mail: Mail,
  'hard-drive': HardDrive,
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function CategoryCard({
  category,
  selected,
  onToggle,
  expanded,
  onExpand,
}: {
  category: CleanupCategory
  selected: boolean
  onToggle: () => void
  expanded: boolean
  onExpand: () => void
}) {
  const Icon = ICON_MAP[category.icon] || Folder
  const hasContent = category.size_bytes > 0

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${selected ? category.color + '50' : 'var(--border-color)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: hasContent ? 1 : 0.5,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          cursor: hasContent ? 'pointer' : 'default',
        }}
        onClick={() => hasContent && onToggle()}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: category.color,
            border: `1px solid ${category.color}25`,
            flexShrink: 0,
          }}
        >
          <Icon size={22} strokeWidth={2} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {category.name}
            </span>
            {selected && (
              <CheckCircle2 size={16} style={{ color: category.color }} />
            )}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {category.description}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: category.color }}>
              {formatBytes(category.size_bytes)}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {category.file_count.toLocaleString()} files
            </span>
          </div>
        </div>

        {hasContent && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onExpand()
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-card-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              {expanded ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: `2px solid ${selected ? category.color : 'var(--border-color)'}`,
                background: selected ? category.color : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {selected && <CheckCircle2 size={14} color="#fff" />}
            </div>
          </>
        )}
      </div>

      {expanded && category.paths.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            padding: '16px 20px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {category.paths.slice(0, 20).map((path, i) => (
            <div
              key={i}
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                padding: '4px 0',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {path}
            </div>
          ))}
          {category.paths.length > 20 && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 0', fontStyle: 'italic' }}>
              ...and {category.paths.length - 20} more
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DeepCleanup() {
  const [result, setResult] = useState<CleanupResult | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [dryRun, setDryRun] = useState(true)
  const [actionResult, setActionResult] = useState<{ message: string; details: string[]; freed: number } | null>(null)
  const toast = useToast()

  const loadCategories = useCallback(async () => {
    setScanning(true)
    try {
      const data = await scanCleanupCategories()
      setResult(data)
      // Auto-select categories with content
      const withContent = new Set(data.categories.filter((c) => c.size_bytes > 0).map((c) => c.id))
      setSelected(withContent)
    } catch (e) {
      toast?.addToast('Failed to scan cleanup categories', 'error')
    } finally {
      setLoading(false)
      setScanning(false)
    }
  }, [toast])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectedSize = result?.categories
    .filter((c) => selected.has(c.id))
    .reduce((sum, c) => sum + c.size_bytes, 0) || 0

  const handleCleanup = async () => {
    if (selected.size === 0) {
      toast?.addToast('Select at least one category', 'warning')
      return
    }

    setLoading(true)
    try {
      const ids = Array.from(selected)
      const res = await runDeepCleanup(ids, dryRun)
      setActionResult({
        message: res.message,
        details: res.details,
        freed: res.freed_bytes,
      })
      if (!dryRun) {
        toast?.addToast(res.message, 'success')
        // Refresh scan
        await loadCategories()
      } else {
        toast?.addToast('Dry run complete — review results below', 'info')
      }
    } catch (e) {
      toast?.addToast('Cleanup failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Deep Cleanup"
      subtitle="Reclaim gigabytes by removing caches, logs, and leftover files across 9 categories"
    >
      {/* Header stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard
          label="Total Found"
          value={formatBytes(result?.total_size || 0)}
          icon={HardDrive}
          color="#06b6d4"
        />
        <StatCard
          label="Selected to Clean"
          value={formatBytes(selectedSize)}
          icon={Zap}
          color="#8b5cf6"
        />
        <StatCard
          label="Files Scanned"
          value={(result?.total_files || 0).toLocaleString()}
          icon={FileText}
          color="#10b981"
        />
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setDryRun(!dryRun)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: `1px solid ${dryRun ? '#f59e0b50' : 'var(--border-color)'}`,
              background: dryRun ? 'rgba(245,158,11,0.1)' : 'var(--bg-card)',
              color: dryRun ? '#fbbf24' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {dryRun ? <Eye size={16} /> : <EyeOff size={16} />}
            {dryRun ? 'Dry Run On' : 'Dry Run Off'}
          </button>

          <button
            onClick={loadCategories}
            disabled={scanning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: scanning ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <RotateCcw size={16} style={{ animation: scanning ? 'spin 1s linear infinite' : 'none' }} />
            Rescan
          </button>
        </div>

        <button
          onClick={handleCleanup}
          disabled={loading || selected.size === 0}
          style={{
            padding: '12px 28px',
            background: dryRun
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '800',
            fontSize: '14px',
            cursor: loading || selected.size === 0 ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: dryRun
              ? '0 4px 16px rgba(245,158,11,0.3)'
              : '0 4px 16px rgba(239,68,68,0.3)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              {dryRun ? 'Previewing...' : 'Cleaning...'}
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {dryRun ? `Preview Clean (${formatBytes(selectedSize)})` : `Clean Now (${formatBytes(selectedSize)})`}
            </>
          )}
        </button>
      </div>

      {/* Warning for non-dry-run */}
      {!dryRun && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <AlertTriangle size={20} style={{ color: '#f87171', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f87171' }}>
              Live Mode Active
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Files will be moved to Trash. Review the preview first with Dry Run enabled.
            </div>
          </div>
        </div>
      )}

      {/* Categories grid */}
      {loading && !result ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: '120px',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {result?.categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              selected={selected.has(cat.id)}
              onToggle={() => toggleCategory(cat.id)}
              expanded={expanded.has(cat.id)}
              onExpand={() => toggleExpand(cat.id)}
            />
          ))}
        </div>
      )}

      {/* Action result */}
      {actionResult && (
        <div
          style={{
            marginTop: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ShieldCheck size={22} style={{ color: '#4ade80' }} />
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {actionResult.message}
            </span>
            <button
              onClick={() => setActionResult(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          </div>
          {actionResult.freed > 0 && (
            <div
              style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#4ade80',
                marginBottom: '16px',
              }}
            >
              {formatBytes(actionResult.freed)} freed
            </div>
          )}
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {actionResult.details.map((detail, i) => (
              <div
                key={i}
                style={{
                  fontSize: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: detail.startsWith('[DRY-RUN]')
                    ? 'rgba(245,158,11,0.08)'
                    : 'rgba(6,182,212,0.08)',
                  color: detail.startsWith('[DRY-RUN]') ? '#fbbf24' : '#22d3ee',
                  fontFamily: 'monospace',
                }}
              >
                {detail}
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}
