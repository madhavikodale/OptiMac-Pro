import React, { useEffect, useState } from 'react'
import { Keyboard, X } from 'lucide-react'

interface Shortcut {
  keys: string[]
  description: string
}

const shortcuts: Shortcut[] = [
  { keys: ['⌘', 'K'], description: 'Open Command Palette' },
  { keys: ['⌘', 'D'], description: 'Go to Dashboard' },
  { keys: ['⌘', 'O'], description: 'Go to Optimize' },
  { keys: ['⌘', 'P'], description: 'Go to Processes' },
  { keys: ['⌘', 'N'], description: 'Go to Network' },
  { keys: ['⌘', 'S'], description: 'Go to Storage' },
  { keys: ['⌘', ','], description: 'Go to Settings' },
  { keys: ['⌘', 'T'], description: 'Toggle Theme' },
  { keys: ['⌘', '/'], description: 'Show Shortcuts' },
  { keys: ['Esc'], description: 'Close Overlay' },
]

export default function ShortcutsOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false)
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setVisible((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={() => setVisible(false)}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '32px',
          width: '480px',
          maxWidth: '90vw',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Keyboard size={20} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shortcuts.map((shortcut, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--bg-card)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                {shortcut.description}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {shortcut.keys.map((key, j) => (
                  <kbd
                    key={j}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      minWidth: '24px',
                      textAlign: 'center',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
