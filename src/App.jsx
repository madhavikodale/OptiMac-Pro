import { useState } from 'react'
import { FiMenu, FiSearch, FiBell, FiSun, FiMoon } from 'react-icons/fi'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import AIIntelligence from './components/AIIntelligence'
import './App.css'

function App() {
  const [uiMode, setUiMode] = useState('premium')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  const toggleUIMode = () => {
    setUiMode(uiMode === 'premium' ? 'simple' : 'premium')
  }

  return (
    <div className={`flex h-screen ${uiMode === 'premium' ? 'bg-dark-950' : 'bg-gray-50'} transition-all duration-500`}>
      <Sidebar isOpen={sidebarOpen} uiMode={uiMode} onTabChange={setActiveTab} activeTab={activeTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - No white border */}
        <nav className={`transition-all duration-500 ${uiMode === 'premium' ? 'glass border-b border-purple-500/20' : 'bg-gray-100 border-b border-gray-200'}`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition ${uiMode === 'premium' ? 'hover:bg-purple-500/10 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
              >
                <FiMenu size={20} />
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${uiMode === 'premium' ? 'glass' : 'bg-white border border-gray-300'}`}>
                <FiSearch size={18} className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'} />
                <input
                  type="text"
                  placeholder="Search optimizations, tools..."
                  className={`bg-transparent outline-none text-sm w-64 ${uiMode === 'premium' ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className={`p-2 rounded-lg transition ${uiMode === 'premium' ? 'hover:bg-purple-500/10 text-white' : 'hover:bg-gray-200 text-gray-800'}`}>
                <FiBell size={20} />
              </button>

              <button
                onClick={toggleUIMode}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-500 flex items-center gap-2 ${
                  uiMode === 'premium'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                    : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                }`}
              >
                {uiMode === 'premium' ? (
                  <>
                    <FiSun size={18} />
                    <span>Simple</span>
                  </>
                ) : (
                  <>
                    <FiMoon size={18} />
                    <span>Premium</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-auto">
          {activeTab === 'dashboard' ? (
            <Dashboard uiMode={uiMode} />
          ) : activeTab === 'ai-intelligence' ? (
            <AIIntelligence />
          ) : (
            <Dashboard uiMode={uiMode} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
