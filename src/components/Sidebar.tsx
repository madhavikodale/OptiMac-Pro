import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Activity, Zap, Layers, Wifi, HardDrive, Settings, ChevronRight } from 'lucide-react'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: Activity },
    { label: 'Optimize', path: '/optimize', icon: Zap, badge: 'BOOST' },
    { label: 'Processes', path: '/processes', icon: Layers },
    { label: 'Network', path: '/network', icon: Wifi },
    { label: 'Storage', path: '/storage', icon: HardDrive },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a35 100%)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      zIndex: 100
    }}>
      {/* ANIMATED GRADIENT BACKGROUND */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(6,182,212,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* LOGO SECTION */}
      <div style={{
        padding: '28px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
          animation: 'pulse 2s infinite'
        }}>
          <Activity size={24} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: 'white', letterSpacing: '-0.5px' }}>OptiMac</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '0.5px' }}>PRO</div>
        </div>
      </div>

      {/* MENU */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: active 
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.1) 100%)'
                  : 'transparent',
                color: active ? '#06b6d4' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                position: 'relative',
                overflow: 'hidden',
                borderLeft: active ? '2px solid #06b6d4' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }
              }}
            >
              <Icon size={18} strokeWidth={2} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '9px',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.2) 100%)',
                  color: '#fca5a5',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  letterSpacing: '0.5px'
                }}>
                  {item.badge}
                </span>
              )}
              {active && (
                <ChevronRight size={16} style={{ marginLeft: '4px' }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div style={{
        padding: '20px 16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '12px',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'white' }}>
          <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
          <span style={{ fontWeight: '600' }}>10:03 AM</span>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>May 8</div>
        <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '6px', fontWeight: '600' }}>● Optimized</div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(6,182,212,0.3); }
          50% { box-shadow: 0 8px 24px rgba(6,182,212,0.6); }
        }
      `}</style>
    </aside>
  )
}
