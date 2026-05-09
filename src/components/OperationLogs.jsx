import { useState } from 'react'
import { FiClock, FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi'

function OperationLogs({ uiMode }) {
  const [filter, setFilter] = useState('all')

  const logs = [
    { id: 1, action: 'Deep Clean', status: 'success', size: '8.9 GB', time: '2 hours ago', icon: '🧹' },
    { id: 2, action: 'Memory Optimize', status: 'success', size: '2.3 GB freed', time: '5 hours ago', icon: '💾' },
    { id: 3, action: 'Junk Cleaner', status: 'warning', size: '1.2 GB', time: '1 day ago', icon: '🗑️' },
    { id: 4, action: 'Disk Analysis', status: 'success', size: 'Completed', time: '2 days ago', icon: '📊' },
    { id: 5, action: 'Cache Clear', status: 'success', size: '4.5 GB', time: '3 days ago', icon: '🧠' },
    { id: 6, action: 'Smart Uninstall', status: 'success', size: '12.8 GB', time: '5 days ago', icon: '📦' },
  ]

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.status === filter)

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          📋 Operation History
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Track all optimization operations and results
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {['all', 'success', 'warning'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              filter === type
                ? uiMode === 'premium'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                : uiMode === 'premium'
                ? 'glass text-gray-400 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className={`p-4 rounded-lg transition flex items-center justify-between ${
              uiMode === 'premium'
                ? 'glass hover:bg-purple-500/10'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="text-2xl">{log.icon}</span>
              <div className="flex-1">
                <p className={`font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                  {log.action}
                </p>
                <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {log.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {log.size}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {log.status === 'success' ? (
                    <FiCheckCircle className={uiMode === 'premium' ? 'text-green-400' : 'text-green-600'} size={16} />
                  ) : (
                    <FiAlertCircle className={uiMode === 'premium' ? 'text-yellow-400' : 'text-yellow-600'} size={16} />
                  )}
                  <span className={`text-xs ${
                    log.status === 'success'
                      ? uiMode === 'premium' ? 'text-green-400' : 'text-green-600'
                      : uiMode === 'premium' ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </div>
              </div>

              <button className={`p-2 rounded-lg transition ${
                uiMode === 'premium'
                  ? 'hover:bg-purple-500/20 text-cyan-400'
                  : 'hover:bg-gray-200 text-blue-600'
              }`}>
                <FiDownload size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Button */}
      <button className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
        uiMode === 'premium'
          ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      }`}>
        📥 Export History
      </button>
    </div>
  )
}

export default OperationLogs
