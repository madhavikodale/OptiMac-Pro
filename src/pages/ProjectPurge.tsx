import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderSearch, Trash2, AlertTriangle, CheckCircle2, Loader2,
  HardDrive, Code2, Box, FileCode, Braces, Container,
  ToggleLeft, ToggleRight, X, Search, FolderOpen
} from 'lucide-react'
import { scanProjectArtifacts, purgeProjectArtifacts, type ProjectArtifact } from '../lib/tauri'

const ARTIFACT_TYPES = [
  { id: 'node_modules', label: 'node_modules', icon: Braces, color: '#22c55e' },
  { id: 'Rust target', label: 'Rust target/', icon: Code2, color: '#f97316' },
  { id: 'Python venv', label: 'Python venv', icon: FileCode, color: '#3b82f6' },
  { id: 'Xcode build', label: 'Xcode .build', icon: Box, color: '#06b6d4' },
  { id: 'Docker volume', label: 'Docker volumes', icon: Container, color: '#3b82f6' },
  { id: 'Gradle build', label: 'Gradle build', icon: Code2, color: '#22c55e' },
  { id: 'CMake build', label: 'CMake build', icon: Code2, color: '#ef4444' },
  { id: 'Go cache', label: 'Go pkg/bin', icon: Code2, color: '#06b6d4' },
  { id: 'JetBrains .idea', label: 'JetBrains .idea', icon: Code2, color: '#a855f7' },
]

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / Math.pow(1024, exp)).toFixed(1)} ${units[exp]}`
}

export default function ProjectPurge() {
  const [scanPaths, setScanPaths] = useState<string[]>([''])
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
  const [artifacts, setArtifacts] = useState<ProjectArtifact[]>([])
  const [selectedArtifacts, setSelectedArtifacts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [purging, setPurging] = useState(false)
  const [dryRun, setDryRun] = useState(true)
  const [result, setResult] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const allTypesSelected = selectedTypes.size === 0

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev)
      if (next.has(typeId)) next.delete(typeId)
      else next.add(typeId)
      return next
    })
  }

  const toggleAllTypes = () => {
    if (selectedTypes.size === 0) {
      setSelectedTypes(new Set(ARTIFACT_TYPES.map(t => t.id)))
    } else {
      setSelectedTypes(new Set())
    }
  }

  const addScanPath = () => setScanPaths(prev => [...prev, ''])
  const removeScanPath = (idx: number) => setScanPaths(prev => prev.filter((_, i) => i !== idx))
  const updateScanPath = (idx: number, val: string) => {
    setScanPaths(prev => prev.map((p, i) => i === idx ? val : p))
  }

  const handleScan = useCallback(async () => {
    const validPaths = scanPaths.filter(p => p.trim())
    if (validPaths.length === 0) return
    setLoading(true)
    setResult(null)
    try {
      const typeFilter = selectedTypes.size > 0 ? Array.from(selectedTypes) : []
      const res = await scanProjectArtifacts(validPaths, typeFilter)
      setArtifacts(res.artifacts)
      setSelectedArtifacts(new Set(res.artifacts.map(a => a.path)))
      setResult(res.message)
    } catch (e) {
      setResult(`Error: ${e}`)
    } finally {
      setLoading(false)
    }
  }, [scanPaths, selectedTypes])

  const handlePurge = useCallback(async () => {
    const toPurge = artifacts.filter(a => selectedArtifacts.has(a.path))
    if (toPurge.length === 0) return
    setPurging(true)
    try {
      const res = await purgeProjectArtifacts({
        paths: scanPaths.filter(p => p.trim()),
        dry_run: dryRun,
        artifact_types: selectedTypes.size > 0 ? Array.from(selectedTypes) : [],
      })
      setResult(res.message)
      if (!dryRun) {
        setArtifacts(prev => prev.filter(a => !selectedArtifacts.has(a.path)))
        setSelectedArtifacts(new Set())
      }
    } catch (e) {
      setResult(`Error: ${e}`)
    } finally {
      setPurging(false)
    }
  }, [artifacts, selectedArtifacts, scanPaths, dryRun, selectedTypes])

  const filteredArtifacts = artifacts.filter(a =>
    a.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artifact_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSelectedSize = artifacts
    .filter(a => selectedArtifacts.has(a.path))
    .reduce((sum, a) => sum + a.size, 0)

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245,158,11,0.35)'
          }}>
            <FolderSearch size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Project Artifact Purge
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Reclaim space from build artifacts, caches, and virtual environments
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scan Paths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          marginTop: '24px',
          padding: '20px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Scan Directories
        </h3>
        {scanPaths.map((path, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <FolderOpen size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              value={path}
              onChange={e => updateScanPath(idx, e.target.value)}
              placeholder="/path/to/projects or ~/Developer"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            {scanPaths.length > 1 && (
              <button onClick={() => removeScanPath(idx)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                padding: '6px', borderRadius: '6px',
              }}>
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button onClick={addScanPath} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#22d3ee', fontSize: '13px', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0',
        }}>
          + Add another directory
        </button>
      </motion.div>

      {/* Artifact Type Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          marginTop: '16px',
          padding: '20px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Artifact Types
          </h3>
          <button onClick={toggleAllTypes} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#22d3ee', fontSize: '12px', fontWeight: '600',
          }}>
            {selectedTypes.size === 0 ? 'Select All' : 'Clear All'}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ARTIFACT_TYPES.map(type => {
            const isSelected = selectedTypes.has(type.id)
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px',
                  border: `1.5px solid ${isSelected ? type.color : 'var(--border-color)'}`,
                  background: isSelected ? `${type.color}15` : 'var(--bg-card)',
                  color: isSelected ? type.color : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >
                <Icon size={14} />
                {type.label}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Scan Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}
      >
        <button
          onClick={handleScan}
          disabled={loading || scanPaths.every(p => !p.trim())}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', borderRadius: '12px',
            border: 'none', background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            color: 'white', fontSize: '14px', fontWeight: '700',
            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || scanPaths.every(p => !p.trim()) ? 0.6 : 1,
            boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
          }}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
          {loading ? 'Scanning...' : 'Scan for Artifacts'}
        </button>

        {/* Dry Run Toggle */}
        <button
          onClick={() => setDryRun(!dryRun)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: dryRun ? '#f59e0b' : 'var(--text-muted)',
            fontSize: '13px', fontWeight: '600', fontFamily: 'inherit',
          }}
        >
          {dryRun ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
          Dry Run {dryRun ? 'ON' : 'OFF'}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '16px', padding: '14px 18px', borderRadius: '12px',
              background: result.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              border: `1px solid ${result.includes('Error') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
              color: result.includes('Error') ? '#ef4444' : '#22c55e',
              fontSize: '13px', fontWeight: '600',
            }}
          >
            {result.includes('Error') ? <AlertTriangle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> : <CheckCircle2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
            {result}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artifacts List */}
      {artifacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: '24px',
            padding: '20px',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                Found {artifacts.length} Artifacts
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Total: {formatSize(artifacts.reduce((s, a) => s + a.size, 0))} | Selected: {formatSize(totalSelectedSize)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search artifacts..."
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                  width: '200px',
                }}
              />
              <button
                onClick={() => setSelectedArtifacts(new Set(artifacts.map(a => a.path)))}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#22d3ee', fontSize: '12px', fontWeight: '600',
                }}
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedArtifacts(new Set())}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600',
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredArtifacts.map((artifact, idx) => {
              const isSelected = selectedArtifacts.has(artifact.path)
              const typeInfo = ARTIFACT_TYPES.find(t => t.id === artifact.artifact_type)
              const Icon = typeInfo?.icon || HardDrive
              const color = typeInfo?.color || '#22d3ee'

              return (
                <motion.div
                  key={artifact.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    setSelectedArtifacts(prev => {
                      const next = new Set(prev)
                      if (next.has(artifact.path)) next.delete(artifact.path)
                      else next.add(artifact.path)
                      return next
                    })
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '12px',
                    border: `1px solid ${isSelected ? `${color}40` : 'var(--border-color)'}`,
                    background: isSelected ? `${color}08` : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '6px',
                    border: `2px solid ${isSelected ? color : 'var(--border-color)'}`,
                    background: isSelected ? color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isSelected && <CheckCircle2 size={12} color="white" />}
                  </div>
                  <Icon size={18} style={{ color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px', fontWeight: '600',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {artifact.path}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {artifact.artifact_type} · {artifact.file_count.toLocaleString()} files
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px', fontWeight: '700', color,
                    flexShrink: 0,
                  }}>
                    {formatSize(artifact.size)}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredArtifacts.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handlePurge}
                disabled={purging || selectedArtifacts.size === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 28px', borderRadius: '12px',
                  border: 'none',
                  background: dryRun
                    ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white', fontSize: '14px', fontWeight: '700',
                  fontFamily: 'inherit',
                  cursor: purging || selectedArtifacts.size === 0 ? 'not-allowed' : 'pointer',
                  opacity: purging || selectedArtifacts.size === 0 ? 0.6 : 1,
                  boxShadow: dryRun
                    ? '0 4px 14px rgba(245,158,11,0.35)'
                    : '0 4px 14px rgba(239,68,68,0.35)',
                }}
              >
                {purging ? <Loader2 size={18} className="spin" /> : <Trash2 size={18} />}
                {dryRun
                  ? `Preview Purge (${selectedArtifacts.size})`
                  : `Purge ${selectedArtifacts.size} Artifacts (${formatSize(totalSelectedSize)})`
                }
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
