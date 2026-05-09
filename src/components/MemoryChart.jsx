import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

function MemoryChart({ uiMode, memory = 0 }) {
  const memoryData = [
    { name: 'Compressed', value: 2.1, color: '#00D9FF' },
    { name: 'App Memory', value: 3.2, color: '#6366F1' },
    { name: 'Cached', value: 4.5, color: '#EC4899' },
    { name: 'Wired', value: 2.8, color: '#10B981' },
    { name: 'Free', value: 3.4, color: '#F59E0B' },
  ]

  const systemPerfData = [
    { name: 'OptiMac', cpu: 8.2, gpu: 2.1 },
    { name: 'Chrome', cpu: 12.5, gpu: 5.3 },
    { name: 'VS Code', cpu: 4.8, gpu: 1.2 },
    { name: 'Docker', cpu: 15.6, gpu: 0.8 },
    { name: 'Spotify', cpu: 3.2, gpu: 0.5 },
    { name: 'Slack', cpu: 6.3, gpu: 2.1 },
  ]

  const colors = ['#00D9FF', '#6366F1', '#EC4899', '#10B981', '#F59E0B']

  return (
    <div className="space-y-6">
      {/* Memory Usage Chart */}
      <div className={`p-6 rounded-2xl transition ${
        uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          Memory Usage
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memoryData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={uiMode === 'premium' ? '#333' : '#E5E7EB'} />
              <XAxis dataKey="name" stroke={uiMode === 'premium' ? '#999' : '#666'} fontSize={12} />
              <YAxis stroke={uiMode === 'premium' ? '#999' : '#666'} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: uiMode === 'premium' ? '#1F2937' : '#F9FAFB',
                  border: `1px solid ${uiMode === 'premium' ? '#444' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
                labelStyle={{ color: uiMode === 'premium' ? '#FFF' : '#000' }}
              />
              <Bar dataKey="value" fill="#8884D8" radius={[6, 6, 0, 0]}>
                {memoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {memoryData.map((item, idx) => (
            <div key={idx} className={`p-2 rounded-lg text-center ${
              uiMode === 'premium' ? 'glass' : 'bg-gray-50'
            }`}>
              <p className={`text-xs font-medium ${uiMode === 'premium' ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.name}
              </p>
              <p className="text-sm font-bold" style={{ color: item.color }}>
                {item.value} GB
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Performance Chart */}
      <div className={`p-6 rounded-2xl transition ${
        uiMode === 'premium' ? 'glass neon-glow' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${uiMode === 'premium' ? 'text-white' : 'text-gray-900'}`}>
          System Performance (CPU & GPU)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={systemPerfData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={uiMode === 'premium' ? '#333' : '#E5E7EB'} />
              <XAxis dataKey="name" stroke={uiMode === 'premium' ? '#999' : '#666'} fontSize={12} />
              <YAxis stroke={uiMode === 'premium' ? '#999' : '#666'} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: uiMode === 'premium' ? '#1F2937' : '#F9FAFB',
                  border: `1px solid ${uiMode === 'premium' ? '#444' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
                labelStyle={{ color: uiMode === 'premium' ? '#FFF' : '#000' }}
              />
              <Legend />
              <Bar dataKey="cpu" fill="#00D9FF" radius={[6, 6, 0, 0]} />
              <Bar dataKey="gpu" fill="#EC4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default MemoryChart
