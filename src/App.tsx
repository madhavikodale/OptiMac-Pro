import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { CommandPalette } from './components/CommandPalette'
import { Dashboard } from './components/Dashboard'
import { Performance } from './components/Performance'
import { Processes } from './components/Processes'
import { StartupItems } from './components/StartupItems'
import { Services } from './components/Services'
import { OneClickOptimize } from './components/OneClickOptimize'
import { JunkCleaner } from './components/JunkCleaner'
import { DiskOptimizer } from './components/DiskOptimizer'
import { AIIntelligence } from './components/AIIntelligence'
import { Settings } from './components/Settings'
import { SmartUninstaller } from './components/SmartUninstaller'
import { DuplicateFileFinder } from './components/DuplicateFileFinder'
import { BatteryOptimizer } from './components/BatteryOptimizer'
import { NetworkMonitor } from './components/NetworkMonitor'
import './styles/globals.css'

function AppContent() {
  const { isDark } = useTheme()
  const [systemHealth, setSystemHealth] = useState(92)
  const [systemStatus, setSystemStatus] = useState<'excellent' | 'good' | 'warning' | 'critical'>('excellent')

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-neutral-950' : 'bg-neutral-100'
    }`}>
      <Sidebar />
      <div className={`flex flex-col flex-1 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-neutral-950' : 'bg-neutral-100'
      }`}>
        <Header systemHealth={systemHealth} systemStatus={systemStatus} />
        <main className={`flex-1 overflow-y-auto overflow-x-hidden transition-colors duration-300 ${
          isDark ? 'bg-neutral-950' : 'bg-neutral-100'
        }`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/startup" element={<StartupItems />} />
            <Route path="/services" element={<Services />} />
            <Route path="/optimize" element={<OneClickOptimize />} />
            <Route path="/cleaner" element={<JunkCleaner />} />
            <Route path="/disk" element={<DiskOptimizer />} />
            <Route path="/ai" element={<AIIntelligence />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/uninstaller" element={<SmartUninstaller />} />
            <Route path="/duplicates" element={<DuplicateFileFinder />} />
            <Route path="/battery" element={<BatteryOptimizer />} />
            <Route path="/network" element={<NetworkMonitor />} />
          </Routes>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
