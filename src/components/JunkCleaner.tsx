import React, { useState } from 'react'
import { Trash2, Search, Loader, CheckCircle } from 'lucide-react'

interface JunkFile {
  id: string
  name: string
  size: number
  category: 'cache' | 'logs' | 'temporary' | 'duplicates'
  path: string
  selected: boolean
}

const mockJunkFiles: JunkFile[] = [
  { id: '1', name: 'Chrome Cache', size: 1024, category: 'cache', path: '~/Library/Caches/Google/Chrome', selected: true },
  { id: '2', name: 'Safari Cache', size: 512, category: 'cache', path: '~/Library/Caches/Safari', selected: true },
  { id: '3', name: 'System Logs', size: 256, category: 'logs', path: '/var/log/', selected: false },
  { id: '4', name: 'Temp Files', size: 789, category: 'temporary', path: '/var/tmp/', selected: true },
  { id: '5', name: 'Duplicate Photos', size: 2048, category: 'duplicates', path: '~/Pictures/', selected: true },
  { id: '6', name: 'Old Downloads', size: 1536, category: 'temporary', path: '~/Downloads/', selected: false },
  { id: '7', name: 'Xcode Derived Data', size: 4096, category: 'cache', path: '~/Library/Developer/', selected: true },
  { id: '8', name: 'Language Packs', size: 512, category: 'cache', path: '/Library/Language/', selected: false },
]

export const JunkCleaner: React.FC = () => {
  const [files, setFiles] = useState<JunkFile[]>(mockJunkFiles)
  const [isCleaning, setIsCleaning] = useState(false)
  const [cleanedSize, setCleanedSize] = useState(0)

  const handleToggleFile = (id: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    )
  }

  const handleSelectAll = () => {
    setFiles((prev) => prev.map((file) => ({ ...file, selected: true })))
  }

  const handleDeselectAll = () => {
    setFiles((prev) => prev.map((file) => ({ ...file, selected: false })))
  }

  const handleClean = () => {
    setIsCleaning(true)
    const selectedSize = files.filter((f) => f.selected).reduce((sum, f) => sum + f.size, 0)
    
    setTimeout(() => {
      setCleanedSize(selectedSize)
      setFiles((prev) => prev.filter((file) => !file.selected))
      setIsCleaning(false)
    }, 2000)
  }

  const selectedSize = files.filter((f) => f.selected).reduce((sum, f) => sum + f.size, 0)
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cache':
        return 'bg-blue-500/20 text-blue-400'
      case 'logs':
        return 'bg-purple-500/20 text-purple-400'
      case 'temporary':
        return 'bg-orange-500/20 text-orange-400'
      case 'duplicates':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-full p-6 md:p-8 bg-neutral-950">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-50 mb-2 flex items-center gap-3">
          <Trash2 className="text-cyan-400" size={32} />
          Junk Cleaner
        </h1>
        <p className="text-neutral-400">Find and remove unnecessary files to free up disk space</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Total Junk Found</p>
          <p className="text-2xl font-bold text-cyan-400">{(totalSize / 1024).toFixed(1)} GB</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Selected to Clean</p>
          <p className="text-2xl font-bold text-orange-400">{(selectedSize / 1024).toFixed(1)} GB</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Files Found</p>
          <p className="text-2xl font-bold text-purple-400">{files.length}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Total Cleaned</p>
          <p className="text-2xl font-bold text-green-400">{(cleanedSize / 1024).toFixed(1)} GB</p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm font-medium"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors text-sm font-medium"
        >
          Deselect All
        </button>
        <button
          onClick={handleClean}
          disabled={selectedSize === 0 || isCleaning}
          className="ml-auto px-6 py-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:opacity-50 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
        >
          {isCleaning ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
          {isCleaning ? 'Cleaning...' : 'Clean Selected'}
        </button>
      </div>

      {/* FILES LIST */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="glass rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={file.selected}
                onChange={() => handleToggleFile(file.id)}
                className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold">{file.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(file.category)}`}>
                    {file.category.charAt(0).toUpperCase() + file.category.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-white/50">{file.path}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-cyan-400">{(file.size / 1024).toFixed(1)} GB</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
          <p className="text-white font-semibold mb-2">System is clean!</p>
          <p className="text-white/50">No junk files found. Your system is optimized.</p>
        </div>
      )}
    </div>
  )
}

export default JunkCleaner
