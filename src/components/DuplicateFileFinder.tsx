import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle2, RotateCcw, Trash2, Play } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface DuplicateItem {
  hash: string
  name: string
  copies: number
  size: string
  totalSize: string
  icon: string
}

const duplicates: DuplicateItem[] = [
  { hash: 'abc123', name: 'Photo_2024.jpg', copies: 3, size: '4.2 MB', totalSize: '12.6 MB', icon: '📷' },
  { hash: 'def456', name: 'Document.pdf', copies: 2, size: '2.8 MB', totalSize: '5.6 MB', icon: '📄' },
  { hash: 'ghi789', name: 'Video_Backup.mp4', copies: 2, size: '156 MB', totalSize: '312 MB', icon: '🎬' },
  { hash: 'jkl012', name: 'Config.json', copies: 4, size: '12 KB', totalSize: '48 KB', icon: '⚙️' },
  { hash: 'mno345', name: 'AudioFile.mp3', copies: 2, size: '8.3 MB', totalSize: '16.6 MB', icon: '🎵' },
]

interface ScanResults {
  totalDuplicates: number
  spaceSavings: string
  filesScanned: number
}

export const DuplicateFileFinder: React.FC = () => {
  const { isDark } = useTheme()
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<ScanResults | null>(null)

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setResults({
            totalDuplicates: 13,
            spaceSavings: '347 MB',
            filesScanned: 45000,
          })
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 400)
  }

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
          <Search size={20} className="text-cyan-400" />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Duplicate File Finder
          </h2>
        </div>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
          Find and remove duplicate files with smart matching
        </p>
      </div>

      {!results ? (
        <div className="space-y-4">
          <button
            onClick={startScan}
            disabled={isScanning}
            className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg disabled:opacity-50"
          >
            <Play size={18} />
            {isScanning ? 'Scanning Files...' : 'Start Deep Scan'}
          </button>

          {isScanning && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <div className="w-full bg-neutral-700 rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: `${Math.min(scanProgress, 100)}%` }}
                />
              </div>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {Math.round(scanProgress)}% - Scanning your system...
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Sample Duplicates Found
            </p>
            {duplicates.slice(0, 3).map((dup, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition ${
                  isDark
                    ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                    : 'bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dup.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {dup.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                        {dup.copies} copies found
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {dup.totalSize}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={18} className={isDark ? 'text-green-400' : 'text-green-600'} />
              <h3 className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-900'}`}>
                Scan Complete!
              </h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
                Files Scanned: {results.filesScanned.toLocaleString()}
              </p>
              <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
                Duplicates Found: {results.totalDuplicates}
              </p>
              <p className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                Space Savings: {results.spaceSavings}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              All Duplicates
            </p>
            {duplicates.map((dup, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition flex items-center justify-between ${
                  isDark
                    ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                    : 'bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{dup.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {dup.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                      {dup.copies} copies • {dup.totalSize}
                    </p>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  isDark
                    ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}>
                  <Trash2 size={12} className="inline mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setResults(null)}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-1 ${
              isDark
                ? 'bg-white/[0.05] hover:bg-white/[0.08] text-neutral-300'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
            }`}
          >
            <RotateCcw size={14} />
            Scan Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default DuplicateFileFinder
