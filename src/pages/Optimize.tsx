import React, { useState } from 'react'
import { Zap, Trash2, Cpu, Wrench, CheckCircle2, Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { runOptimization } from '../lib/tauri'
import { useToast } from '../components/Toast'

interface Task {
  id: string
  label: string
  description: string
  icon: React.ElementType
  color: string
  running: boolean
  completed: boolean
}

export default function Optimize() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'clear_cache', label: 'Clear System Cache', description: 'Remove temporary and cached files', icon: Trash2, color: '#06b6d4', running: false, completed: false },
    { id: 'free_memory', label: 'Free Memory', description: 'Release unused RAM', icon: Cpu, color: '#8b5cf6', running: false, completed: false },
    { id: 'repair_permissions', label: 'Repair Permissions', description: 'Fix file system permissions', icon: Wrench, color: '#f59e0b', running: false, completed: false },
    { id: 'rebuild_spotlight', label: 'Rebuild Spotlight', description: 'Reindex search database', icon: Zap, color: '#10b981', running: false, completed: false },
  ])

  const toast = useToast()

  const runTask = async (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, running: true } : t))

    try {
      const result = await runOptimization(taskId)
      toast?.addToast(result, 'success')
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, running: false, completed: true } : t))
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: false } : t))
      }, 3000)
    } catch (e) {
      toast?.addToast('Optimization failed', 'error')
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, running: false } : t))
    }
  }

  return (
    <PageLayout title="One-Click Optimize" subtitle="Run optimization tasks to boost your system performance">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {tasks.map((task) => {
          const Icon = task.icon
          return (
            <div
              key={task.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '28px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: task.running ? 'wait' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!task.running) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--border-color)'
              }}
              onClick={() => !task.running && runTask(task.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${task.color}20 0%, ${task.color}10 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: task.color,
                  border: `1px solid ${task.color}25`,
                }}>
                  {task.completed ? <CheckCircle2 size={22} /> : task.running ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <Icon size={22} />}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>{task.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>{task.description}</div>
                </div>
              </div>

              {task.running && (
                <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', background: `linear-gradient(90deg, ${task.color}, ${task.color}88)`, borderRadius: '2px', animation: 'shimmer 1s infinite' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}
