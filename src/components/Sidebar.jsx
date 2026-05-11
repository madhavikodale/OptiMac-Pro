import { FiHome, FiActivity, FiSettings, FiZap, FiTrash2, FiCpu, FiWifi, FiHardDrive, FiBrain } from 'react-icons/fi'

function Sidebar({ isOpen, uiMode, onTabChange, activeTab }) {
  const menuItems = [
    { id: 'dashboard', icon: FiHome, label: 'Dashboard', category: 'SYSTEM' },
    { id: 'ai-intelligence', icon: FiBrain, label: '🤖 AI Intelligence', category: 'SYSTEM' },
    { id: 'performance', icon: FiActivity, label: 'Performance', category: 'SYSTEM' },
    { id: 'processes', icon: FiCpu, label: 'Processes', category: 'SYSTEM' },
    { id: 'startup', icon: FiSettings, label: 'Startup Items', category: 'SYSTEM' },
    { id: 'services', icon: FiWifi, label: 'Services', category: 'SYSTEM' },
    { id: 'optimize', icon: FiZap, label: 'One Click Optimize', category: 'OPTIMIZATION' },
    { id: 'cleaner', icon: FiTrash2, label: 'Junk Cleaner', category: 'OPTIMIZATION' },
    { id: 'disk', icon: FiHardDrive, label: 'Disk Optimizer', category: 'OPTIMIZATION' },
  ]

  return (
    <aside className={`transition-all duration-500 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden ${uiMode === 'premium' ? 'glass border-r border-purple-500/20' : 'bg-dark-900 border-r border-gray-700'}`}>
      <div className="p-6 h-screen flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold`}>
              ⚡
            </div>
            <span className="text-xl font-bold text-white">OptiMac</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-6 flex-1">
          {['SYSTEM', 'OPTIMIZATION'].map((category) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {menuItems.filter(item => item.category === category).map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <li key={item.id}>
                      <button 
                        onClick={() => {
                          console.log('Clicked:', item.id)
                          onTabChange(item.id)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500'
                            : 'text-gray-300 hover:bg-purple-500/10 hover:text-cyan-400'
                        }`}>
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`border-t pt-4 ${uiMode === 'premium' ? 'border-purple-500/20' : 'border-gray-700'}`}>
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
  )
}

export default Sidebar
