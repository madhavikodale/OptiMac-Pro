import { useState } from 'react'
import { FiHardDrive, FiFilter } from 'react-icons/fi'

function StorageAnalyzer({ uiMode }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const storageData = [
    { name: 'Applications', size: 145, percentage: 28, icon: '📱', color: '#00D9FF' },
    { name: 'Documents', size: 89, percentage: 17, icon: '📄', color: '#6366F1' },
    { name: 'Media', size: 156, percentage: 30, icon: '🎬', color: '#EC4899' },
    { name: 'System', size: 78, percentage: 15, icon: '⚙️', color: '#10B981' },
    { name: 'Other', size: 52, percentage: 10, icon: '📦', color: '#F59E0B' },
  ]

  const largeFiles = [
    { name: 'Final_Cut_Pro_Cache', size: '23.4 GB', type: 'Cache', deletable: true },
    { name: 'Old_Backup.dmg', size: '18.2 GB', type: 'Archive', deletable: true },
    { name: 'MasterClass_Videos', size: '15.6 GB', type: 'Media', deletable: false },
    { name: 'XCode_Simulators', size: '12.8 GB', type: 'Development', deletable: true },
    { name: 'VM_Images', size: '9.3 GB', type: 'Virtual Machine', deletable: false },
  ]

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          💾 Storage Analyzer
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Visualize disk usage and find large files instantly
        </p>
      </div>

      {/* Storage Chart */}
      <div className="mb-8">
        <div className="flex items-end gap-2 h-40 mb-4">
          {storageData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div
                  className={`w-full rounded-t-lg transition hover:opacity-80 cursor-pointer ${
                    uiMode === 'premium' ? 'hover:shadow-lg hover:shadow-cyan-500/50' : ''
                  }`}
                  style={{
                    height: `${item.percentage * 1.5}px`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.name}: ${item.size}GB`}
                ></div>
              </div>
              <p className={`text-xs mt-2 font-medium ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.icon}
              </p>
              <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-500'}`}>
                {item.percentage}%
              </p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2">
          {storageData.map((item, idx) => (
            <div key={idx} className={`p-2 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <p className={`text-xs font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </p>
              </div>
              <p className={`text-xs ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                {item.size}GB
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Large Files Section */}
      <div>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          <FiHardDrive size={18} />
          Largest Files
        </h3>
        <div className="space-y-2">
          {largeFiles.map((file, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg transition flex items-center justify-between ${
                uiMode === 'premium'
                  ? 'glass hover:bg-purple-500/10'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex-1">
                <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                  {file.name}
                </p>
                <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {file.type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {file.size}
                </p>
                {file.deletable && (
                  <button className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    uiMode === 'premium'
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StorageAnalyzer
