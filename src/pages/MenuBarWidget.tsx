import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Cpu, MemoryStick, Wifi, Battery, BatteryCharging,
  Activity, ArrowUp, ArrowDown, Zap, RefreshCw
} from 'lucide-react'
import { getMenuBarStats, MenuBarStats } from '../lib/tauri'

function formatMbps(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} Gbps`
  if (v >= 1) return `${v.toFixed(1)} Mbps`
  return `${(v * 1000).toFixed(0)} Kbps`
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-xl p-4 flex items-center gap-4"
    >
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-semibold text-white truncate">{value}</p>
        {sub && <p className="text-xs text-white/40">{sub}</p>}
      </div>
    </motion.div>
  )
}

function ProgressBar({
  value,
  color,
}: {
  value: number
  color: string
}) {
  const pct = Math.min(Math.max(value, 0), 100)
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  )
}

export default function MenuBarWidget() {
  const [stats, setStats] = useState<MenuBarStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMenuBarStats()
      setStats(data)
      setLastUpdate(new Date())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 3000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            Menu Bar HUD
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Live system stats — updates every 3 seconds
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="glass px-4 py-2 rounded-lg text-sm text-white/80 hover:text-white flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {stats && (
        <div className="space-y-6">
          {/* Primary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Cpu}
              label="CPU Usage"
              value={`${stats.cpu_percent.toFixed(1)}%`}
              sub={stats.top_process !== 'None' ? `Top: ${stats.top_process}` : undefined}
              color="bg-rose-500"
              delay={0}
            />
            <StatCard
              icon={MemoryStick}
              label="Memory"
              value={`${stats.memory_percent.toFixed(1)}%`}
              sub={`${stats.memory_used_gb.toFixed(1)} / ${stats.memory_total_gb.toFixed(1)} GB`}
              color="bg-amber-500"
              delay={0.05}
            />
            <StatCard
              icon={stats.is_charging ? BatteryCharging : Battery}
              label="Battery"
              value={`${stats.battery_percent.toFixed(0)}%`}
              sub={stats.is_charging ? 'Charging' : 'On Battery'}
              color={stats.is_charging ? 'bg-emerald-500' : 'bg-blue-500'}
              delay={0.1}
            />
            <StatCard
              icon={Wifi}
              label="Network"
              value={`↓ ${formatMbps(stats.network_down_mbps)}`}
              sub={`↑ ${formatMbps(stats.network_up_mbps)}`}
              color="bg-violet-500"
              delay={0.15}
            />
          </div>

          {/* Progress Bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <h3 className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Resource Pressure
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>CPU</span>
                  <span>{stats.cpu_percent.toFixed(1)}%</span>
                </div>
                <ProgressBar
                  value={stats.cpu_percent}
                  color={
                    stats.cpu_percent > 80
                      ? 'bg-rose-500'
                      : stats.cpu_percent > 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Memory</span>
                  <span>{stats.memory_percent.toFixed(1)}%</span>
                </div>
                <ProgressBar
                  value={stats.memory_percent}
                  color={
                    stats.memory_percent > 85
                      ? 'bg-rose-500'
                      : stats.memory_percent > 60
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Battery</span>
                  <span>{stats.battery_percent.toFixed(0)}%</span>
                </div>
                <ProgressBar
                  value={stats.battery_percent}
                  color={
                    stats.battery_percent < 20
                      ? 'bg-rose-500'
                      : stats.battery_percent < 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Top Process */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Top Process
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Cpu className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <p className="text-white font-medium">{stats.top_process}</p>
                  <p className="text-xs text-white/40">Highest CPU consumer</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">
                  {stats.top_process_cpu.toFixed(1)}%
                </p>
                <p className="text-xs text-white/40">CPU</p>
              </div>
            </div>
          </motion.div>

          {/* Network Detail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-violet-400" />
              Network Throughput
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                <ArrowDown className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-white/40">Download</p>
                  <p className="text-lg font-semibold text-white">
                    {formatMbps(stats.network_down_mbps)}
                  </p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                <ArrowUp className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-white/40">Upload</p>
                  <p className="text-lg font-semibold text-white">
                    {formatMbps(stats.network_up_mbps)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {lastUpdate && (
        <p className="text-xs text-white/30 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
