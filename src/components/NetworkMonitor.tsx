import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, Activity, ArrowDown, ArrowUp } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSystemData } from '../hooks/useSystemData'

interface NetworkPoint {
  up: number
  down: number
}

interface Connection {
  name: string
  status: string
  ip?: string
  signal?: number
  speed?: string
  devices?: number
  icon?: string
}

const connections: Connection[] = [
  { name: 'Wi-Fi', status: 'Connected', ip: '192.168.1.45', signal: 5, speed: '802.11ax' },
  { name: 'Bluetooth', status: 'Connected', devices: 3, icon: '🎧' },
]

interface NetworkApp {
  name: string
  download: number
  upload: number
  icon: string
}

const recentApps: NetworkApp[] = [
  { name: 'Google Chrome', download: 5.2, upload: 1.3, icon: '🌐' },
  { name: 'iCloud', download: 2.1, upload: 0.8, icon: '☁️' },
  { name: 'Spotify', download: 0.8, upload: 0.1, icon: '🎵' },
  { name: 'Docker', download: 0.5, upload: 0.3, icon: '🐳' },
]

export const NetworkMonitor: React.FC = () => {
  const { isDark } = useTheme()
  const { systemData } = useSystemData()
  const [networkHistory, setNetworkHistory] = useState<NetworkPoint[]>([])

  const networkUp = systemData.networkUsage * 0.3
  const networkDown = systemData.networkUsage

  useEffect(() => {
    setNetworkHistory((prev) => [...prev.slice(-19), { up: networkUp, down: networkDown }])
  }, [networkUp, networkDown])

  const cardBg = isDark
    ? 'bg-white/[0.03] border border-white/[0.06]'
    : 'bg-white border border-black/[0.06]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 ${cardBg}`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Wifi size={20} className="text-cyan-400" />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Network Monitor
          </h2>
        </div>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
          Real-time network activity and connection analysis
        </p>
      </div>

      {/* Real-time Speed */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-white/[0.02]' : 'bg-neutral-50'}`}>
          <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Download Speed
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
            {networkDown.toFixed(1)} MB/s
          </p>
          <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
            <ArrowDown size={10} /> Incoming
          </p>
        </div>

        <div className={`p-4 rounded-lg ${isDark ? 'bg-white/[0.02]' : 'bg-neutral-50'}`}>
          <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Upload Speed
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-green-600'}`}>
            {networkUp.toFixed(1)} MB/s
          </p>
          <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
            <ArrowUp size={10} /> Outgoing
          </p>
        </div>
      </div>

      {/* Network History Chart */}
      <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
        <p className={`text-xs font-semibold mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Network Activity (Last 20s)
        </p>
        <div className="flex items-end gap-1 h-24">
          {networkHistory.length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Waiting for data...
            </p>
          ) : (
            networkHistory.map((point, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1"
                title={`Down: ${point.down.toFixed(1)}, Up: ${point.up.toFixed(1)}`}
              >
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.min(point.down * 10, 100)}%`,
                    backgroundColor: isDark ? '#00D9FF' : '#3B82F6',
                    minHeight: '2px',
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Connections */}
      <div className="mb-6">
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          <Wifi size={16} />
          Active Connections
        </h3>
        <div className="space-y-2">
          {connections.map((conn, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition ${
                isDark
                  ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                  : 'bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {conn.name}
                  </p>
                  {conn.ip && (
                    <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                      {conn.ip} • {conn.speed}
                    </p>
                  )}
                  {conn.devices && (
                    <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                      {conn.devices} connected devices
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {conn.signal && (
                    <p className={`text-sm font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {'█'.repeat(conn.signal)}
                    </p>
                  )}
                  <p className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    ● {conn.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Network Apps */}
      <div>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          <Activity size={16} />
          Network Usage by App
        </h3>
        <div className="space-y-2">
          {recentApps.map((app, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                isDark
                  ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                  : 'bg-neutral-50 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{app.icon}</span>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {app.name}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  ↓ {app.download} MB/s
                </p>
                <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-green-600'}`}>
                  ↑ {app.upload} MB/s
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default NetworkMonitor
