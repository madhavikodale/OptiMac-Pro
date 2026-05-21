import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

interface Command {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
  category: string
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const commands: Command[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'View system overview',
      icon: '📊',
      action: () => {
        navigate('/')
        setOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'performance',
      label: 'Performance',
      description: 'CPU, GPU, and thermal monitoring',
      icon: '⚡',
      action: () => {
        navigate('/performance')
        setOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'optimize',
      label: 'One-Click Optimize',
      description: 'Start system optimization',
      icon: '✨',
      action: () => {
        navigate('/optimize')
        setOpen(false)
      },
      category: 'Actions',
    },
    {
      id: 'clean',
      label: 'Clean Junk Files',
      description: 'Remove temporary files',
      icon: '🧹',
      action: () => {
        navigate('/cleaner')
        setOpen(false)
      },
      category: 'Actions',
    },
    {
      id: 'processes',
      label: 'Processes',
      description: 'Manage running applications',
      icon: '⚙️',
      action: () => {
        navigate('/processes')
        setOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'ai',
      label: 'AI Intelligence',
      description: 'Get smart recommendations',
      icon: '🤖',
      action: () => {
        navigate('/ai')
        setOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure preferences',
      icon: '⚙️',
      action: () => {
        navigate('/settings')
        setOpen(false)
      },
      category: 'Navigation',
    },
  ]

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!open)
        setSearch('')
        setSelectedIndex(0)
      }
      if (open) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((i) => (i + 1) % filtered.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          filtered[selectedIndex]?.action()
        } else if (e.key === 'Escape') {
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, search, selectedIndex, filtered])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm flex items-center gap-2 transition-all z-40"
      >
        <Search size={16} />
        <span>⌘K</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl mx-4 glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <Search size={20} className="text-white/40" />
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            autoFocus
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-white/40"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-white/50">
              No commands found
            </div>
          ) : (
            <div className="py-2">
              {filtered.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className={`w-full px-6 py-3 flex items-center gap-4 transition-colors ${
                    index === selectedIndex
                      ? 'bg-white/10 border-l-2 border-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{cmd.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{cmd.label}</p>
                    <p className="text-xs text-white/50">{cmd.description}</p>
                  </div>
                  <span className="text-xs text-white/40 px-2 py-1 bg-white/5 rounded">
                    {cmd.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span>↑↓ Navigate • ⏎ Select • ⎋ Close</span>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
