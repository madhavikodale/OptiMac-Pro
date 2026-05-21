import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Battery,
  Thermometer,
  Activity,
} from 'lucide-react'
import { useSystemData } from '../hooks/useSystemData'
import { useTheme } from '../contexts/ThemeContext'
import { SystemHealthRing } from './SystemHealthRing'
import { StatCard } from './StatCard'
import { NetworkActivityChart } from './NetworkActivityChart'
import { TopProcessesTable } from './TopProcessesTable'
import { QuickActionsPanel } from './QuickActionsPanel'
import { AnomaliesSuggestionsPanel } from './AnomaliesSuggestionsPanel'
import { SmartUninstaller } from './SmartUninstaller'
import { DuplicateFileFinder } from './DuplicateFileFinder'
import { BatteryOptimizer } from './BatteryOptimizer'
import { NetworkMonitor } from './NetworkMonitor'

const HISTORY_LEN = 12

type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical'
type MetricStatus = 'idle' | 'active' | 'warning' | 'critical'

function pushHistory(prev: number[], value: number): number[] {
  return [...prev.slice(1), Math.round(value * 10) / 10]
}

function metricStatus(value: number): MetricStatus {
  if (value >= 85) return 'critical'
  if (value >= 70) return 'warning'
  if (value >= 45) return 'active'
  return 'idle'
}

function healthFromMetrics(cpu: number, memory: number, disk: number): {
  score: number
  status: HealthStatus
} {
  const load = cpu * 0.4 + memory * 0.35 + disk * 0.25
  const score = Math.max(0, Math.min(100, Math.round(100 - load * 0.65)))
  let status: HealthStatus = 'excellent'
  if (score < 50) status = 'critical'
  else if (score < 70) status = 'warning'
  else if (score < 85) status = 'good'
  return { score, status }
}

