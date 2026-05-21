import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Activity,
  Cpu,
  Layers,
  Power,
  Wifi,
  Zap,
  Trash2,
  HardDrive,
  Brain,
  Settings,
  Battery,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    {
      section: 'System',
      items: [
        { label: 'Overview', path: '/', icon: Activity },
        { label: 'Performance', path: '/performance', icon: Cpu },
      ],
    },
    {
      section: 'Optimization',
      items: [
        { label: 'One Click Optimize', path: '/optimize', icon: Zap, badge: 'BOOST' as const },
        { label: 'Junk Cleaner', path: '/cleaner', icon: Trash2 },
        { label: 'Disk Optimizer', path: '/disk', icon: HardDrive },
      ],
    },
    {
      section: 'Tools',
      items: [
        { label: 'Processes', path: '/processes', icon: Layers },
        { label: 'Startup Items', path: '/startup', icon: Power },
        { label: 'Services', path: '/services', icon: Wifi },
        { label: 'AI Intelligence', path: '/ai', icon: Brain },
        { label: 'Uninstaller', path: '/uninstaller', icon: Trash2 },
        { label: 'Duplicates', path: '/duplicates', icon: HardDrive },
        { label: 'Battery', path: '/battery', icon: Battery },
        { label: 'Network', path: '/network', icon: Wifi },
      ],
    },
    {
      section: 'Settings',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ] as const

  return (
    <aside
      className={`w-[220px] h-screen flex flex-col overflow-y-auto select-none ${
        isDark
          ? 'bg-[#0d0d0f] border-r border-white/[0.06]'
          : 'bg-[#f5f5f7] border-r border-black/[0.06]'
      }`}
      style={{ scrollbarWidth: 'thin' }}
    >
      {/* LOGO */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Activity size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div
              className={`font-semibold text-[13px] tracking-tight ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              OptiMac
            </div>
            <div
              className={`text-[10px] font-bold tracking-[0.12em] mt-[2px] ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              PRO
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className={`mx-5 h-px mb-3 ${
          isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
        }`}
      />

      {/* MENU SECTIONS */}
      <nav className="flex-1 px-3 pb-4 space-y-5">
        {menuItems.map((section) => (
          <div key={section.section}>
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.08em] px-3 mb-[6px] ${
                isDark ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
              {section.section}
            </div>
            <div className="space-y-[2px]">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      group w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg
                      transition-all duration-200 ease-out
                      ${
                        active
                          ? isDark
                            ? 'bg-white/[0.08] text-cyan-400'
                            : 'bg-black/[0.06] text-cyan-600'
                          : isDark
                          ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                          : 'text-neutral-500 hover:text-neutral-800 hover:bg-black/[0.04]'
                      }
                    `}
                  >
                    {/* Active indicator pill */}
                    {active && (
                      <div className="absolute left-0 w-[3px] h-5 rounded-r-full bg-cyan-400/80" />
                    )}

                    <Icon
                      size={17}
                      strokeWidth={active ? 2.2 : 1.8}
                      className={`
                        transition-transform duration-200 ease-out
                        ${active ? 'scale-105' : 'group-hover:scale-105'}
                      `}
                    />
                    <span
                      className={`
                        flex-1 text-left text-[13px] transition-all duration-200
                        ${active ? 'font-semibold' : 'font-medium'}
                      `}
                    >
                      {item.label}
                    </span>
                    {'badge' in item && item.badge && (
                      <span
                        className={`
                          px-[6px] py-[1px] text-[10px] font-bold rounded-md
                          ${
                            isDark
                              ? 'bg-red-500/15 text-red-400'
                              : 'bg-red-500/10 text-red-500'
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* SYSTEM STATUS */}
      <div
        className={`mx-3 mb-3 px-3 py-3 rounded-xl ${
          isDark
            ? 'bg-white/[0.03] border border-white/[0.05]'
            : 'bg-black/[0.03] border border-black/[0.05]'
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span
            className={`text-[11px] font-semibold ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}
          >
            System Stable
          </span>
        </div>
        <p
          className={`text-[11px] leading-relaxed ${
            isDark ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          All monitoring services operational
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
