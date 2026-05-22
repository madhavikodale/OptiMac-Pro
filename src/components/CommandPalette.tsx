import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Command, Zap, Settings, BarChart3, Wifi, HardDrive, Layers, ChevronRight } from 'lucide-react'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const commands = [
    // Navigation
    { id: 'dashboard', label: 'Go to Dashboard', icon: BarChart3, category: 'Navigation', action: () => navigate('/'), color: '6, 182, 212' },
    { id: 'optimize', label: 'Go to Optimize', icon: Zap, category: 'Navigation', action: () => navigate('/optimize'), color: '168, 85, 247' },
    { id: 'processes', label: 'Go to Processes', icon: Layers, category: 'Navigation', action: () => navigate('/processes'), color: '59, 130, 246' },
    { id: 'network', label: 'Go to Network', icon: Wifi, category: 'Navigation', action: () => navigate('/network'), color: '236, 72, 153' },
    { id: 'storage', label: 'Go to Storage', icon: HardDrive, category: 'Navigation', action: () => navigate('/storage'), color: '74, 222, 128' },
    { id: 'settings', label: 'Go to Settings', icon: Settings, category: 'Navigation', action: () => navigate('/settings'), color: '107, 114, 128' },

    // Quick Actions
    { id: 'optimize-system', label: 'Optimize System', icon: Zap, category: 'Actions', action: () => alert('Optimization started!'), color: '168, 85, 247' },
    { id: 'clear-cache', label: 'Clear Cache', icon: Zap, category: 'Actions', action: () => alert('Cache cleared!'), color: '249, 115, 22' },
    { id: 'free-memory', label: 'Free Memory', icon: Zap, category: 'Actions', action: () => alert('Memory optimized!'), color: '59, 130, 246' },
    { id: 'clean-temp', label: 'Clean Temp Files', icon: Zap, category: 'Actions', action: () => alert('Temp files cleaned!'), color: '34, 197, 94' },

    // System Commands
    { id: 'check-health', label: 'Check System Health', icon: BarChart3, category: 'System', action: () => alert('Health check started'), color: '6, 182, 212' },
    { id: 'view-processes', label: 'View All Processes', icon: Layers, category: 'System', action: () => navigate('/processes'), color: '139, 92, 246' },
    { id: 'network-status', label: 'Network Status', icon: Wifi, category: 'System', action: () => navigate('/network'), color: '236, 72, 153' },
    { id: 'disk-usage', label: 'Disk Usage Details', icon: HardDrive, category: 'System', action: () => navigate('/storage'), color: '74, 222, 128' },
  ]

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
        setQuery('')
        setSelectedIndex(0)
      }
      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filtered.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action()
            setIsOpen(false)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, query, selectedIndex, filtered])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const groupedCommands = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, typeof commands>)

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* COMMAND PALETTE */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(600px, 90vw)',
            maxHeight: '70vh',
            background: 'linear-gradient(135deg, rgba(15,15,35,0.95) 0%, rgba(20,20,40,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            backdropFilter: 'blur(30px)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* SEARCH INPUT */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Search size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '15px',
                fontWeight: '500',
                fontFamily: 'inherit'
              }}
            />
            <kbd style={{
              padding: '4px 8px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'monospace',
              fontWeight: '600'
            }}>
              ESC
            </kbd>
          </div>

          {/* RESULTS */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)'
              }}>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>No commands found</p>
                <p style={{ fontSize: '12px', marginTop: '6px' }}>Try a different search</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  {/* CATEGORY HEADER */}
                  <div style={{
                    padding: '12px 20px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px'
                  }}>
                    {category}
                  </div>

                  {/* COMMANDS */}
                  {cmds.map((cmd, index) => {
                    const globalIndex = filtered.indexOf(cmd)
                    const isSelected = globalIndex === selectedIndex
                    const Icon = cmd.icon
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action()
                          setIsOpen(false)
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          margin: '0 8px',
                          borderRadius: '10px',
                          background: isSelected
                            ? `linear-gradient(135deg, rgba(${cmd.color},0.2) 0%, rgba(${cmd.color},0.1) 100%)`
                            : 'transparent',
                          color: isSelected ? `rgb(${cmd.color})` : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: isSelected ? `1px solid rgba(${cmd.color},0.3)` : '1px solid transparent'
                        }}
                      >
                        <Icon size={16} strokeWidth={2} />
                        <span style={{ flex: 1, textAlign: 'left' }}>{cmd.label}</span>
                        {isSelected && (
                          <ChevronRight size={16} style={{ opacity: 0.6 }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <kbd style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>↑↓</kbd>
              <span>Navigate</span>
              <kbd style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>⏎</kbd>
              <span>Select</span>
            </div>
            <span>{filtered.length} results</span>
          </div>
        </div>
      )}

      {/* TRIGGER BUTTON (HIDDEN - Only visible with keyboard shortcut) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        /* Smooth scrollbar */
        @supports (scrollbar-width: thin) {
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.3);
          }
        }
      `}</style>
    </>
  )
}
