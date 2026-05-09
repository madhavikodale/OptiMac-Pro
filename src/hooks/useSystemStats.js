import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

export function useSystemStats(refreshInterval = 2000) {
  const [stats, setStats] = useState({
    cpu_usage: 0,
    memory_usage: 0,
    memory_total: 0,
    memory_used: 0,
    disk_usage: 0,
    disk_total: 0,
    disk_used: 0,
    temperature: 0,
    uptime: 0,
    battery_health: 0,
    network_up: 0,
    network_down: 0,
  })

  const [processes, setProcesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const systemStats = await invoke('get_system_stats')
        const topProcesses = await invoke('get_top_processes', { limit: 5 })
        
        setStats(systemStats)
        setProcesses(topProcesses)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    // Initial fetch
    fetchData()

    // Set up interval
    const interval = setInterval(fetchData, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return { stats, processes, loading, error }
}
