function ProcessList({ uiMode, processes = [] }) {
  // Convert bytes to MB
  const formatBytes = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(1)
  }

  // Use real processes or fallback to mock data
  const displayProcesses = processes.length > 0 ? processes : [
    { name: 'Google Chrome', cpu_usage: 23.4, memory: 1.2 * 1024 * 1024 * 1024, icon: '🌐' },
    { name: 'VS Code', cpu_usage: 12.7, memory: 890 * 1024 * 1024, icon: '💻' },
    { name: 'Docker', cpu_usage: 8.3, memory: 512 * 1024 * 1024, icon: '🐳' },
    { name: 'Telegram', cpu_usage: 6.1, memory: 378 * 1024 * 1024, icon: '💬' },
    { name: 'Spotify', cpu_usage: 4.8, memory: 256 * 1024 * 1024, icon: '🎵' },
  ]

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          Top Processes
        </h3>
        <button className={`text-sm ${uiMode === 'premium' ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}`}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {displayProcesses.map((process, idx) => (
          <div key={idx} className={`flex items-center justify-between p-3 rounded-lg transition ${
            uiMode === 'premium'
              ? 'hover:bg-purple-500/10'
              : 'hover:bg-gray-100'
          }`}>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">
                {process.icon || '📱'}
              </span>
              <div>
                <p className={`font-medium text-sm ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                  {process.name}
                </p>
                <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formatBytes(process.memory)} MB
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                {process.cpu_usage.toFixed(1)}%
              </p>
              <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                CPU Usage
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProcessList
