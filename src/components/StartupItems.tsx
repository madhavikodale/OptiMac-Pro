import React, { useState } from 'react'
import { Power, ToggleRight, Trash2, Info } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface StartupItem {
  id: string
  name: string
  enabled: boolean
  path: string
  startup_time: number
}

const mockStartupItems: StartupItem[] = [
  { id: '1', name: 'Google Chrome', enabled: true, path: '/Applications/Google Chrome.app', startup_time: 2.3 },
  { id: '2', name: 'Slack', enabled: true, path: '/Applications/Slack.app', startup_time: 1.8 },
  { id: '3', name: 'Spotify', enabled: true, path: '/Applications/Spotify.app', startup_time: 1.2 },
  { id: '4', name: 'Dropbox', enabled: false, path: '/Applications/Dropbox.app', startup_time: 0.9 },
  { id: '5', name: 'Adobe Creative Cloud', enabled: true, path: '/Applications/Adobe/CreativeCloud.app', startup_time: 3.1 },
  { id: '6', name: 'Zoom', enabled: true, path: '/Applications/zoom.us.app', startup_time: 1.4 },
  { id: '7', name: 'OneDrive', enabled: false, path: '/Applications/OneDrive.app', startup_time: 0.8 },
]

export const StartupItems: React.FC = () => {
  const { isDark } = useTheme()
  const [items, setItems] = useState<StartupItem[]>(mockStartupItems)

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    )
  }

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalStartupTime = items.filter((i) => i.enabled).reduce((sum, i) => sum + i.startup_time, 0)
  const enabledCount = items.filter((i) => i.enabled).length

  return (
    <div className={`min-h-full p-6 md:p-8 transition-colors duration-300 ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${isDark ? 'text-neutral-50' : 'text-neutral-900'}`}>
          <Power className="text-cyan-400" size={32} />
          Startup Items
        </h1>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Manage applications that launch at startup</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Total Items</p>
          <p className="text-2xl font-bold text-cyan-400">{items.length}</p>
        </div>
        <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Enabled</p>
          <p className="text-2xl font-bold text-green-400">{enabledCount}</p>
        </div>
        <div className={`rounded-xl p-4 border transition-colors duration-300 ${isDark ? 'glass border-white/10' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <p className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>Startup Time</p>
          <p className="text-2xl font-bold text-purple-400">{totalStartupTime.toFixed(1)}s</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-white/50">{item.path}</p>
                <p className="text-xs text-white/40 mt-1">Startup delay: {item.startup_time}s</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`p-2 rounded-lg transition-all ${
                    item.enabled
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                  }`}
                >
                  <ToggleRight size={18} />
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass rounded-xl p-4 border border-cyan-400/30 bg-cyan-500/10">
        <div className="flex gap-3">
          <Info size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold mb-1">Optimization Tip</p>
            <p className="text-sm text-white/70">
              Disabling {enabledCount} startup items could reduce your boot time by approximately {totalStartupTime.toFixed(1)}s.
              Only keep essential applications enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartupItems
