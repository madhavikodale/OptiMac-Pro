import { useState, useEffect } from 'react'
import { FiWifi, FiActivity } from 'react-icons/fi'

function NetworkMonitor({ uiMode, networkUp = 0, networkDown = 0 }) {
  const [networkHistory, setNetworkHistory] = useState([])

  useEffect(() => {
    setNetworkHistory(prev => [...prev.slice(-19), { up: networkUp, down: networkDown }])
  }, [networkUp, networkDown])

  const connections = [
    { name: 'Wi-Fi', status: 'Connected', ip: '192.168.1.45', signal: 5, speed: '802.11ax' },
    { name: 'Bluetooth', status: 'Connected', devices: 3, icon: '🎧' },
  ]

  const recentApps = [
    { name: 'Google Chrome', download: 5.2, upload: 1.3, icon: '🌐' },
    { name: 'iCloud', download: 2.1, upload: 0.8, icon: '☁️' },
    { name: 'Spotify', download: 0.8, upload: 0.1, icon: '🎵' },
    { name: 'Docker', download: 0.5, upload: 0.3, icon: '🐳' },
  ]

  const getSignalBars = (signal) => {
    return Array(signal).fill('█').join('')
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          📡 Network Monitor
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Real-time network activity and connection analysis
        </p>
      </div>

      {/* Real-time Speed */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
          <p className={`text-xs uppercase text-gray-500 tracking-wider mb-2`}>Download Speed</p>
          <p className={`text-3xl font-bold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
            {networkDown.toFixed(1)} MB/s
          </p>
          <p className={`text-xs mt-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
            ↓ Incoming
          </p>
        </div>

        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
          <p className={`text-xs uppercase text-gray-500 tracking-wider mb-2`}>Upload Speed</p>
          <p className={`text-3xl font-bold ${uiMode === 'premium' ? 'text-purple-400' : 'text-green-600'}`}>
            {networkUp.toFixed(1)} MB/s
          </p>
          <p className={`text-xs mt-1 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
            ↑ Outgoing
          </p>
        </div>
      </div>

      {/* Network History Chart */}
      <div className={`p-4 rounded-lg mb-6 ${uiMode === 'premium' ? 'bg-purple-500/10' : 'bg-gray-50'}`}>
        <p className={`text-xs font-semibold mb-3 ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
          Network Activity (Last 20s)
        </p>
        <div className="flex items-end gap-1 h-24">
          {networkHistory.length === 0 ? (
            <p className={`text-sm ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-500'}`}>
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
                    backgroundColor: uiMode === 'premium' ? '#00D9FF' : '#3B82F6',
                    minHeight: '2px'
                  }}
                ></div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Connections */}
      <div className="mb-6">
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          <FiWifi size={18} />
          Active Connections
        </h3>
        <div className="space-y-2">
          {connections.map((conn, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition ${
                uiMode === 'premium'
                  ? 'glass hover:bg-purple-500/10'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {conn.name}
                  </p>
                  {conn.ip && (
                    <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {conn.ip} • {conn.speed}
                    </p>
                  )}
                  {conn.devices && (
                    <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {conn.devices} connected devices
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {conn.signal && (
                    <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {getSignalBars(conn.signal)}
                    </p>
                  )}
                  <p className={`text-xs font-medium ${
                    uiMode === 'premium' ? 'text-green-400' : 'text-green-600'
                  }`}>
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
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          <FiActivity size={18} />
          Network Usage by App
        </h3>
        <div className="space-y-2">
          {recentApps.map((app, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                uiMode === 'premium'
                  ? 'glass hover:bg-purple-500/10'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{app.icon}</span>
                <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                  {app.name}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                  ↓ {app.download} MB/s
                </p>
                <p className={`text-xs ${uiMode === 'premium' ? 'text-purple-400' : 'text-green-600'}`}>
                  ↑ {app.upload} MB/s
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NetworkMonitor
