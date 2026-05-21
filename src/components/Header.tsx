import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Sun,
  Moon,
  RotateCcw,
  SettingsIcon,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface HeaderProps {
  systemHealth?: number
  systemStatus?: 'excellent' | 'good' | 'warning' | 'critical'
}

export const Header: React.FC<HeaderProps> = ({
  systemHealth = 92,
  systemStatus = 'excellent',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationCount, setNotificationCount] = useState(1)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-400/10'
      case 'good':
        return 'bg-blue-400/10'
      case 'warning':
        return 'bg-yellow-400/10'
      case 'critical':
        return 'bg-red-400/10'
      default:
        return 'bg-neutral-800'
    }
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleNotifications = () => {
    if (notificationCount > 0) {
      setNotificationCount(0)
    }
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <header className={`w-full px-6 py-4 border-b transition-colors ${
      isDark 
        ? 'bg-neutral-950 border-neutral-800' 
        : 'bg-white border-neutral-200'
    } flex items-center justify-between`}>
      {/* LEFT SECTION - SEARCH BAR */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}
          />
          <input
            type="text"
            placeholder="Search Optimizations, Tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 placeholder-neutral-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700 placeholder-neutral-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30'
            } border`}
          />
          <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* CENTER SECTION - SYSTEM TIME */}
      <div className="flex-1 flex justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold font-mono ${isDark ? 'text-neutral-50' : 'text-neutral-950'}`}>
            {currentTime}
          </div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {currentDate}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - SYSTEM INFO & CONTROLS */}
      <div className="flex items-center gap-6">
        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-sm font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>macOS</div>
            <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Sonoma 14.4</div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBgColor(systemStatus)}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M17.5 2H6.5C5.12 2 4 3.12 4 4.5v15C4 20.88 5.12 22 6.5 22h11C18.88 22 20 20.88 20 19.5V4.5C20 3.12 18.88 2 17.5 2Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* DEVICE INFO */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-sm font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Mac</div>
            <div className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>MacBook Pro (M2 Pro)</div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
            <svg className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 3H4C2.9 3 2 3.9 2 5v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* DIVIDER */}
        <div className={`w-px h-6 ${isDark ? 'bg-neutral-800' : 'bg-neutral-300'}`} />

        {/* CONTROLS */}
        <div className="flex items-center gap-3">
          {/* NOTIFICATION BELL */}
          <button
            onClick={handleNotifications}
            className={`relative p-2 rounded-lg transition-colors group ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-200'}`}
            title="Notifications"
          >
            <Bell size={18} className={`${isDark ? 'text-neutral-400 group-hover:text-neutral-200' : 'text-neutral-600 group-hover:text-neutral-800'}`} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors group ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-200'}`}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <Sun size={18} className={`${isDark ? 'text-neutral-400 group-hover:text-neutral-200' : 'text-neutral-600 group-hover:text-neutral-800'}`} />
            ) : (
              <Moon size={18} className={`${isDark ? 'text-neutral-400 group-hover:text-neutral-200' : 'text-neutral-600 group-hover:text-neutral-800'}`} />
            )}
          </button>

          {/* REFRESH */}
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition-colors group hover:animate-spin ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-200'}`}
            title="Refresh"
          >
            <RotateCcw size={18} className={`${isDark ? 'text-neutral-400 group-hover:text-neutral-200' : 'text-neutral-600 group-hover:text-neutral-800'}`} />
          </button>

          {/* SETTINGS */}
          <button
            onClick={handleSettings}
            className={`p-2 rounded-lg transition-colors group ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-200'}`}
            title="Settings"
          >
            <SettingsIcon size={18} className={`${isDark ? 'text-neutral-400 group-hover:text-neutral-200' : 'text-neutral-600 group-hover:text-neutral-800'}`} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
