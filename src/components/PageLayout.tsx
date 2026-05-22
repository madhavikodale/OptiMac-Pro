import React, { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface PageLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  maxWidth?: string
}

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'System health and performance metrics' },
  '/optimize': { title: 'One-Click Optimize', subtitle: 'Run optimization tasks to boost your system performance' },
  '/processes': { title: 'Processes', subtitle: 'Manage running applications and processes' },
  '/network': { title: 'Network', subtitle: 'Monitor network connections and bandwidth' },
  '/storage': { title: 'Storage', subtitle: 'View detailed storage breakdown and usage' },
  '/settings': { title: 'Settings', subtitle: 'Configure your OptiMac Pro preferences' },
}

export default function PageLayout({ children, title, subtitle, maxWidth = '1600px' }: PageLayoutProps) {
  const location = useLocation()
  const meta = titles[location.pathname] || { title, subtitle: subtitle || '' }

  return (
    <div
      className="page-enter"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '32px',
      }}
    >
      <div style={{ maxWidth, margin: '0 auto', width: '100%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '8px',
              letterSpacing: '-0.8px',
              lineHeight: '1.1',
            }}
          >
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '15px',
                fontWeight: '500',
                letterSpacing: '0.2px',
              }}
            >
              {meta.subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}
