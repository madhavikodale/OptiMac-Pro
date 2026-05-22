import React, { useState } from 'react'
import { SettingsIcon, Bell, Eye, Lock, Palette, HardDrive, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface SettingItem {
  id: string
  label: string
  description: string
  type: 'toggle' | 'select' | 'input'
  value: boolean | string
}

export const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: '1',
      label: 'Enable Notifications',
      description: 'Receive alerts for system events and optimizations',
      type: 'toggle',
      value: true,
    },
    {
      id: '2',
      label: 'Auto-Clean on Startup',
      description: 'Automatically run cleanup tasks when your Mac starts',
      type: 'toggle',
      value: false,
    },
    {
      id: '3',
      label: 'Dark Mode',
      description: 'Use dark theme throughout the application',
      type: 'toggle',
      value: isDark,
    },
    {
      id: '4',
      label: 'Startup on Login',
      description: 'Launch OptiMac Pro automatically when you sign in',
      type: 'toggle',
      value: true,
    },
    {
      id: '5',
      label: 'Update Frequency',
      description: 'How often to refresh system metrics',
      type: 'select',
      value: 'auto',
    },
    {
      id: '6',
      label: 'Theme',
      description: 'Choose your preferred color scheme',
      type: 'select',
      value: isDark ? 'dark' : 'light',
    },
  ])

  const handleToggle = (id: string) => {
    if (id === '3') {
      toggleTheme()
    }
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id && s.type === 'toggle'
          ? { ...s, value: !s.value }
          : s
      )
    )
  }

  const handleSelectChange = (id: string, value: string) => {
    if (id === '6') {
      if (value === 'dark' && !isDark) toggleTheme()
      if (value === 'light' && isDark) toggleTheme()
    }
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s))
    )
  }

  const getIcon = (id: string) => {
    switch (id) {
      case '1':
        return <Bell size={20} className="text-cyan-400" />
      case '2':
        return <HardDrive size={20} className="text-purple-400" />
      case '3':
        return <Moon size={20} className="text-blue-400" />
      case '4':
        return <Eye size={20} className="text-green-400" />
      case '5':
      case '6':
        return <Palette size={20} className="text-orange-400" />
      default:
        return null
    }
  }

  return (
    <div className={`min-h-full p-6 md:p-8 transition-colors duration-300 ${
      isDark ? 'bg-neutral-950' : 'bg-neutral-100'
    }`}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${
          isDark ? 'text-neutral-50' : 'text-neutral-900'
        }`}>
          <SettingsIcon className="text-cyan-400" size={32} />
          Settings
        </h1>
        <p className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
          Customize OptiMac Pro to your preferences
        </p>
      </div>

      {/* SETTINGS SECTIONS */}
      <div className="space-y-8">
        {/* GENERAL SECTION */}
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>General</h2>
          <div className="space-y-3">
            {settings.slice(0, 4).map((setting) => (
              <div
                key={setting.id}
                className={`rounded-xl p-4 border flex items-center justify-between transition-colors duration-300 ${
                  isDark
                    ? 'glass border-white/10'
                    : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`}>
                    {getIcon(setting.id)}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{setting.label}</p>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-neutral-500'}`}>{setting.description}</p>
                  </div>
                </div>

                {setting.type === 'toggle' && (
                  <button
                    onClick={() => handleToggle(setting.id)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      setting.value ? 'bg-cyan-500' : isDark ? 'bg-white/10' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        setting.value ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PREFERENCES SECTION */}
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Preferences</h2>
          <div className="space-y-3">
            {settings.slice(4).map((setting) => (
              <div
                key={setting.id}
                className={`rounded-xl p-4 border flex items-center justify-between transition-colors duration-300 ${
                  isDark
                    ? 'glass border-white/10'
                    : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-100'}`}>
                    {getIcon(setting.id)}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{setting.label}</p>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-neutral-500'}`}>{setting.description}</p>
                  </div>
                </div>

                {setting.type === 'select' && (
                  <select
                    value={setting.value as string}
                    onChange={(e) => handleSelectChange(setting.id, e.target.value)}
                    className={`px-3 py-2 border rounded-lg text-sm focus:border-cyan-400/50 transition-all ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-900'
                    }`}
                  >
                    {setting.id === '5' ? (
                      <>
                        <option value="fast">Fast (1s)</option>
                        <option value="auto">Auto (2s)</option>
                        <option value="slow">Slow (5s)</option>
                      </>
                    ) : (
                      <>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </>
                    )}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>About</h2>
          <div className={`rounded-xl p-6 border space-y-3 transition-colors duration-300 ${
            isDark
              ? 'glass border-white/10'
              : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <p className={isDark ? 'text-white/60' : 'text-neutral-500'}>App Version</p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>1.0.0</p>
            </div>
            <div className={`flex justify-between items-center pb-3 border-b ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <p className={isDark ? 'text-white/60' : 'text-neutral-500'}>Build</p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>macOS 14.4+</p>
            </div>
            <div className="flex justify-between items-center">
              <p className={isDark ? 'text-white/60' : 'text-neutral-500'}>Copyright</p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>© 2025 OptiMac</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3 pt-4">
          <button className={`w-full py-3 px-4 border rounded-lg font-semibold transition-all ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-900'
          }`}>
            Check for Updates
          </button>
          <button className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-semibold transition-all">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
