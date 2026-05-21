import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Trash2, CheckCircle2, RotateCcw } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface AppItem {
  name: string
  size: string
  icon: string
  leftover: string
}

const installedApps: AppItem[] = [
  { name: 'Adobe Creative Cloud', size: '12.4 GB', icon: '🎨', leftover: '2.1 GB' },
  { name: 'Final Cut Pro', size: '8.9 GB', icon: '🎬', leftover: '1.3 GB' },
  { name: 'Microsoft Office', size: '6.7 GB', icon: '📊', leftover: '890 MB' },
  { name: 'Xcode', size: '15.2 GB', icon: '💻', leftover: '3.4 GB' },
  { name: 'Docker Desktop', size: '4.3 GB', icon: '🐳', leftover: '650 MB' },
  { name: 'Parallels Desktop', size: '5.6 GB', icon: '🖥️', leftover: '1.2 GB' },
]

interface ScanResults {
  totalLeftover: string
  appsScanned: number
  cleanableApps: number
}

export const SmartUninstaller: React.FC = () => {
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
            totalLeftover: '10.5 GB',
            appsScanned: 47,
            cleanableApps: 12,
          })
          return 100
        }
        return prev + Math.random() * 25
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
          <Package size={20} className="text-purple-400" />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Smart Uninstaller
          </h2>
        </div>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
          Uninstall apps completely and remove leftover files
        </p>
      </div>

      {!results ? (
        <div className="space-y-4">
          <button
            onClick={startScan}
            disabled={isScanning}
            className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg disabled:opacity-50"
          >
            <Package size={18} />
            {isScanning ? 'Scanning Apps...' : 'Scan Installed Apps'}
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
                {Math.round(scanProgress)}% - Scanning applications...
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Popular Applications
            </p>
            {installedApps.map((app, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition flex items-center justify-between ${
                  isDark
                    ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                    : 'bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {app.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                      {app.size} • {app.leftover} leftover
                    </p>
                  </div>
                </div>
                <button className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  isDark
                    ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}>
                  <Trash2 size={12} className="inline mr-1" />
                  Uninstall
                </button>
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
                Apps Scanned: {results.appsScanned}
              </p>
              <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
                Cleanable Apps: {results.cleanableApps}
              </p>
              <p className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                Total Leftover: {results.totalLeftover}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className={`py-3 rounded-lg font-semibold transition ${
              isDark
                ? 'bg-white/[0.05] hover:bg-white/[0.08] text-neutral-300'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
            }`}>
              Review
            </button>
            <button className="py-3 rounded-lg font-semibold transition bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg">
              <Trash2 size={14} className="inline mr-1" />
              Clean Now
            </button>
          </div>

          <button
            onClick={() => setResults(null)}
            className={`w-full py-2 rounded-lg text-sm transition flex items-center justify-center gap-1 ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <RotateCcw size={12} />
            Scan Again
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default SmartUninstaller
