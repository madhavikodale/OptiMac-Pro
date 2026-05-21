import { useState, useEffect } from 'react'

interface SystemData {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkUsage: number
  batteryLevel: number
  temperature: number
  uptime: string
}

export const useSystemData = () => {
  const [systemData, setSystemData] = useState<SystemData>({
    cpuUsage: 23,
    memoryUsage: 68,
    diskUsage: 42,
    networkUsage: 8.4,
    batteryLevel: 87,
    temperature: 52,
    uptime: '5d 14h 32m',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate real-time system data updates
    const interval = setInterval(() => {
      setSystemData((prev) => ({
        cpuUsage: Math.max(5, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(5, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        diskUsage: Math.max(5, Math.min(95, prev.diskUsage + (Math.random() - 0.5) * 3)),
        networkUsage: Math.max(0.5, Math.min(100, prev.networkUsage + (Math.random() - 0.5) * 2)),
        batteryLevel: Math.max(0, prev.batteryLevel - 0.01),
        temperature: Math.max(40, Math.min(85, prev.temperature + (Math.random() - 0.5) * 2)),
        uptime: prev.uptime,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return {
    systemData,
    isLoading,
    error,
  }
}

export default useSystemData
