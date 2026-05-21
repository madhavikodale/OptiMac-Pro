import React, { useState } from 'react'
import { Zap, Play, CheckCircle, AlertCircle, Loader } from 'lucide-react'

type OptimizationStatus = 'pending' | 'running' | 'completed' | 'error'

interface OptimizationTask {
  id: string
  name: string
  description: string
  status: OptimizationStatus
  progress: number
  items_found: number
  space_freed: number
}

export const OneClickOptimize: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Cache Cleanup',
      description: 'Remove temporary cache files',
      status: 'pending',
      progress: 0,
      items_found: 0,
      space_freed: 0,
    },
    {
      id: '2',
      name: 'Duplicate File Removal',
      description: 'Find and remove duplicate files',
      status: 'pending',
      progress: 0,
      items_found: 0,
      space_freed: 0,
    },
    {
      id: '3',
      name: 'Large Old Files',
      description: 'Identify large files not accessed recently',
      status: 'pending',
      progress: 0,
      items_found: 0,
      space_freed: 0,
    },
    {
      id: '4',
      name: 'Broken Preferences',
      description: 'Fix corrupted application preferences',
      status: 'pending',
      progress: 0,
      items_found: 0,
      space_freed: 0,
    },
    {
      id: '5',
      name: 'Language Files',
      description: 'Remove unused language packs',
      status: 'pending',
      progress: 0,
      items_found: 0,
      space_freed: 0,
    },
  ])

  const handleStartOptimization = () => {
    setIsRunning(true)

    tasks.forEach((task, index) => {
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: 'running' as OptimizationStatus } : t
          )
        )

        const progressInterval = setInterval(() => {
          setTasks((prev) => {
            const updated = prev.map((t) => {
              if (t.id === task.id && t.status === 'running') {
                const newProgress = Math.min(100, t.progress + Math.random() * 25)
                if (newProgress >= 100) {
                  clearInterval(progressInterval)
                  return {
                    ...t,
                    progress: 100,
                    status: 'completed' as OptimizationStatus,
                    items_found: Math.floor(Math.random() * 500) + 50,
                    space_freed: Math.floor(Math.random() * 5000) + 500,
                  }
                }
                return { ...t, progress: newProgress }
              }
              return t
            })
            return updated
          })
        }, 300)
      }, index * 2000)
    })
  }

  const totalItemsFound = tasks.reduce((sum, t) => sum + t.items_found, 0)
  const totalSpaceFreed = tasks.reduce((sum, t) => sum + t.space_freed, 0)
  const completedTasks = tasks.filter((t) => t.status === 'completed').length

  const getStatusIcon = (status: OptimizationStatus) => {
    if (status === 'completed') return <CheckCircle size={18} className="text-green-400" />
    if (status === 'running') return <Loader size={18} className="text-cyan-400 animate-spin" />
    if (status === 'error') return <AlertCircle size={18} className="text-red-400" />
    return <div className="w-4.5 h-4.5 rounded-full border-2 border-white/20" />
  }

  return (
    <div className="min-h-full p-6 md:p-8 bg-neutral-950">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-50 mb-2 flex items-center gap-3">
          <Zap className="text-cyan-400" size={32} />
          One Click Optimize
        </h1>
        <p className="text-neutral-400">Comprehensive system optimization with a single click</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Items Found</p>
          <p className="text-3xl font-bold text-cyan-400">{totalItemsFound}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Space Freed</p>
          <p className="text-3xl font-bold text-green-400">{(totalSpaceFreed / 1024).toFixed(1)} GB</p>
        </div>
        <div className="glass rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-1">Completed Tasks</p>
          <p className="text-3xl font-bold text-purple-400">{completedTasks}/{tasks.length}</p>
        </div>
      </div>

      {!isRunning && (
        <button
          onClick={handleStartOptimization}
          className="w-full mb-8 py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-600/30"
        >
          <Play size={20} />
          Start Optimization
        </button>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="mt-1">{getStatusIcon(task.status)}</div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{task.name}</h3>
                <p className="text-sm text-white/50">{task.description}</p>
              </div>
            </div>

            {task.status !== 'pending' && (
              <div className="mb-3">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}

            {task.status === 'completed' && (
              <div className="text-sm text-green-400">
                Found {task.items_found} items • Freed {(task.space_freed / 1024).toFixed(1)} GB
              </div>
            )}
            {task.status === 'running' && (
              <div className="text-sm text-cyan-400">Progress: {task.progress.toFixed(0)}%</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OneClickOptimize
