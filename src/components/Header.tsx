import React, { useState, useEffect } from 'react'
import { Search, Sun, Moon, User, Command } from 'lucide-react'

interface HeaderProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <header style={{
      height: '64px',
      background: 'linear-gradient(180deg, var(--bg-sidebar) 0%, rgba(255,255,255,0) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* SEARCH */}
      <div style={{ flex: 1, maxWidth: '380px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: focused ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'color 0.3s'
          }} />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              background: focused 
                ? 'rgba(6,182,212,0.08)' 
                : 'var(--bg-input)',
              border: focused 
                ? '1px solid var(--accent)' 
                : '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
              fontWeight: '500',
              fontFamily: 'inherit',
            }}
          />
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            padding: '2px 5px',
            background: 'var(--bg-card)',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
          }}>
            <Command size={10} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>K</span>
          </div>
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px' }}>
        {/* Time display */}
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.3px',
        }}>
          {time}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />

        {/* THEME TOGGLE - FIXED */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            padding: '8px 10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-card-hover)'
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.borderColor = 'var(--border-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-card)'
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'var(--border-color)'
          }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* PROFILE BUTTON */}
        <button
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            border: '1px solid rgba(6,182,212,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(6,182,212,0.2)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(6,182,212,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(6,182,212,0.2)'
          }}
          title="Profile"
        >
          <User size={16} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  )
}
