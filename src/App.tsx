import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CommandPalette from './components/CommandPalette'
import Dashboard from './pages/Dashboard'
import Optimize from './pages/Optimize'
import Processes from './pages/Processes'
import Network from './pages/Network'
import Storage from './pages/Storage'
import Settings from './pages/Settings'
import './index.css'

function App() {
  const [isDark, setIsDark] = useState(true)

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <Header isDark={isDark} setIsDark={setIsDark} />
          <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/optimize" element={<Optimize />} />
              <Route path="/processes" element={<Processes />} />
              <Route path="/network" element={<Network />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <CommandPalette />
      </div>
    </Router>
  )
}

export default App
