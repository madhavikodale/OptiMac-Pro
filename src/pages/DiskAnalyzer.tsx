import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  PieChart, FolderOpen, ChevronRight, Loader2, HardDrive,
  FileText, ArrowUpRight, ArrowLeft, Layers, Search, Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../components/PageLayout'
import { analyzeDiskTreemap, getLargeFiles, getDirectorySummary, type TreemapNode, type FileNode } from '../lib/tauri'

// ─── Helpers ─────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getColorForSize(size: number, max: number): string {
  const ratio = max > 0 ? size / max : 0
  if (ratio > 0.5) return 'hsl(0, 70%, 55%)'
  if (ratio > 0.25) return 'hsl(25, 80%, 55%)'
  if (ratio > 0.1) return 'hsl(45, 80%, 55%)'
  if (ratio > 0.05) return 'hsl(140, 60%, 50%)'
  return 'hsl(200, 60%, 55%)'
}

// ─── Treemap Rectangle Component ─────────────────────────────────────

interface TreemapRectProps {
  node: TreemapNode
  x: number
  y: number
  width: number
  height: number
  maxSize: number
  onClick: (node: TreemapNode) => void
}

function TreemapRect({ node, x, y, width, height, maxSize, onClick }: TreemapRectProps) {
  const color = getColorForSize(node.size, maxSize)
  const showLabel = width > 60 && height > 30

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={Math.max(width, 1)}
        height={Math.max(height, 1)}
        fill={color}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={0.5}
        style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
        onClick={() => onClick(node)}
        rx={2}
        onMouseEnter={(e) => { (e.target as SVGRectElement).style.opacity = '0.8' }}
        onMouseLeave={(e) => { (e.target as SVGRectElement).style.opacity = '1' }}
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={Math.min(12, width / 8)}
          fontWeight={500}
          style={{ pointerEvents: 'none', userSelect: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          {node.name.length > 12 ? node.name.slice(0, 12) + '...' : node.name}
        </text>
      )}
      {showLabel && width > 80 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize={Math.min(10, width / 10)}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {formatSize(node.size)}
        </text>
      )}
    </g>
  )
}

// ─── Squarified Treemap Layout ───────────────────────────────────────

function layoutTreemap(
  nodes: TreemapNode[],
  x: number,
  y: number,
  width: number,
  height: number,
  maxSize: number,
  onClick: (node: TreemapNode) => void
): React.ReactNode[] {
  if (nodes.length === 0 || width <= 0 || height <= 0) return []

  const total = nodes.reduce((s, n) => s + n.size, 0)
  if (total === 0) return []

  const elements: React.ReactNode[] = []
  let currentX = x
  let currentY = y
  let remainingWidth = width
  let remainingHeight = height
  let remainingNodes = [...nodes]

  while (remainingNodes.length > 0) {
    const isHorizontal = remainingWidth >= remainingHeight
    const primary = isHorizontal ? remainingWidth : remainingHeight

    let row: TreemapNode[] = []
    let rowSize = 0
    let bestAspect = Infinity

    for (let i = 0; i < remainingNodes.length; i++) {
      const testRow = remainingNodes.slice(0, i + 1)
      const testSize = testRow.reduce((s, n) => s + n.size, 0)
      const secondary = (testSize / total) * (isHorizontal ? remainingHeight : remainingWidth)

      if (secondary === 0) continue

      const maxInRow = Math.max(...testRow.map(n => n.size))
      const minInRow = Math.min(...testRow.map(n => n.size))
      const aspect = Math.max(
        (primary * primary * maxInRow) / (testSize * testSize),
        (testSize * testSize) / (primary * primary * minInRow)
      )

      if (aspect < bestAspect || i === 0) {
        bestAspect = aspect
        row = testRow
        rowSize = testSize
      } else {
        break
      }
    }

    if (row.length === 0) row = [remainingNodes[0]]

    const secondary = (rowSize / total) * (isHorizontal ? remainingHeight : remainingWidth)

    let itemX = currentX
    let itemY = currentY

    for (const node of row) {
      const itemPrimary = (node.size / rowSize) * primary
      const itemWidth = isHorizontal ? itemPrimary : secondary
      const itemHeight = isHorizontal ? secondary : itemPrimary

      elements.push(
        <TreemapRect
          key={node.path}
          node={node}
          x={itemX}
          y={itemY}
          width={itemWidth}
          height={itemHeight}
          maxSize={maxSize}
          onClick={onClick}
        />
      )

      if (isHorizontal) {
        itemX += itemPrimary
      } else {
        itemY += itemPrimary
      }
    }

    if (isHorizontal) {
      currentY += secondary
      remainingHeight -= secondary
    } else {
      currentX += secondary
      remainingWidth -= secondary
    }

    remainingNodes = remainingNodes.slice(row.length)
  }

  return elements
}

// ─── Main Component ──────────────────────────────────────────────────

