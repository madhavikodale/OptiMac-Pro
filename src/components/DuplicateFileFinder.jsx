import { useState } from 'react'
import { FiSearch, FiCheckCircle, FiPlay } from 'react-icons/fi'

function DuplicateFileFinder({ uiMode }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState(null)

  const duplicates = [
    { hash: 'abc123', name: 'Photo_2024.jpg', copies: 3, size: '4.2 MB', totalSize: '12.6 MB', icon: '📷' },
    { hash: 'def456', name: 'Document.pdf', copies: 2, size: '2.8 MB', totalSize: '5.6 MB', icon: '📄' },
    { hash: 'ghi789', name: 'Video_Backup.mp4', copies: 2, size: '156 MB', totalSize: '312 MB', icon: '🎬' },
    { hash: 'jkl012', name: 'Config.json', copies: 4, size: '12 KB', totalSize: '48 KB', icon: '⚙️' },
    { hash: 'mno345', name: 'AudioFile.mp3', copies: 2, size: '8.3 MB', totalSize: '16.6 MB', icon: '🎵' },
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
            totalDuplicates: 13,
            spaceSavings: '347 MB',
            filesScanned: 45000
          })
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 400)
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          🔍 Duplicate File Finder
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Find and remove duplicate files with smart matching
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
            {isScanning ? 'Scanning Files...' : 'Start Deep Scan'}
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
                {Math.round(scanProgress)}% - Scanning your system...
              </p>
            </div>
          )}

          {/* Duplicate Preview */}
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
              Sample Duplicates Found
            </p>
            {duplicates.slice(0, 3).map((dup, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition ${
                  uiMode === 'premium'
                    ? 'glass hover:bg-purple-500/20'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dup.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                        {dup.name}
                      </p>
                      <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                        {dup.copies} copies found
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {dup.totalSize}
                    </p>
                  </div>
                </div>
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
            <div className="space-y-1 text-sm">
              <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
                Files Scanned: {results.filesScanned.toLocaleString()}
              </p>
              <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
                Duplicates Found: {results.totalDuplicates}
              </p>
              <p className={`text-lg font-bold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                Space Savings: {results.spaceSavings}
              </p>
            </div>
          </div>

          {/* All Duplicates */}
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
              All Duplicates
            </p>
            {duplicates.map((dup, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition flex items-center justify-between ${
                  uiMode === 'premium'
                    ? 'glass hover:bg-purple-500/10'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{dup.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                      {dup.name}
                    </p>
                    <p className={`text-xs ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {dup.copies} copies • {dup.totalSize}
                    </p>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  uiMode === 'premium'
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setResults(null)}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              uiMode === 'premium'
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  )
}

export default DuplicateFileFinder
