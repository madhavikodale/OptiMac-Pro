import { useState } from 'react'
import { FiZap, FiRefreshCw, FiCheckCircle } from 'react-icons/fi'

function MemoryOptimizer({ uiMode, memory = 0 }) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState(null)

  const memoryPressure = memory > 80 ? 'Critical' : memory > 60 ? 'High' : memory > 40 ? 'Medium' : 'Low'
  const pressureColor = 
    memory > 80 ? '#EF4444' : 
    memory > 60 ? '#F59E0B' : 
    memory > 40 ? '#3B82F6' : '#10B981'

  const memorySources = [
    { name: 'App Cache', size: '2.1 GB', cleanable: true, icon: '📦' },
    { name: 'Browser Cache', size: '1.8 GB', cleanable: true, icon: '🌐' },
    { name: 'Temporary Files', size: '942 MB', cleanable: true, icon: '📄' },
    { name: 'System Cache', size: '1.2 GB', cleanable: true, icon: '⚙️' },
    { name: 'Inactive RAM', size: '856 MB', cleanable: false, icon: '💾' },
  ]

  const startOptimization = () => {
    setIsOptimizing(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 25
      if (progress >= 100) {
        clearInterval(interval)
        setIsOptimizing(false)
        setOptimizationResult({
          freed: '6.0 GB',
          itemsCleaned: 12847,
          newMemoryUsage: Math.max(20, memory - 25)
        })
      }
    }, 300)
  }

  return (
    <div className={`p-6 rounded-2xl transition ${
      uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${uiMode === 'premium' ? 'gradient-text' : 'text-gray-900'}`}>
          🧠 Advanced Memory Optimizer
        </h2>
        <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
          Real-time memory analysis and intelligent cache clearing
        </p>
      </div>

      {!optimizationResult ? (
        <div className="space-y-4">
          {/* Memory Status */}
          <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'glass' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
                Memory Pressure
              </p>
              <p className="text-sm font-bold" style={{ color: pressureColor }}>
                {memoryPressure}
              </p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${memory}%`,
                  backgroundColor: pressureColor
                }}
              ></div>
            </div>
            <p className={`text-xs mt-2 ${uiMode === 'premium' ? 'text-gray-500' : 'text-gray-600'}`}>
              {Math.round(memory)}% of {16} GB used
            </p>
          </div>

          {/* Optimization Button */}
          <button
            onClick={startOptimization}
            disabled={isOptimizing}
            className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              uiMode === 'premium'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg disabled:opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white disabled:opacity-50'
            }`}
          >
            <FiZap size={20} />
            {isOptimizing ? 'Optimizing...' : 'Optimize Memory Now'}
          </button>

          {/* Memory Sources */}
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
              Memory Usage Breakdown
            </p>
            {memorySources.map((source, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition flex items-center justify-between ${
                  uiMode === 'premium'
                    ? 'glass hover:bg-purple-500/10'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{source.icon}</span>
                  <div>
                    <p className={`text-sm font-medium ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                      {source.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${uiMode === 'premium' ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {source.size}
                  </p>
                  {source.cleanable && (
                    <p className={`text-xs ${uiMode === 'premium' ? 'text-green-400' : 'text-green-600'}`}>
                      Cleanable
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className={`p-3 rounded-lg text-sm ${
            uiMode === 'premium'
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
              : 'bg-blue-50 border border-blue-200 text-blue-900'
          }`}>
            ℹ️ You can safely free up <strong>6.0 GB</strong> without affecting system performance
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Success Message */}
          <div className={`p-4 rounded-lg ${uiMode === 'premium' ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className={uiMode === 'premium' ? 'text-green-400' : 'text-green-600'} size={20} />
              <h3 className={`font-semibold ${uiMode === 'premium' ? 'text-green-400' : 'text-green-900'}`}>
                Optimization Complete!
              </h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
                Freed: <span className="font-bold text-cyan-400">{optimizationResult.freed}</span>
              </p>
              <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
                Items Cleaned: <span className="font-bold">{optimizationResult.itemsCleaned.toLocaleString()}</span>
              </p>
              <p className={uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}>
                New Memory Usage: <span className="font-bold text-green-400">{optimizationResult.newMemoryUsage}%</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setOptimizationResult(null)}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              uiMode === 'premium'
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <FiRefreshCw size={18} />
            Optimize Again
          </button>
        </div>
      )}
    </div>
  )
}

export default MemoryOptimizer
