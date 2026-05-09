import { useState } from 'react'
import { FiTrash2, FiCheckCircle, FiAlertCircle, FiPlay } from 'react-icons/fi'

function DeepCleaner({ uiMode }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState(null)

  const categories = [
    { name: 'Cache Files', size: '2.4 GB', icon: '📦', risk: 'safe' },
    { name: 'Temporary Files', size: '1.8 GB', icon: '📄', risk: 'safe' },
    { name: 'Language Files', size: '856 MB', icon: '🌐', risk: 'medium' },
    { name: 'Duplicate Files', size: '3.2 GB', icon: '🔄', risk: 'safe' },
    { name: 'Old Logs', size: '512 MB', icon: '📋', risk: 'safe' },
    { name: 'Broken Preferences', size: '128 MB', icon: '⚙️', risk: 'medium' },
  ]

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setResults({ totalSize: '8.9 GB', itemsFound: 12847 })
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 500)
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          🧹 Deep Cleaner
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Scan and remove junk files safely with dry-run preview
        </p>
      </div>

      {!results ? (
        <div className="space-y-4">
          {/* Scan Button */}
          <button
            onClick={startScan}
            disabled={isScanning}
            className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              uiMode === 'premium'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg disabled:opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white disabled:opacity-50'
            }`}
          >
            <FiPlay size={20} />
            {isScanning ? 'Scanning...' : 'Start Deep Scan'}
          </button>

          {/* Progress Bar */}
          {isScanning && (
            <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'bg-purple-500/10' : 'bg-blue-50'}`}>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    uiMode === 'premium' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-green-500'
                  }`}
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className={`text-sm ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(scanProgress)}% complete
              </p>
            </div>
          )}

          {/* Categories Preview */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition ${
                  uiMode === 'premium'
                    ? 'glass hover:bg-purple-500/20'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{cat.icon}</span>
                  <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {cat.name}
                  </p>
                </div>
                <p className={`text-xs ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {cat.size}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Results */}
          <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className={uiMode === 'premium' ? 'text-green-400' : 'text-green-600'} size={20} />
              <h3 className={`font-semibold ${uiMode === 'premium' ? 'text-green-400' : 'text-green-900'}`}>
                Scan Complete!
              </h3>
            </div>
            <p className={`text-sm ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
              Found {results.itemsFound.toLocaleString()} items totaling {results.totalSize}
            </p>
          </div>

          {/* Preview & Action */}
          <div className="grid grid-cols-2 gap-3">
            <button className={`py-3 rounded-lg font-semibold transition ${
              uiMode === 'premium'
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}>
              👁️ Preview
            </button>
            <button className={`py-3 rounded-lg font-semibold transition ${
              uiMode === 'premium'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
            }`}>
              🗑️ Clean Now
            </button>
          </div>

          <button
            onClick={() => setResults(null)}
            className={`w-full py-2 rounded-lg text-sm transition ${
              uiMode === 'premium'
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  )
}

export default DeepCleaner
