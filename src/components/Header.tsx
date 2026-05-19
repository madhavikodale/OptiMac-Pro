import React, { useState, useEffect } from 'react'
import { Search, Sun, Moon, User } from 'lucide-react'

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

  return (
    <header style={{
      height: '90px',
      background: 'linear-gradient(180deg, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.6) 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* SEARCH */}
      <div style={{ flex: 1, maxWidth: '360px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: focused ? '#06b6d4' : 'rgba(255,255,255,0.4)',
            transition: 'color 0.3s'
          }} />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 44px',
              background: focused 
                ? 'rgba(6,182,212,0.1)' 
                : 'rgba(255,255,255,0.05)',
              border: focused 
                ? '1.5px solid rgba(6,182,212,0.4)' 
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
              fontWeight: '500'
            }}
          />
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '32px' }}>
        {/* THEME TOGGLE */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s',
            fontSize: '13px',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* PROFILE BUTTON */}
        <button
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            border: '1px solid rgba(6,182,212,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(6,182,212,0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(6,182,212,0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(6,182,212,0.25)'
          }}
          title="Profile"
        >
          <User size={20} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  )
}
