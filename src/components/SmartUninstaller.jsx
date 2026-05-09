import { useState } from 'react'
import { FiPackage, FiTrash2, FiCheckCircle } from 'react-icons/fi'

function SmartUninstaller({ uiMode }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState(null)

  const installedApps = [
    { name: 'Adobe Creative Cloud', size: '12.4 GB', icon: '🎨', leftover: '2.1 GB' },
    { name: 'Final Cut Pro', size: '8.9 GB', icon: '🎬', leftover: '1.3 GB' },
    { name: 'Microsoft Office', size: '6.7 GB', icon: '📊', leftover: '890 MB' },
    { name: 'Xcode', size: '15.2 GB', icon: '💻', leftover: '3.4 GB' },
    { name: 'Docker Desktop', size: '4.3 GB', icon: '🐳', leftover: '650 MB' },
    { name: 'Parallels Desktop', size: '5.6 GB', icon: '🖥️', leftover: '1.2 GB' },
  ]

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setResults({
            totalLeftover: '10.5 GB',
            appsScanned: 47,
            cleanableApps: 12
          })
          return 100
        }
        return prev + Math.random() * 25
      })
    }, 400)
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          📦 Smart Uninstaller
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Uninstall apps completely and remove leftover files
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
            <FiPackage size={20} />
            {isScanning ? 'Scanning Apps...' : 'Scan Installed Apps'}
          </button>

          {/* Progress */}
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
                {Math.round(scanProgress)}% - Scanning applications...
              </p>
            </div>
          )}

          {/* Apps List */}
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
              Popular Applications
            </p>
            {installedApps.map((app, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition flex items-center justify-between ${
                  uiMode === 'premium'
                    ? 'glass hover:bg-purple-500/20'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                      {app.name}
                    </p>
                    <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {app.size} • {app.leftover} leftover
                    </p>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  uiMode === 'premium'
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}>
                  Uninstall
                </button>
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
            <div className="space-y-1">
              <p className={`text-sm ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
                Apps Scanned: {results.appsScanned}
              </p>
              <p className={`text-sm ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
                Cleanable Apps: {results.cleanableApps}
              </p>
              <p className={`text-lg font-bold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                Total Leftover: {results.totalLeftover}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className={`py-3 rounded-lg font-semibold transition ${
              uiMode === 'premium'
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}>
              👁️ Review
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

export default SmartUninstaller
