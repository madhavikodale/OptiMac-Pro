import React, { useState } from 'react'
import { HardDrive, TrendingUp, AlertCircle } from 'lucide-react'

interface DiskPartition {
  id: string
  name: string
  used: number
  total: number
  type: string
}

const mockPartitions: DiskPartition[] = [
  { id: '1', name: 'Macintosh SSD', used: 420, total: 1000, type: 'Primary' },
  { id: '2', name: 'External Drive', used: 780, total: 2000, type: 'External' },
]

interface LargeFolder {
  id: string
  name: string
  size: number
  itemCount: number
  path: string
}

const mockLargeFolders: LargeFolder[] = [
  { id: '1', name: 'Applications', size: 89, itemCount: 234, path: '/Applications' },
  { id: '2', name: 'Movies', size: 156, itemCount: 45, path: '~/Movies' },
  { id: '3', name: 'Downloads', size: 34, itemCount: 890, path: '~/Downloads' },
  { id: '4', name: 'Photos Library', size: 267, itemCount: 12340, path: '~/Pictures' },
  { id: '5', name: 'Developer Files', size: 78, itemCount: 5670, path: '~/Developer' },
]

export const DiskOptimizer: React.FC = () => {
  const [selectedPartition, setSelectedPartition] = useState('1')

  const selectedDisk = mockPartitions.find((p) => p.id === selectedPartition)
  const usagePercent = selectedDisk ? (selectedDisk.used / selectedDisk.total) * 100 : 0

  const getStatusColor = (percent: number) => {
    if (percent > 90) return 'text-red-400'
    if (percent > 70) return 'text-orange-400'
    return 'text-green-400'
  }

  const getProgressColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500'
    if (percent > 70) return 'bg-orange-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-full p-6 md:p-8 bg-neutral-950">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-50 mb-2 flex items-center gap-3">
          <HardDrive className="text-cyan-400" size={32} />
          Disk Optimizer
        </h1>
        <p className="text-neutral-400">Analyze and optimize your disk storage</p>
      </div>

      {/* PARTITION TABS */}
      <div className="mb-8 flex gap-2">
        {mockPartitions.map((partition) => (
          <button
            key={partition.id}
            onClick={() => setSelectedPartition(partition.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedPartition === partition.id
                ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-400'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {partition.name}
          </button>
        ))}
      </div>

      {selectedDisk && (
        <>
          {/* DISK USAGE VISUALIZATION */}
          <div className="glass rounded-2xl p-8 border border-white/10 mb-8">
            <div className="mb-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Disk Usage</p>
                  <p className="text-4xl font-bold text-white">
                    {selectedDisk.used} GB / {selectedDisk.total} GB
                  </p>
                </div>
                <p className={`text-3xl font-bold ${getStatusColor(usagePercent)}`}>
                  {usagePercent.toFixed(1)}%
                </p>
              </div>

              {/* PROGRESS BAR */}
              <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(usagePercent)}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>

              <p className="text-sm text-white/50 mt-3">
                {selectedDisk.total - selectedDisk.used} GB available
              </p>
            </div>

            {usagePercent > 80 && (
              <div className="flex gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-400 font-semibold text-sm mb-1">Storage Warning</p>
                  <p className="text-xs text-white/70">
                    Your disk is {usagePercent.toFixed(0)}% full. Consider cleaning up unnecessary files.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* STORAGE BREAKDOWN */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Storage Breakdown</h2>
            <div className="space-y-3">
              {[
                { label: 'Applications', size: 89, color: 'bg-blue-500' },
                { label: 'Media', size: 267, color: 'bg-purple-500' },
                { label: 'Documents', size: 34, color: 'bg-cyan-500' },
                { label: 'System', size: 30, color: 'bg-orange-500' },
              ].map((item) => (
                <div key={item.label} className="glass rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-white/60 text-sm">{item.size} GB</p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.size / selectedDisk.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LARGEST FOLDERS */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-cyan-400" />
              Largest Folders
            </h2>
            <div className="space-y-3">
              {mockLargeFolders.map((folder) => (
                <div key={folder.id} className="glass rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{folder.name}</h3>
                    <p className="text-cyan-400 font-semibold">{folder.size} GB</p>
                  </div>
                  <p className="text-xs text-white/50">{folder.itemCount.toLocaleString()} items • {folder.path}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DiskOptimizer
