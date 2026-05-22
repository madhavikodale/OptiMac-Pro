import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Activity,
  Zap,
  Layers,
  Wifi,
  HardDrive,
  Settings,
  ChevronRight,
  Power,
  Battery,
  Thermometer,
  BrainCircuit,
  Shield,
  Trash2,
  Gauge,
  Copy,
  GaugeCircle,
  HeartPulse,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Wrench,
  Monitor,
  Trash,
  PieChart,
  ActivitySquare,
  FolderSearch,
} from 'lucide-react'

interface NavSection {
  label: string
  icon: React.ElementType
  items: { path: string; label: string; icon: React.ElementType; badge?: string }[]
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'optimization', 'monitoring', 'system'])

  const sections: NavSection[] = [
    {
      label: 'Overview',
      icon: LayoutDashboard,
      items: [
        { path: '/', label: 'Dashboard', icon: Activity, badge: 'Live' },
        { path: '/ai', label: 'AI Intelligence', icon: BrainCircuit },
      ],
    },
    {
      label: 'Optimization',
      icon: Sparkles,
      items: [
        { path: '/optimize', label: 'Optimize', icon: Zap },
        { path: '/deep-cleanup', label: 'Deep Cleanup', icon: Trash, badge: 'New' },
        { path: '/processes', label: 'Processes', icon: Layers },
        { path: '/startup', label: 'Startup', icon: Power },
        { path: '/uninstaller', label: 'Uninstaller', icon: Trash2 },
        { path: '/smart-uninstall', label: 'Smart Uninstall', icon: Trash, badge: 'New' },
        { path: '/duplicates', label: 'Duplicates', icon: Copy },
        { path: '/project-purge', label: 'Project Purge', icon: FolderSearch, badge: 'New' },
      ],
    },
    {
      label: 'Monitoring',
      icon: Monitor,
      items: [
        { path: '/network', label: 'Network', icon: Wifi },
        { path: '/speedtest', label: 'Speed Test', icon: Gauge },
        { path: '/storage', label: 'Storage', icon: HardDrive },
        { path: '/disk-analyzer', label: 'Disk Analyzer', icon: PieChart, badge: 'New' },
        { path: '/memory', label: 'Memory', icon: GaugeCircle },
        { path: '/menu-bar', label: 'Menu Bar HUD', icon: ActivitySquare, badge: 'New' },
      ],
    },
    {
      label: 'System',
      icon: Wrench,
      items: [
        { path: '/battery', label: 'Battery', icon: Battery },
        { path: '/temperature', label: 'Temperature', icon: Thermometer },
        { path: '/firewall', label: 'Firewall', icon: Shield },
        { path: '/smart', label: 'Disk Health', icon: HeartPulse },
      ],
    },
  ]

  function toggleSection(label: string) {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <nav
      style={{
        width: '260px',
        height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0 0',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 20px 28px',
          marginBottom: '4px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(6,182,212,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset',
            transition: 'transform 0.3s ease',
          }}
        >
          <Zap size={18} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.4px',
              lineHeight: 1.2,
            }}
          >
            OptiMac Pro
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            System Optimizer
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto',
          flex: 1,
          padding: '0 12px',
        }}
      >
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.label.toLowerCase())
          const SectionIcon = section.icon
          const hasActiveItem = section.items.some((item) => location.pathname === item.path)

          return (
            <div key={section.label} style={{ marginBottom: '2px' }}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.label.toLowerCase())}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: hasActiveItem ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  if (!hasActiveItem) {
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }
                }}
              >
                <SectionIcon size={14} />
                <span style={{ flex: 1 }}>{section.label}</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 0.5,
                  }}
                />
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    marginTop: '2px',
                    paddingLeft: '6px',
                  }}
                >
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path
                    const ItemIcon = item.icon

                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: 'none',
                          background: isActive
                            ? 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 100%)'
                            : 'transparent',
                          color: isActive ? '#22d3ee' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: isActive ? '700' : '600',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          boxShadow: isActive
                            ? '0 0 0 1px rgba(6,182,212,0.25), 0 2px 8px rgba(6,182,212,0.08)'
                            : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'var(--bg-card-hover)'
                            e.currentTarget.style.color = 'var(--text-primary)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }
                        }}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <div
                            style={{
                              position: 'absolute',
                              left: '0',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '3px',
                              height: '18px',
                              borderRadius: '0 3px 3px 0',
                              background: 'linear-gradient(180deg, #06b6d4, #3b82f6)',
                            }}
                          />
                        )}

                        <ItemIcon
                          size={16}
                          style={{
                            color: isActive ? '#22d3ee' : undefined,
                            opacity: isActive ? 1 : 0.8,
                          }}
                        />
                        <span style={{ flex: 1 }}>{item.label}</span>

                        {/* Badge */}
                        {item.badge && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(34,197,94,0.15)',
                              color: '#4ade80',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}

                        {isActive && (
                          <ChevronRight size={14} style={{ opacity: 0.35 }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            border: 'none',
            background: location.pathname === '/settings'
              ? 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 100%)'
              : 'transparent',
            color: location.pathname === '/settings' ? '#22d3ee' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: location.pathname === '/settings' ? '700' : '600',
            fontFamily: 'inherit',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: '12px',
            boxShadow: location.pathname === '/settings'
              ? '0 0 0 1px rgba(6,182,212,0.25), 0 2px 8px rgba(6,182,212,0.08)'
              : 'none',
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== '/settings') {
              e.currentTarget.style.background = 'var(--bg-card-hover)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/settings') {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }
          }}
        >
          <Settings size={16} />
          <span style={{ flex: 1 }}>Settings</span>
          {location.pathname === '/settings' && (
            <ChevronRight size={14} style={{ opacity: 0.35 }} />
          )}
        </button>

        <div
          style={{
            fontSize: '10px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            textAlign: 'center',
            letterSpacing: '0.5px',
            opacity: 0.7,
          }}
        >
          OptiMac Pro v1.0.0
        </div>
      </div>
    </nav>
  )
}
