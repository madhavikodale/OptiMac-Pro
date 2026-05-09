import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

function PerformanceMetrics({ systemData, uiMode }) {
  const data = [
    { name: 'CPU', value: systemData.cpu, color: uiMode === 'premium' ? '#00D9FF' : '#3B82F6' },
    { name: 'Memory', value: systemData.memory, color: uiMode === 'premium' ? '#6366F1' : '#10B981' },
    { name: 'Disk', value: systemData.disk, color: uiMode === 'premium' ? '#EC4899' : '#F59E0B' },
  ]

  const chartData = [
    { time: '10:24', cpu: 45, memory: 65, disk: 42 },
    { time: '10:25', cpu: 52, memory: 68, disk: 42 },
    { time: '10:26', cpu: 48, memory: 70, disk: 42 },
    { time: '10:27', cpu: 61, memory: 72, disk: 42 },
    { time: '10:28', cpu: 55, memory: 68, disk: 42 },
    { time: '10:29', cpu: 67, memory: 75, disk: 42 },
    { time: '10:30', cpu: Math.round(systemData.cpu), memory: Math.round(systemData.memory), disk: 42 },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((metric) => (
        <div
          key={metric.name}
          className={`p-4 rounded-2xl transition ${
            uiMode === 'premium'
              ? 'glass neon-glow'
              : 'bg-dark-900 border border-gray-700'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs uppercase text-gray-500 tracking-wider mb-1">
                {metric.name}
              </div>
              <div className="text-2xl font-bold" style={{ color: metric.color }}>
                {metric.name === 'CPU' ? `${Math.round(systemData.cpu)}%` :
                 metric.name === 'Memory' ? `${Math.round(systemData.memory)}%` :
                 `${systemData.disk}%`}
              </div>
            </div>
            <div className="text-2xl">
              {metric.name === 'CPU' ? '🖥️' : metric.name === 'Memory' ? '💾' : '💿'}
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-16 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <Line
                  type="monotone"
                  dataKey={metric.name === 'CPU' ? 'cpu' : metric.name === 'Memory' ? 'memory' : 'disk'}
                  stroke={metric.color}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            {metric.name === 'CPU' && `Cores: 12 | Threads: 19`}
            {metric.name === 'Memory' && `10.8 GB / 16 GB`}
            {metric.name === 'Disk' && `245 GB / 1 TB`}
          </div>
        </div>
      ))}

      {/* Bottom Row - Network, Battery, Temperature, Uptime */}
      <div className={`p-4 rounded-2xl transition ${
        uiMode === 'premium' ? 'glass neon-glow' : 'bg-dark-900 border border-gray-700'
      }`}>
        <div className="text-xs uppercase text-gray-500 tracking-wider mb-2">Network</div>
        <div className="text-lg font-bold text-cyan-400 mb-2">Wi-Fi</div>
        <div className="space-y-1">
          <div className="text-sm">↑ {systemData.networkUp.toFixed(1)} MB/s</div>
          <div className="text-sm">↓ {systemData.networkDown.toFixed(1)} MB/s</div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl transition ${
        uiMode === 'premium' ? 'glass neon-glow' : 'bg-dark-900 border border-gray-700'
      }`}>
        <div className="text-xs uppercase text-gray-500 tracking-wider mb-2">Battery</div>
        <div className="text-2xl font-bold text-green-400 mb-2">{systemData.batteryHealth}%</div>
        <div className="text-xs text-gray-500">Charging</div>
        <div className="text-xs text-gray-500">2 h 15 m</div>
      </div>

      <div className={`p-4 rounded-2xl transition ${
        uiMode === 'premium' ? 'glass neon-glow' : 'bg-dark-900 border border-gray-700'
      }`}>
        <div className="text-xs uppercase text-gray-500 tracking-wider mb-2">Temperature</div>
        <div className="text-2xl font-bold text-amber-400 mb-2">{Math.round(systemData.temperature)}°C</div>
        <div className="text-xs text-gray-500">CPU Thermal</div>
      </div>

      <div className={`p-4 rounded-2xl transition ${
        uiMode === 'premium' ? 'glass neon-glow' : 'bg-dark-900 border border-gray-700'
      }`}>
        <div className="text-xs uppercase text-gray-500 tracking-wider mb-2">Uptime</div>
        <div className="text-2xl font-bold text-blue-400 mb-2">5d 14h</div>
        <div className="text-xs text-gray-500">Running Smoothly</div>
      </div>
    </div>
  )
}

export default PerformanceMetrics
