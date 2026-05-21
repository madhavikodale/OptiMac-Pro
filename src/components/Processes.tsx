import React, { useState, useEffect } from 'react'
import { Layers, Search, X, Info } from 'lucide-react'

interface Process {
  id: string
  name: string
  pid: number
  cpu: number
  memory: number
  gpu: number
}

const mockProcesses: Process[] = [
  { id: '1', name: 'Google Chrome', pid: 1234, cpu: 23.4, memory: 1856, gpu: 12.3 },
  { id: '2', name: 'Visual Studio Code', pid: 5678, cpu: 8.2, memory: 892, gpu: 5.1 },
  { id: '3', name: 'Finder', pid: 9012, cpu: 2.1, memory: 234, gpu: 0.8 },
  { id: '4', name: 'Xcode', pid: 3456, cpu: 15.6, memory: 2341, gpu: 8.9 },
  { id: '5', name: 'Docker', pid: 7890, cpu: 5.3, memory: 456, gpu: 1.2 },
  { id: '6', name: 'Safari', pid: 2345, cpu: 12.7, memory: 678, gpu: 9.4 },
  { id: '7', name: 'Spotify', pid: 6789, cpu: 1.2, memory: 123, gpu: 0.3 },
  { id: '8', name: 'Slack', pid: 123, cpu: 3.4, memory: 345, gpu: 1.1 },
]

export const Processes: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>(mockProcesses)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'cpu' | 'memory' | 'gpu'>('cpu')

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(100, Math.min(5000, p.memory + (Math.random() - 0.5) * 50)),
          gpu: Math.max(0, Math.min(100, p.gpu + (Math.random() - 0.5) * 3)),
        }))
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const filteredProcesses = processes
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'cpu') return b.cpu - a.cpu
      if (sortBy === 'memory') return b.memory - a.memory
      return b.gpu - a.gpu
    })

  const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0)
  const totalMemory = processes.reduce((sum, p) => sum + p.memory, 0)

  return (
    <div className="min-h-full p-6 md:p-8 bg-neutral-950">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-50 mb-2 flex items-center gap-3">
          <Layers className="text-cyan-400" size={32} />
          Processes
        </h1>
        <p className="text-neutral-400">Monitor and manage running applications</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Total CPU Usage</p>
          <p className="text-2xl font-bold text-cyan-400">{totalCpu.toFixed(1)}%</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Total Memory</p>
          <p className="text-2xl font-bold text-purple-400">{(totalMemory / 1024).toFixed(1)} GB</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Running Processes</p>
          <p className="text-2xl font-bold text-blue-400">{processes.length}</p>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search processes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'cpu' | 'memory' | 'gpu')}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 transition-all"
        >
          <option value="cpu">Sort by CPU</option>
          <option value="memory">Sort by Memory</option>
          <option value="gpu">Sort by GPU</option>
        </select>
      </div>

      {/* PROCESSES TABLE */}
      <div className="glass rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  PID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  CPU
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Memory
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                  GPU
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{process.name}</td>
                  <td className="px-6 py-4 text-sm text-white/60">{process.pid}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-cyan-400 font-semibold">{process.cpu.toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-purple-400 font-semibold">{(process.memory / 1024).toFixed(1)} MB</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-blue-400 font-semibold">{process.gpu.toFixed(1)}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-white/60 hover:text-red-400">
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Processes