function formatNow(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const Dashboard: React.FC = () => {
  const { systemData } = useSystemData()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [cpuHistory, setCpuHistory] = useState<number[]>(() => Array(HISTORY_LEN).fill(23))
  const [memHistory, setMemHistory] = useState<number[]>(() => Array(HISTORY_LEN).fill(68))
  const [diskHistory, setDiskHistory] = useState<number[]>(() => Array(HISTORY_LEN).fill(42))
  const [netHistory, setNetHistory] = useState<number[]>(() => Array(HISTORY_LEN).fill(8))
  const [chartHistory, setChartHistory] = useState<
    { timestamp: string; cpu: number; memory: number; disk: number; network: number }[]
  >(() =>
    Array.from({ length: 7 }, (_, i) => ({
      timestamp: `:${10 + i}`,
      cpu: 20 + i * 3,
      memory: 60 + i,
      disk: 40,
      network: 8,
    }))
  )

  useEffect(() => {
    setCpuHistory((h) => pushHistory(h, systemData.cpuUsage))
    setMemHistory((h) => pushHistory(h, systemData.memoryUsage))
    setDiskHistory((h) => pushHistory(h, systemData.diskUsage))
    setNetHistory((h) => pushHistory(h, systemData.networkUsage))
    setChartHistory((prev) => {
      const next = [
        ...prev.slice(1),
        {
          timestamp: formatNow(),
          cpu: Math.round(systemData.cpuUsage),
          memory: Math.round(systemData.memoryUsage),
          disk: Math.round(systemData.diskUsage),
          network: Math.round(systemData.networkUsage),
        },
      ]
      return next
    })
  }, [systemData])

  const { score: healthScore, status: healthStatus } = useMemo(
    () =>
      healthFromMetrics(
        systemData.cpuUsage,
        systemData.memoryUsage,
        systemData.diskUsage
      ),
    [systemData.cpuUsage, systemData.memoryUsage, systemData.diskUsage]
  )

  const anomalies = useMemo(() => {
    const items = []
    if (systemData.memoryUsage > 80) {
      items.push({
        id: 'mem-high',
        title: 'High memory pressure',
        description: `RAM usage is at ${systemData.memoryUsage.toFixed(0)}%. Consider closing heavy apps.`,
        severity: 'high' as const,
      })
    }
    if (systemData.cpuUsage > 75) {
      items.push({
        id: 'cpu-spike',
        title: 'CPU spike detected',
        description: `Processor load reached ${systemData.cpuUsage.toFixed(0)}%.`,
        severity: 'medium' as const,
      })
    }
    if (systemData.temperature > 70) {
      items.push({
        id: 'temp-warn',
        title: 'Elevated temperature',
        description: `System temperature is ${systemData.temperature.toFixed(0)}°C.`,
        severity: 'medium' as const,
      })
    }
    if (items.length === 0) {
      items.push({
        id: 'all-clear',
        title: 'No anomalies detected',
        description: 'Your Mac is running smoothly.',
        severity: 'low' as const,
      })
    }
    return items
  }, [systemData])

  const suggestions = useMemo(() => {
    const items = []
    if (systemData.diskUsage > 75) {
      items.push({
        id: 'disk-clean',
        title: 'Free up disk space',
        description: 'Storage is getting full. Run Disk Optimizer to reclaim space.',
        category: 'Storage',
        actionLabel: 'Optimize',
      })
    }
    if (systemData.memoryUsage > 70) {
      items.push({
        id: 'mem-free',
        title: 'Free unused memory',
        description: 'One-click memory optimization can improve responsiveness.',
        category: 'Performance',
        actionLabel: 'Free RAM',
      })
    }
    items.push({
      id: 'ai-scan',
      title: 'Run AI system scan',
      description: 'Get personalized recommendations from AI Intelligence.',
      category: 'AI',
      actionLabel: 'Open AI',
    })
    return items
  }, [systemData])

  const processes = useMemo(
    () => [
      {
        id: '1',
        name: 'Google Chrome',
        icon: '🌐',
        usage: Math.min(99, systemData.cpuUsage + 12),
        memory: `${(1.2 + systemData.memoryUsage / 100).toFixed(1)} GB`,
        cpu: Math.round(systemData.cpuUsage * 0.6),
      },
      {
        id: '2',
        name: 'WindowServer',
        icon: '🖥️',
        usage: Math.round(systemData.cpuUsage * 0.35),
        memory: '890 MB',
        cpu: Math.round(systemData.cpuUsage * 0.25),
      },
      {
        id: '3',
        name: 'Code',
        icon: '💻',
        usage: Math.round(systemData.cpuUsage * 0.2),
        memory: '512 MB',
        cpu: 8,
      },
      {
        id: '4',
        name: 'Spotify',
        icon: '🎵',
        usage: 6,
        memory: '378 MB',
        cpu: 2,
      },
    ],
    [systemData.cpuUsage, systemData.memoryUsage]
  )

  const handleApplySuggestion = useCallback(
    (id: string) => {
      if (id === 'disk-clean') navigate('/disk')
      else if (id === 'mem-free') navigate('/optimize')
      else if (id === 'ai-scan') navigate('/ai')
    },
    [navigate]
  )

  return (
    <div
      className={`relative min-h-full overflow-auto transition-colors duration-300 ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #00d9ff 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-6 p-6 md:p-8">
        {/* Page header */}
        <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-widest ${
                isDark ? 'text-cyan-400/80' : 'text-cyan-600'
              }`}
            >
              Overview
            </p>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              System Dashboard
            </h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Live metrics · Uptime {systemData.uptime}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              isDark
                ? 'bg-neutral-900/80 border border-neutral-800 text-neutral-300'
                : 'bg-white border border-neutral-200 text-neutral-600 shadow-sm'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live monitoring
          </div>
        </header>

        {/* Row 1: Health + stat cards */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <SystemHealthRing
              healthScore={healthScore}
              status={healthStatus}
              systemInfo={
                healthStatus === 'excellent'
                  ? 'Your system is well optimized'
                  : 'Some metrics need attention'
              }
              lastOptimized="Just now"
              onOptimizeClick={() => navigate('/optimize')}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-8">
            <StatCard
              icon={<Cpu size={20} />}
              title="CPU"
              subtitle="Apple Silicon"
              value={systemData.cpuUsage.toFixed(1)}
              unit="%"
              percentage={Math.round(systemData.cpuUsage)}
              sparkline={cpuHistory}
              status={metricStatus(systemData.cpuUsage)}
              onClick={() => navigate('/performance')}
            />
            <StatCard
              icon={<MemoryStick size={20} />}
              title="Memory"
              subtitle="Unified memory"
              value={systemData.memoryUsage.toFixed(1)}
              unit="%"
              percentage={Math.round(systemData.memoryUsage)}
              sparkline={memHistory}
              status={metricStatus(systemData.memoryUsage)}
              onClick={() => navigate('/performance')}
            />
            <StatCard
              icon={<HardDrive size={20} />}
              title="Disk"
              subtitle="Macintosh HD"
              value={systemData.diskUsage.toFixed(1)}
              unit="%"
              percentage={Math.round(systemData.diskUsage)}
              sparkline={diskHistory}
              status={metricStatus(systemData.diskUsage)}
              onClick={() => navigate('/disk')}
            />
            <StatCard
              icon={<Wifi size={20} />}
              title="Network"
              subtitle="Activity index"
              value={systemData.networkUsage.toFixed(1)}
              unit="Mb/s"
              percentage={Math.round(systemData.networkUsage)}
              sparkline={netHistory}
              status={metricStatus(systemData.networkUsage)}
            />
            <StatCard
              icon={<Battery size={20} />}
              title="Battery"
              subtitle="Power status"
              value={Math.round(systemData.batteryLevel)}
              unit="%"
              percentage={Math.round(systemData.batteryLevel)}
              sparkline={netHistory}
              status={systemData.batteryLevel < 20 ? 'warning' : 'idle'}
            />
            <StatCard
              icon={<Thermometer size={20} />}
              title="Temperature"
              subtitle="Thermal state"
              value={systemData.temperature.toFixed(0)}
              unit="°C"
              percentage={Math.round((systemData.temperature / 85) * 100)}
              sparkline={cpuHistory}
              status={metricStatus(systemData.temperature)}
            />
          </div>
        </div>

        {/* Row 2: Activity chart */}
        <NetworkActivityChart
          title="Real-time Activity"
          height={280}
          data={chartHistory}
        />

        {/* Row 3: Processes + quick actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TopProcessesTable
              title="Top Processes"
              processes={processes}
              onViewAll={() => navigate('/processes')}
            />
          </div>
          <QuickActionsPanel
            title="Quick Actions"
            actions={[
              {
                id: 'optimize',
                icon: <Activity size={20} />,
                label: 'One-Click Optimize',
                description: 'Boost performance instantly',
                color: 'purple',
                badge: 'BOOST',
                onClick: () => navigate('/optimize'),
              },
              {
                id: 'clean',
                icon: <HardDrive size={20} />,
                label: 'Clean Junk',
                description: 'Remove cache & temp files',
                color: 'cyan',
                onClick: () => navigate('/cleaner'),
              },
              {
                id: 'processes',
                icon: <Cpu size={20} />,
                label: 'Manage Processes',
                description: 'View resource hogs',
                color: 'orange',
                onClick: () => navigate('/processes'),
              },
              {
                id: 'ai',
                icon: <Activity size={20} />,
                label: 'AI Insights',
                description: 'Smart recommendations',
                color: 'green',
                onClick: () => navigate('/ai'),
              },
            ]}
          />
        </div>

        {/* Row 4: Anomalies + suggestions */}
        <AnomaliesSuggestionsPanel
          anomalies={anomalies}
          suggestions={suggestions}
          onApplySuggestion={handleApplySuggestion}
        />

        {/* Row 5: Advanced Modules Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SmartUninstaller />
          <DuplicateFileFinder />
          <BatteryOptimizer />
          <NetworkMonitor />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
