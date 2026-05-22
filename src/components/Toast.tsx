import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'loading'

interface ToastProps {
  id: string
  message: string
  type: ToastType
  duration?: number
  onClose: (id: string) => void
}

export default function Toast({ id, message, type, duration = 4000, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (type === 'loading' || duration === Infinity) return
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        handleClose()
      }
    }, 50)
    return () => clearInterval(interval)
  }, [duration, type])

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => onClose(id), 300)
  }

  const icons = {
    success: <CheckCircle size={18} style={{ color: '#4ade80' }} />,
    error: <AlertTriangle size={18} style={{ color: '#ef4444' }} />,
    info: <Info size={18} style={{ color: '#06b6d4' }} />,
    loading: <Loader2 size={18} style={{ color: '#06b6d4', animation: 'spin 1s linear infinite' }} />,
  }

  const colors = {
    success: 'rgba(74, 222, 128, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(6, 182, 212, 0.1)',
    loading: 'rgba(6, 182, 212, 0.1)',
  }

  const borderColors = {
    success: 'rgba(74, 222, 128, 0.2)',
    error: 'rgba(239, 68, 68, 0.2)',
    info: 'rgba(6, 182, 212, 0.2)',
    loading: 'rgba(6, 182, 212, 0.2)',
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        background: colors[type],
        border: `1px solid ${borderColors[type]}`,
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: '320px',
        maxWidth: '420px',
        transform: exiting ? 'translateX(120%)' : 'translateX(0)',
        opacity: exiting ? 0 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {icons[type]}
      <span style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
        {message}
      </span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
        }}
      >
        <X size={14} />
      </button>
      {type !== 'loading' && duration !== Infinity && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            width: `${progress}%`,
            background: borderColors[type],
            transition: 'width 0.05s linear',
          }}
        />
      )}
    </div>
  )
}

// Toast container and hook
import { createContext, useContext, useCallback } from 'react'

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