export default function DiskAnalyzer() {
  const [activeTab, setActiveTab] = useState('treemap')
  const [path, setPath] = useState('/Users')
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState<TreemapNode | null>(null)
  const [largeFiles, setLargeFiles] = useState<FileNode[]>([])
  const [dirSummary, setDirSummary] = useState<[string, number, number][]>([])
  const [breadcrumb, setBreadcrumb] = useState<TreemapNode[]>([])
  const [selectedNode, setSelectedNode] = useState<TreemapNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const svgRef = useRef<SVGSVGElement>(null)

  const currentNode = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1] : treeData

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [tree, files, summary] = await Promise.all([
        analyzeDiskTreemap(path, 3),
        getLargeFiles(path, 100),
        getDirectorySummary(path),
      ])
      setTreeData(tree)
      setLargeFiles(files)
      setDirSummary(summary)
      setBreadcrumb([])
      setSelectedNode(null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleNodeClick = useCallback((node: TreemapNode) => {
    if (node.children && node.children.length > 0) {
      setBreadcrumb(prev => [...prev, node])
      setSelectedNode(null)
    } else {
      setSelectedNode(node)
    }
  }, [])

  const handleBreadcrumbClick = useCallback((index: number) => {
    setBreadcrumb(prev => prev.slice(0, index))
    setSelectedNode(null)
  }, [])

  const treemapElements = useMemo(() => {
    if (!currentNode || !currentNode.children) return []
    const filtered = searchQuery
      ? currentNode.children.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : currentNode.children
    return layoutTreemap(filtered, 0, 0, 800, 500, currentNode.size, handleNodeClick)
  }, [currentNode, searchQuery, handleNodeClick])

  const totalSize = currentNode?.size || 0

  const tabButtonStyle = (tab: string) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: activeTab === tab ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'inherit',
  })

  const cardStyle = {
    borderRadius: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    padding: '16px',
  }

  return (
    <PageLayout title="Disk Analyzer" subtitle="Visualize disk usage with interactive treemap">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="Enter path..."
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              width: '280px',
            }}
          />
          <button
            onClick={loadData}
            disabled={loading}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
            Scan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HardDrive size={20} style={{ color: '#60a5fa' }} />
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Total Size</p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{formatSize(totalSize)}</p>
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FolderOpen size={20} style={{ color: '#4ade80' }} />
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Directories</p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {currentNode?.children?.filter(c => c.children?.length).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={20} style={{ color: '#fbbf24' }} />
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Files</p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {currentNode?.children?.filter(c => !c.children?.length).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Layers size={20} style={{ color: '#a78bfa' }} />
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Items</p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {currentNode?.children?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        <button onClick={() => setActiveTab('treemap')} style={tabButtonStyle('treemap')}>Treemap</button>
        <button onClick={() => setActiveTab('large')} style={tabButtonStyle('large')}>Large Files</button>
        <button onClick={() => setActiveTab('summary')} style={tabButtonStyle('summary')}>Summary</button>
      </div>

      {/* Treemap Tab */}
      {activeTab === 'treemap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setBreadcrumb([]); setSelectedNode(null) }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FolderOpen size={14} />
              {treeData?.name || 'Root'}
            </button>
            {breadcrumb.map((node, i) => (
              <React.Fragment key={node.path}>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                <button
                  onClick={() => handleBreadcrumbClick(i + 1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                  }}
                >
                  {node.name}
                </button>
              </React.Fragment>
            ))}
            <div style={{ flex: 1 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter..."
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                width: '160px',
              }}
            />
          </div>

          {/* SVG Treemap */}
          <div style={{ ...cardStyle, overflow: 'hidden', position: 'relative' }}>
            {loading ? (
              <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <svg
                  ref={svgRef}
                  viewBox="0 0 800 500"
                  style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
                >
                  <rect x="0" y="0" width="800" height="500" fill="rgba(0,0,0,0.2)" rx={4} />
                  {treemapElements}
                </svg>

                {/* Selected node info */}
                <AnimatePresence>
                  {selectedNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        right: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '12px',
                        borderRadius: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>{selectedNode.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{selectedNode.path}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: '700', fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>{formatSize(selectedNode.size)}</p>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                            {totalSize > 0 ? ((selectedNode.size / totalSize) * 100).toFixed(1) : 0}% of total
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(0, 70%, 55%)', display: 'inline-block' }} />
              {'>50%'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(25, 80%, 55%)', display: 'inline-block' }} />
              {'25-50%'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(45, 80%, 55%)', display: 'inline-block' }} />
              {'10-25%'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(140, 60%, 50%)', display: 'inline-block' }} />
              {'5-10%'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(200, 60%, 55%)', display: 'inline-block' }} />
              {'<5%'}
            </span>
          </div>
        </div>
      )}

      {/* Large Files Tab */}
      {activeTab === 'large' && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Large Files</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
            </div>
          ) : largeFiles.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No large files found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {largeFiles.map((file) => (
                <div
                  key={file.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <FileText size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: '500', margin: 0, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.path}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--accent)', fontSize: '14px', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatSize(file.size)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Directory Summary</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
            </div>
          ) : dirSummary.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No data available</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dirSummary.map(([name, size, count]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <FolderOpen size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{count} items</span>
                    <span style={{ fontWeight: '600', color: 'var(--accent)', fontSize: '14px', minWidth: '80px', textAlign: 'right' }}>{formatSize(size)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  )
}
