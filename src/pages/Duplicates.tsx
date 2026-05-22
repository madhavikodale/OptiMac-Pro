import React, { useState } from 'react'
import {
  Search, FileX, Loader2, FolderOpen, Trash2, Copy,
  HardDrive, Zap, ChevronRight, CheckCircle2, AlertTriangle,
  Files, FolderTree, Sparkles
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { findDuplicateFiles, type DuplicateFile } from '../lib/tauri'

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getFileIcon(path: string): { color: string; bg: string; border: string } {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic']
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'wmv']
  const audioExts = ['mp3', 'aac', 'wav', 'flac', 'm4a']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'pages']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz']

  if (imageExts.includes(ext)) {
    return { color: '#f472b6', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' }
  }
  if (videoExts.includes(ext)) {
    return { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' }
  }
  if (audioExts.includes(ext)) {
    return { color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' }
  }
  if (docExts.includes(ext)) {
    return { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' }
  }
  if (archiveExts.includes(ext)) {
    return { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' }
  }
  return { color: '#22d3ee', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' }
}

function getFileName(path: string): string {
  return path.split('/').pop() || path
}

function getFileExtension(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || ''
  return ext
}

export default function Duplicates() {
  const [path, setPath] = useState('')
  const [duplicates, setDuplicates] = useState<DuplicateFile[]>([])
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())

  async function handleScan() {
    const scanPath = path.trim() || '/Users'
    setScanning(true)
    setScanned(false)
    setSelectedPaths(new Set())
    setExpandedGroups(new Set())
    try {
      const data = await findDuplicateFiles(scanPath)
      setDuplicates(data)
      // Auto-expand first 3 groups
      const toExpand = new Set<string>()
      data.slice(0, 3).forEach(d => toExpand.add(d.hash))
      setExpandedGroups(toExpand)
    } catch (err) {
      console.error('Scan failed:', err)
    } finally {
      setScanning(false)
      setScanned(true)
    }
  }

  const totalWasted = duplicates.reduce((sum, d) => sum + d.size * (d.paths.length - 1), 0)
  const totalGroups = duplicates.length
  const totalFiles = duplicates.reduce((sum, d) => sum + d.paths.length, 0)

  function toggleGroup(hash: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(hash)) next.delete(hash)
      else next.add(hash)
      return next
    })
  }

  function togglePath(filePath: string) {
    setSelectedPaths(prev => {
      const next = new Set(prev)
      if (next.has(filePath)) next.delete(filePath)
      else next.add(filePath)
      return next
    })
  }

  function selectAllInGroup(group: DuplicateFile) {
    setSelectedPaths(prev => {
      const next = new Set(prev)
      const allSelected = group.paths.every(p => next.has(p))
      if (allSelected) {
        group.paths.forEach(p => next.delete(p))
      } else {
        group.paths.forEach(p => next.add(p))
      }
      return next
    })
  }

  return (
    <PageLayout title="Duplicate Finder" subtitle="Find and remove duplicate files to free up space">
      {/* Scan Hero */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '13px',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.08) 100%)',
            border: '1px solid rgba(6,182,212,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#22d3ee',
            flexShrink: 0,
          }}>
            <Copy size={22} strokeWidth={2} />
          </div>
          <div>
            <h3 style={{
              fontSize: '16px', fontWeight: '700',
              color: 'var(--text-primary)', marginBottom: '3px',
            }}>
              Scan for Duplicates
            </h3>
            <p style={{
              fontSize: '13px', fontWeight: '500',
              color: 'var(--text-muted)',
            }}>
              Detect duplicate files across your system and reclaim storage
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FolderOpen size={15} style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Path to scan (default: /Users)"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: '11px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s',
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
          </div>
          <button
            onClick={handleScan}
            disabled={scanning}
            style={{
              padding: '12px 28px',
              borderRadius: '11px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'inherit',
              cursor: scanning ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(6,182,212,0.25)',
              transition: 'all 0.2s',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!scanning) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(6,182,212,0.35)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(6,182,212,0.25)'
            }}
          >
            {scanning ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Search size={16} />
            )}
            {scanning ? 'Scanning...' : 'Scan Now'}
          </button>
        </div>
      </div>

      {/* Results */}
      {scanned && (
        <>
          {duplicates.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '60px 20px',
              gap: '16px',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(20,184,166,0.05) 100%)',
                border: '1px solid rgba(34,197,94,0.15)',
              }}>
                <CheckCircle2 size={28} color="#4ade80" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontSize: '17px', fontWeight: '700',
                  color: 'var(--text-primary)', marginBottom: '4px',
                }}>
                  No Duplicates Found
                </p>
                <p style={{
                  fontSize: '14px', fontWeight: '500',
                  color: 'var(--text-muted)',
                }}>
                  Your files are clean — no duplicates detected in the scanned path
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                marginBottom: '24px',
              }}>
                {[
                  {
                    label: 'Duplicate Groups',
                    value: totalGroups.toString(),
                    icon: Files,
                    color: '#22d3ee',
                  },
                  {
                    label: 'Duplicate Files',
                    value: totalFiles.toString(),
                    icon: Copy,
                    color: '#a78bfa',
                  },
                  {
                    label: 'Space Wasted',
                    value: formatSize(totalWasted),
                    icon: HardDrive,
                    color: '#fbbf24',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '18px 20px',
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
                      width: '40px', height: '40px', borderRadius: '11px',
                      background: `linear-gradient(135deg, ${stat.color}18 0%, ${stat.color}08 100%)`,
                      border: `1px solid ${stat.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: stat.color,
                      flexShrink: 0,
                    }}>
                      <stat.icon size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '20px', fontWeight: '800',
                        color: 'var(--text-primary)', lineHeight: '1.2', letterSpacing: '-0.3px',
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '12px', fontWeight: '600',
                        color: 'var(--text-muted)', marginTop: '2px',
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Actions Bar */}
              {selectedPaths.size > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.04) 100%)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <AlertTriangle size={18} color="#f87171" />
                    <span style={{
                      fontSize: '14px', fontWeight: '700',
                      color: '#f87171',
                    }}>
                      {selectedPaths.size} file{selectedPaths.size > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <button
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      fontSize: '13px', fontWeight: '700',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(239,68,68,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)'
                    }}
                  >
                    <Trash2 size={14} />
                    Move to Trash
                  </button>
                </div>
              )}

              {/* Duplicate Groups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {duplicates.map((dup, index) => {
                  const isExpanded = expandedGroups.has(dup.hash)
                  const fileStyle = getFileIcon(dup.paths[0])
                  const selectedInGroup = dup.paths.filter(p => selectedPaths.has(p)).length
                  const allSelected = selectedInGroup === dup.paths.length

                  return (
                    <div
                      key={dup.hash}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                      }}
                    >
                      {/* Group Header */}
                      <div
                        onClick={() => toggleGroup(dup.hash)}
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: isExpanded
                            ? 'linear-gradient(90deg, rgba(6,182,212,0.03) 0%, transparent 50%)'
                            : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded) {
                            e.currentTarget.style.background = 'var(--bg-card-hover)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded) {
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        {/* File Icon */}
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '11px',
                          background: fileStyle.bg,
                          border: `1px solid ${fileStyle.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: fileStyle.color,
                          flexShrink: 0,
                        }}>
                          <Files size={18} strokeWidth={2} />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            marginBottom: '3px',
                          }}>
                            <span style={{
                              fontSize: '14px', fontWeight: '700',
                              color: 'var(--text-primary)',
                            }}>
                              {getFileName(dup.paths[0])}
                            </span>
                            <span style={{
                              fontSize: '10px', fontWeight: '800',
                              padding: '3px 8px', borderRadius: '5px',
                              textTransform: 'uppercase', letterSpacing: '0.5px',
                              background: 'rgba(6,182,212,0.1)',
                              color: '#22d3ee',
                              border: '1px solid rgba(6,182,212,0.2)',
                              flexShrink: 0,
                            }}>
                              {getFileExtension(dup.paths[0]) || 'file'}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '12px', fontWeight: '500',
                            color: 'var(--text-muted)',
                          }}>
                            {dup.paths.length} copies · {formatSize(dup.size)} each · {formatSize(dup.size * (dup.paths.length - 1))} wasted
                          </div>
                        </div>

                        {/* Select All Toggle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); selectAllInGroup(dup) }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '9px',
                            border: `1px solid ${allSelected ? 'rgba(34,197,94,0.3)' : 'var(--border-color)'}`,
                            background: allSelected ? 'rgba(34,197,94,0.1)' : 'var(--bg-input)',
                            color: allSelected ? '#4ade80' : 'var(--text-muted)',
                            fontSize: '12px', fontWeight: '700',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = allSelected ? 'rgba(34,197,94,0.4)' : 'var(--border-hover)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = allSelected ? 'rgba(34,197,94,0.3)' : 'var(--border-color)'
                          }}
                        >
                          {allSelected ? <CheckCircle2 size={13} /> : null}
                          {allSelected ? 'All' : 'Select'}
                        </button>

                        {/* Expand Chevron */}
                        <ChevronRight size={16} style={{
                          color: 'var(--text-muted)',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          flexShrink: 0,
                        }} />
                      </div>

                      {/* Expanded File List */}
                      {isExpanded && (
                        <div style={{
                          borderTop: '1px solid var(--border-color)',
                          padding: '10px',
                        }}>
                          {dup.paths.map((filePath, i) => {
                            const isSelected = selectedPaths.has(filePath)
                            return (
                              <div
                                key={i}
                                onClick={() => togglePath(filePath)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                  background: isSelected
                                    ? 'linear-gradient(90deg, rgba(34,197,94,0.06) 0%, transparent 60%)'
                                    : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = 'var(--bg-card-hover)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = 'transparent'
                                  }
                                }}
                              >
                                {/* Checkbox */}
                                <div style={{
                                  width: '20px', height: '20px', borderRadius: '6px',
                                  border: `2px solid ${isSelected ? '#4ade80' : 'var(--border-hover)'}`,
                                  background: isSelected ? 'rgba(34,197,94,0.15)' : 'transparent',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                  transition: 'all 0.15s',
                                }}>
                                  {isSelected && <CheckCircle2 size={12} color="#4ade80" />}
                                </div>

                                {/* File Icon */}
                                <div style={{
                                  width: '32px', height: '32px', borderRadius: '8px',
                                  background: fileStyle.bg,
                                  border: `1px solid ${fileStyle.border}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: fileStyle.color,
                                  flexShrink: 0,
                                }}>
                                  <FileX size={14} />
                                </div>

                                {/* Path */}
                                <span style={{
                                  fontSize: '13px', fontWeight: '500',
                                  color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                  flex: 1,
                                }}>
                                  {filePath}
                                </span>

                                {/* Size */}
                                <span style={{
                                  fontSize: '12px', fontWeight: '600',
                                  color: 'var(--text-secondary)',
                                  flexShrink: 0,
                                }}>
                                  {formatSize(dup.size)}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </PageLayout>
  )
}
