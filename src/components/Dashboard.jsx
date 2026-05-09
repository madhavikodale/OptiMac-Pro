import { useState, useEffect } from 'react'
import SystemHealth from './SystemHealth'
import PerformanceMetrics from './PerformanceMetrics'
import ProcessList from './ProcessList'
import DeepCleaner from './DeepCleaner'
import StorageAnalyzer from './StorageAnalyzer'
import OperationLogs from './OperationLogs'
import SmartUninstaller from './SmartUninstaller'
import NetworkMonitor from './NetworkMonitor'
import MemoryOptimizer from './MemoryOptimizer'
import StartupManager from './StartupManager'
import DuplicateFileFinder from './DuplicateFileFinder'
import BatteryOptimizer from './BatteryOptimizer'
import MaintenanceScheduler from './MaintenanceScheduler'
import MemoryChart from './MemoryChart'
import { useSystemStats } from '../hooks/useSystemStats'

function Dashboard({ uiMode }) {
  const { stats, processes, loading, error } = useSystemStats(2000)

  const [displayStats, setDisplayStats] = useState({
    health: 92,
    cpu: 0,
    memory: 0,
    disk: 0,
    temperature: 0,
    uptime: '0d 0h 0m',
    networkUp: 0,
    networkDown: 0,
    batteryHealth: 0,
  })

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  useEffect(() => {
    if (!loading && stats) {
      const health = 100 - ((stats.cpu_usage + stats.memory_usage + stats.disk_usage) / 3)
      setDisplayStats({
        health: Math.max(0, Math.min(100, health)),
        cpu: Math.round(stats.cpu_usage),
        memory: Math.round(stats.memory_usage),
        disk: Math.round(stats.disk_usage),
        temperature: Math.round(stats.temperature),
        uptime: formatUptime(stats.uptime),
        networkUp: parseFloat(stats.network_up.toFixed(1)),
        networkDown: parseFloat(stats.network_down.toFixed(1)),
        batteryHealth: Math.round(stats.battery_health),
      })
    }
  }, [stats, loading])

  if (error) {
    return (
      <div className={`p-8 ${uiMode === 'premium' ? 'bg-dark-950' : 'bg-gray-50'}`}>
        <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
          <p className={uiMode === 'premium' ? 'text-red-400' : 'text-red-600'}>
            Error loading system data: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-8 transition-all duration-500 ${uiMode === 'premium' ? 'bg-dark-950' : 'bg-gray-50'}`}>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, User 👋
        </h1>
        <p className={`transition-colors ${uiMode === 'premium' ? 'text-cyan-400' : 'text-green-600'}`}>
          ● Your Mac is in {displayStats.health > 80 ? 'Good' : 'Fair'} Health
        </p>
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <SystemHealth health={displayStats.health} uiMode={uiMode} />
          </div>
          <div className="lg:col-span-2">
            <PerformanceMetrics systemData={displayStats} uiMode={uiMode} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-2xl transition ${
              uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                Real-time Activity
              </h3>
              <div className={`h-48 rounded-lg flex items-center justify-center ${
                uiMode === 'premium' ? 'bg-dark-800/50' : 'bg-gray-100'
              } text-gray-500`}>
                {loading ? '⏳ Loading...' : '📊 Activity Chart'}
              </div>
            </div>
          </div>

          <div>
            <div className={`p-6 rounded-2xl transition ${
              uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  '🧹 Clean Junk Files',
                  '💾 Free Up Memory',
                  '⚙️ Optimize Storage',
                  '🔍 Run Diagnostics'
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      uiMode === 'premium'
                        ? 'bg-purple-500/10 hover:bg-purple-500/20 text-cyan-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Processes */}
      <div className="mb-8">
        <ProcessList uiMode={uiMode} processes={processes} />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <MemoryChart uiMode={uiMode} memory={displayStats.memory} />
      </div>

      {/* Premium Features - 5 Top Features */}
      <div className="space-y-6">
        {/* 1. Advanced Memory Optimizer */}
        <MemoryOptimizer uiMode={uiMode} memory={displayStats.memory} />

        {/* 2. Startup Manager */}
        <StartupManager uiMode={uiMode} />

        {/* 3. Duplicate File Finder */}
        <DuplicateFileFinder uiMode={uiMode} />

        {/* 4. Battery Optimizer */}
        <BatteryOptimizer uiMode={uiMode} battery={displayStats.batteryHealth} />

        {/* 5. System Maintenance Scheduler */}
        <MaintenanceScheduler uiMode={uiMode} />

        {/* Additional Features */}
        <NetworkMonitor 
          uiMode={uiMode} 
          networkUp={displayStats.networkUp}
          networkDown={displayStats.networkDown}
        />

        <DeepCleaner uiMode={uiMode} />

        <SmartUninstaller uiMode={uiMode} />

        <StorageAnalyzer uiMode={uiMode} diskTotal={stats.disk_total} diskUsed={stats.disk_used} />

        <OperationLogs uiMode={uiMode} />
      </div>
    </div>
  )
}

export default Dashboard
