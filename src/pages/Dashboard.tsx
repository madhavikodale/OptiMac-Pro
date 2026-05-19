import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Zap, BarChart3, HardDrive } from 'lucide-react'

export default function Dashboard() {
  const [cpuUsage, setCpuUsage] = useState(26.49)
  const [memoryUsage, setMemoryUsage] = useState(10.6)
  const [diskUsage, setDiskUsage] = useState(93)
  const [systemHealth] = useState(92)

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.max(5, Math.min(95, cpuUsage + (Math.random() - 0.5) * 10)))
      setMemoryUsage(Math.max(5, Math.min(16, memoryUsage + (Math.random() - 0.5) * 2)))
      setDiskUsage(Math.max(5, Math.min(100, diskUsage + (Math.random() - 0.5) * 2)))
    }, 2000)
    return () => clearInterval(interval)
  }, [cpuUsage, memoryUsage, diskUsage])

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend, trendValue }) => (
    <div style={{
      background: `linear-gradient(135deg, rgba(${color},0.08) 0%, rgba(${color},0.03) 100%)`,
      border: `1px solid rgba(${color},0.15)`,
      borderRadius: '12px',
      padding: '20px',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.borderColor = `rgba(${color},0.3)`
      e.currentTarget.style.boxShadow = `0 12px 32px rgba(${color},0.12)`
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = `rgba(${color},0.15)`
      e.currentTarget.style.boxShadow = 'none'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px', fontWeight: '700' }}>
            {title}
          </p>
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: `rgba(${color},0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: `rgb(${color})`
        }}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <p style={{ fontSize: '28px', fontWeight: '700', color: `rgb(${color})`, lineHeight: '1' }}>
          {typeof value === 'number' ? value.toFixed(1) : value}
        </p>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{unit}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: trend === 'up' ? '#ef4444' : '#4ade80', fontWeight: '600' }}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{trendValue}% {trend === 'up' ? 'increase' : 'decrease'}</span>
      </div>
    </div>
  )

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
      overflowY: 'auto',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1900px', margin: '0 auto' }}>
        {/* HEADER SECTION */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '44px', 
            fontWeight: '800', 
            color: 'white', 
            marginBottom: '8px',
            letterSpacing: '-1px'
          }}>
            Dashboard
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '15px',
            fontWeight: '500',
            letterSpacing: '0.2px'
          }}>
            System health and performance metrics
          </p>
        </div>

        {/* MAIN 2-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* LEFT - HEALTH SECTION */}
          <div>
            {/* HEALTH RING CARD */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(20px)',
              marginBottom: '16px'
            }}>
              <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '20px' }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="90" 
                    fill="none" 
                    stroke="url(#healthGradient)" 
                    strokeWidth="18" 
                    strokeDasharray={`${(systemHealth / 100) * 565} 565`} 
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: '800', color: '#06b6d4' }}>{systemHealth}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px', fontWeight: '600', letterSpacing: '0.4px' }}>EXCELLENT</div>
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                borderRadius: '10px',
                color: 'white',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                letterSpacing: '0.3px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 20px rgba(6,182,212,0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(6,182,212,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(6,182,212,0.25)'
              }}>
                ⚡ Optimize System
              </button>
            </div>

            {/* SYSTEM STATUS */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(74,222,128,0.03) 100%)',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '12px',
              padding: '16px',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>All Systems Running</p>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>No issues detected</p>
            </div>
          </div>

          {/* RIGHT - METRICS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', height: 'fit-content' }}>
            <MetricCard 
              title="CPU Cores" 
              value={4} 
              unit="cores" 
              icon={BarChart3}
              color="6, 182, 212"
              trend="down"
              trendValue={3}
            />
            <MetricCard 
              title="Total RAM" 
              value={16.0} 
              unit="GB" 
              icon={BarChart3}
              color="167, 139, 250"
              trend="up"
              trendValue={2}
            />
            <MetricCard 
              title="Processes" 
              value={10} 
              unit="active" 
              icon={BarChart3}
              color="59, 130, 246"
              trend="down"
              trendValue={1}
            />
          </div>
        </div>

        {/* PERFORMANCE SECTION */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '14px', letterSpacing: '-0.3px' }}>
            Performance
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.03) 100%)',
              border: '1px solid rgba(6,182,212,0.15)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>CPU Usage</p>
                <p style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700' }}>↓ 3%</p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#06b6d4', marginBottom: '8px' }}>
                {cpuUsage.toFixed(1)}%
              </p>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, #06b6d4, #0891b2)', width: `${cpuUsage}%`, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.03) 100%)',
              border: '1px solid rgba(167,139,250,0.15)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Memory</p>
                <p style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700' }}>↓ 2%</p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#a78bfa', marginBottom: '8px' }}>
                {memoryUsage.toFixed(1)}GB
              </p>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, #a78bfa, #9333ea)', width: `${(memoryUsage / 16) * 100}%`, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(74,222,128,0.03) 100%)',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Disk Storage</p>
                <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '700' }}>↑ 1%</p>
              </div>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#4ade80', marginBottom: '8px' }}>
                {diskUsage.toFixed(0)}GB
              </p>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, #4ade80, #22c55e)', width: `${Math.min(diskUsage, 100)}%`, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
