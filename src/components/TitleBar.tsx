import React, { useEffect, useState } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const win = getCurrentWindow()
    win.isMaximized().then(setIsMaximized)
    const unlisten = win.onResized(() => {
      win.isMaximized().then(setIsMaximized)
    })
    return () => { unlisten.then(f => f()) }
  }, [])

  const minimize = () => getCurrentWindow().minimize()
  const maximize = () => {
    const win = getCurrentWindow()
    if (isMaximized) win.unmaximize()
    else win.maximize()
  }
  const close = () => getCurrentWindow().close()

  return (
    <div
      data-tauri-drag-region
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '38px',
        padding: '0 16px',
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Traffic Lights */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={close}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ff5f57',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          title="Close"
        />
        <button
          onClick={minimize}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#febc2e',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          title="Minimize"
        />
        <button
          onClick={maximize}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#28c840',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          title="Maximize"
        />
      </div>

      {/* App Title */}
      <div
        data-tauri-drag-region
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          letterSpacing: '0.3px',
          pointerEvents: 'none',
        }}
      >
        OptiMac Pro
      </div>

      {/* Spacer */}
      <div style={{ width: '68px' }} />
    </div>
  )
}
