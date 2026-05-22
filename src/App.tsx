import React, { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CommandPalette from './components/CommandPalette'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingFallback from './components/LoadingFallback'
import ToastProvider from './components/ToastProvider'
import ShortcutsOverlay from './components/ShortcutsOverlay'

// CACHE BUSTER v2 — forces Vite to rebuild all chunks
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Optimize = lazy(() => import('./pages/Optimize'))
const DeepCleanup = lazy(() => import('./pages/DeepCleanup'))
const Processes = lazy(() => import('./pages/Processes'))
const Network = lazy(() => import('./pages/Network'))
const Storage = lazy(() => import('./pages/Storage'))
const Settings = lazy(() => import('./pages/Settings'))
const Startup = lazy(() => import('./pages/Startup'))
const BatteryPage = lazy(() => import('./pages/Battery'))
const Temperature = lazy(() => import('./pages/Temperature'))
const AiIntelligence = lazy(() => import('./pages/AiIntelligence'))
const Firewall = lazy(() => import('./pages/Firewall'))
const Uninstaller = lazy(() => import('./pages/Uninstaller'))
const SmartUninstall = lazy(() => import('./pages/SmartUninstall'))
const SpeedTest = lazy(() => import('./pages/SpeedTest'))
const Duplicates = lazy(() => import('./pages/Duplicates'))
const DiskAnalyzer = lazy(() => import('./pages/DiskAnalyzer'))
const MenuBarWidget = lazy(() => import('./pages/MenuBarWidget'))
const ProjectPurge = lazy(() => import('./pages/ProjectPurge'))
const MemoryPressurePage = lazy(() => import('./pages/MemoryPressure'))
const Smart = lazy(() => import('./pages/Smart'))

const BUILD_ID = "v2.1.0-" + Date.now()
export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('optimac-theme')
    return saved ? saved === 'dark' : true
  })
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('optimac-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div data-build-id="optimac-v2-2025" style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
          <Sidebar />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Header isDark={isDark} setIsDark={setIsDark} />
            <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/optimize" element={<Optimize />} />
                  <Route path="/deep-cleanup" element={<DeepCleanup />} />
                  <Route path="/processes" element={<Processes />} />
                  <Route path="/network" element={<Network />} />
                  <Route path="/storage" element={<Storage />} />
                  <Route path="/startup" element={<Startup />} />
                  <Route path="/battery" element={<BatteryPage />} />
                  <Route path="/temperature" element={<Temperature />} />
                  <Route path="/ai" element={<AiIntelligence />} />
                  <Route path="/firewall" element={<Firewall />} />
                  <Route path="/uninstaller" element={<Uninstaller />} />
                  <Route path="/smart-uninstall" element={<SmartUninstall />} />
                  <Route path="/speedtest" element={<SpeedTest />} />
                  <Route path="/duplicates" element={<Duplicates />} />
                  <Route path="/disk-analyzer" element={<DiskAnalyzer />} />
                  <Route path="/memory" element={<MemoryPressurePage />} />
                  <Route path="/menu-bar" element={<MenuBarWidget />} />
                  <Route path="/project-purge" element={<ProjectPurge />} />
                  <Route path="/smart" element={<Smart />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
          <CommandPalette />
          <ShortcutsOverlay visible={showShortcuts} onClose={() => setShowShortcuts(false)} />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  )
}
