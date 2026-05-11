import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { FiMenu, FiSearch, FiBell, FiSun, FiMoon, FiHome, FiActivity, FiCpu, FiSettings, FiWifi, FiZap, FiTrash2, FiHardDrive, FiAlertCircle, FiTrendingUp, FiShield, FiRefreshCw, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import './App.css'

function App() {
  const [uiMode, setUiMode] = useState('premium')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [systemStats, setSystemStats] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [topProcesses, setTopProcesses] = useState([])

  const systemMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'ai-intelligence', label: '🤖 AI Intelligence', icon: FiShield },
    { id: 'performance', label: 'Performance', icon: FiActivity },
    { id: 'processes', label: 'Processes', icon: FiCpu },
    { id: 'startup', label: 'Startup Items', icon: FiSettings },
    { id: 'services', label: 'Services', icon: FiWifi },
  ]

  const optimizationMenuItems = [
    { id: 'optimize', label: 'One Click Optimize', icon: FiZap },
    { id: 'cleaner', label: 'Junk Cleaner', icon: FiTrash2 },
    { id: 'disk', label: 'Disk Optimizer', icon: FiHardDrive },
  ]

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [stats, analysisData, insightsData, processes] = await Promise.all([
        invoke('get_system_stats'),
        invoke('analyze_system'),
        invoke('get_ai_insights'),
        invoke('get_top_processes', { limit: 10 })
      ])
      setSystemStats(stats)
      setAnalysis(analysisData)
      setInsights(insightsData)
      setTopProcesses(processes)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderPage = () => {
    if (activeTab === 'dashboard') return <DashboardPage systemStats={systemStats} analysis={analysis} />
    if (activeTab === 'ai-intelligence') return <AIIntelligencePage analysis={analysis} insights={insights} loading={loading} onRefresh={fetchAllData} />
    if (activeTab === 'performance') return <PerformancePage systemStats={systemStats} analysis={analysis} />
    if (activeTab === 'processes') return <ProcessesPage topProcesses={topProcesses} />
    if (activeTab === 'startup') return <StartupPage />
    if (activeTab === 'services') return <ServicesPage />
    if (activeTab === 'optimize') return <OneClickOptimizePage analysis={analysis} />
    if (activeTab === 'cleaner') return <JunkCleanerPage />
    if (activeTab === 'disk') return <DiskOptimizerPage systemStats={systemStats} />
    return <DashboardPage systemStats={systemStats} analysis={analysis} />
  }

  return (
    <div className={`flex h-screen ${uiMode === 'premium' ? 'bg-dark-950' : 'bg-gray-50'}`}>
      <aside className={`transition-all duration-500 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden ${uiMode === 'premium' ? 'glass border-r border-purple-500/20' : 'bg-gray-900 border-r border-gray-700'}`}>
        <div className="p-6 h-screen flex flex-col overflow-y-auto">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">⚡</div>
            <span className="text-xl font-bold text-white">OptiMac</span>
          </div>
          <nav className="space-y-6 flex-1">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SYSTEM</h3>
              <ul className="space-y-2">
                {systemMenuItems.map(item => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <li key={item.id}>
                      <button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500' : 'text-gray-300 hover:bg-purple-500/10 hover:text-cyan-400'}`}>
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">OPTIMIZATION</h3>
              <ul className="space-y-2">
                {optimizationMenuItems.map(item => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <li key={item.id}>
                      <button onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500' : 'text-gray-300 hover:bg-purple-500/10 hover:text-cyan-400'}`}>
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
          <div className="border-t border-purple-500/20 pt-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-800/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500"></div>
              <div className="text-sm">
                <p className="font-semibold text-white">OptiMac Pro</p>
                <p className="text-xs text-gray-500">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className={`transition-all duration-500 ${uiMode === 'premium' ? 'glass border-b border-purple-500/20' : 'bg-gray-100 border-b border-gray-200'}`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg transition ${uiMode === 'premium' ? 'hover:bg-purple-500/10 text-white' : 'hover:bg-gray-200'}`}>
                <FiMenu size={20} />
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${uiMode === 'premium' ? 'glass' : 'bg-white border border-gray-300'}`}>
                <FiSearch size={18} className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'} />
                <input type="text" placeholder="Search..." className={`bg-transparent outline-none text-sm w-64 ${uiMode === 'premium' ? 'text-white placeholder-gray-400' : 'text-gray-800'}`} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className={`p-2 rounded-lg transition ${uiMode === 'premium' ? 'hover:bg-purple-500/10 text-white' : 'hover:bg-gray-200'}`}>
                <FiBell size={20} />
              </button>
              <button onClick={() => setUiMode(uiMode === 'premium' ? 'simple' : 'premium')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg flex items-center gap-2">
                {uiMode === 'premium' ? <FiSun size={18} /> : <FiMoon size={18} />}
                <span>{uiMode === 'premium' ? 'Simple' : 'Premium'}</span>
              </button>
            </div>
          </div>
        </nav>
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

const DashboardPage = ({ systemStats, analysis }) => (
  <div className="p-8 space-y-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full">
    <h1 className="text-4xl font-bold text-white">Welcome back, User 👋</h1>
    {systemStats && <div className="grid grid-cols-3 gap-6"><MetricCard label="CPU" value={`${systemStats.cpu_usage.toFixed(1)}%`} /><MetricCard label="Memory" value={`${systemStats.memory_usage.toFixed(1)}%`} /><MetricCard label="Disk" value={`${systemStats.disk_usage.toFixed(1)}%`} /></div>}
    {analysis && <div className="grid grid-cols-2 gap-6"><AnomaliesCard anomalies={analysis.anomalies} /><SuggestionsCard suggestions={analysis.suggestions} /></div>}
  </div>
)

const AIIntelligencePage = ({ analysis, insights, loading, onRefresh }) => (
  <div className="p-8 space-y-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full overflow-auto">
    <div className="flex justify-between"><h1 className="text-4xl font-bold text-white">AI System Intelligence</h1><button onClick={onRefresh} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50"><FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />{loading ? 'Analyzing' : 'Refresh'}</button></div>
    {analysis && (
      <>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-white">{Math.round(analysis.overall_health)}%</div>
            <div className="text-green-400 font-semibold mt-2">Health</div>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-white">{analysis.anomalies?.length || 0}</div>
            <div className="text-red-400 text-sm mt-2">Anomalies</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6">
            <div className="text-3xl font-bold text-white">{analysis.suggestions?.length || 0}</div>
            <div className="text-blue-400 text-sm mt-2">Suggestions</div>
          </div>
        </div>
        {insights.length > 0 && (
          <div className="bg-purple-900/30 border border-purple-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">AI Insights</h2>
            <div className="space-y-3">{insights.slice(0, 3).map((insight, idx) => (<div key={idx} className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4"><h3 className="text-white font-semibold">{insight.title}</h3><p className="text-gray-300 text-sm mt-1">{insight.description}</p><div className="text-xs text-purple-400 mt-2">{Math.round(insight.confidence)}% confidence</div></div>))}</div>
          </div>
        )}
        {analysis.anomalies?.length > 0 && <AnomaliesCard anomalies={analysis.anomalies} />}
        {analysis.suggestions?.length > 0 && <SuggestionsCard suggestions={analysis.suggestions} />}
      </>
    )}
  </div>
)

const PerformancePage = ({ systemStats }) => (
  <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full">
    <h1 className="text-4xl font-bold text-white mb-8">Performance</h1>
    {systemStats && (
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">CPU: {systemStats.cpu_usage.toFixed(1)}%</h3>
          <div className="w-full bg-blue-500/20 rounded h-3"><div className="h-full bg-blue-500" style={{width: `${systemStats.cpu_usage}%`}} /></div>
        </div>
        <div className="bg-purple-900/30 border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Memory: {systemStats.memory_usage.toFixed(1)}%</h3>
          <div className="w-full bg-purple-500/20 rounded h-3"><div className="h-full bg-purple-500" style={{width: `${systemStats.memory_usage}%`}} /></div>
        </div>
      </div>
    )}
  </div>
)

const ProcessesPage = ({ topProcesses }) => (
  <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full">
    <h1 className="text-4xl font-bold text-white mb-8">Top Processes</h1>
    <div className="bg-dark-800/50 border border-purple-500/20 rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-purple-500/10"><tr><th className="px-6 py-3 text-gray-400">Process</th><th className="px-6 py-3 text-gray-400">CPU</th><th className="px-6 py-3 text-gray-400">Memory</th></tr></thead>
        <tbody>{topProcesses.map(p => (<tr key={p.pid} className="border-t border-purple-500/10"><td className="px-6 py-3 text-white">{p.name}</td><td className="px-6 py-3 text-cyan-400">{p.cpu_usage.toFixed(1)}%</td><td className="px-6 py-3 text-gray-400">{(p.memory / 1024 / 1024).toFixed(0)} MB</td></tr>))}</tbody>
      </table>
    </div>
  </div>
)

const StartupPage = () => <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full"><h1 className="text-4xl font-bold text-white">Startup Items</h1><p className="text-gray-400 mt-4">Coming soon...</p></div>
const ServicesPage = () => <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full"><h1 className="text-4xl font-bold text-white">Services</h1><p className="text-gray-400 mt-4">Coming soon...</p></div>
const OneClickOptimizePage = ({ analysis }) => <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full"><h1 className="text-4xl font-bold text-white">One Click Optimize</h1><button className="mt-6 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg text-lg font-semibold">⚡ Optimize Now</button>{analysis && <div className="mt-8"><SuggestionsCard suggestions={analysis.suggestions} /></div>}</div>
const JunkCleanerPage = () => <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full"><h1 className="text-4xl font-bold text-white">Junk Cleaner</h1><p className="text-gray-400 mt-4">Coming soon...</p></div>
const DiskOptimizerPage = ({ systemStats }) => <div className="p-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 h-full"><h1 className="text-4xl font-bold text-white">Disk Optimizer</h1>{systemStats && <div className="mt-6 bg-orange-900/30 border border-orange-500/20 rounded-lg p-6"><h3 className="text-white font-semibold mb-4">Disk: {systemStats.disk_usage.toFixed(1)}%</h3><div className="w-full bg-orange-500/20 rounded h-4"><div className="h-full bg-orange-500" style={{width: `${systemStats.disk_usage}%`}} /></div></div>}</div>

const MetricCard = ({ label, value }) => <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-6"><div className="text-gray-400 text-sm mb-2">{label}</div><div className="text-3xl font-bold text-white">{value}</div></div>

const AnomaliesCard = ({ anomalies }) => (
  <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-6">
    <h3 className="text-white font-semibold mb-4">Anomalies ({anomalies?.length || 0})</h3>
    <div className="space-y-3">{anomalies?.slice(0, 3).map((a, idx) => (<div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4"><h4 className="text-white font-semibold">{a.metric}</h4><p className="text-gray-300 text-sm mt-1">{a.description}</p><span className="inline-block mt-2 text-xs font-semibold uppercase px-2 py-1 bg-red-500/20 rounded text-red-300">{a.severity}</span></div>)) || <p className="text-gray-400">No anomalies</p>}</div>
  </div>
)

const SuggestionsCard = ({ suggestions }) => (
  <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-6">
    <h3 className="text-white font-semibold mb-4">Suggestions ({suggestions?.length || 0})</h3>
    <div className="space-y-3">{suggestions?.slice(0, 3).map((s, idx) => (<div key={idx} className="bg-green-500/5 border border-green-500/20 rounded-lg p-4"><h4 className="text-white font-semibold">{s.title}</h4><p className="text-gray-300 text-sm mt-1">{s.description}</p><div className="flex justify-between items-center mt-3"><div className="text-xs text-green-400">+{s.estimated_improvement.toFixed(1)}% improvement</div><div className="text-lg font-bold text-green-400">{s.priority}/10</div></div></div>)) || <p className="text-gray-400">No suggestions</p>}</div>
  </div>
)

export default App
