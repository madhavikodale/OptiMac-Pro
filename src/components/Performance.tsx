import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart3, TrendingUp } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext'

export const Performance: React.FC = () => {
  const { isDark } = useTheme()
  const metrics = [
    { label: 'Avg CPU', value: '34.2%', trend: '+2.1%', icon: Zap },
    { label: 'Peak Memory', value: '68.5%', trend: '-1.3%', icon: BarChart3 },
    { label: 'Uptime', value: '12d 4h', trend: 'Running', icon: TrendingUp },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-full p-6 md:p-8 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}
    >
      <div>
        <h1 className="text-4xl font-bold mb-2">Performance</h1>
        <p className="text-gray-400">Detailed performance metrics and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl ${isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-black/[0.06]'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="text-cyan-400" size={24} />
                <span className="text-green-400 text-sm font-semibold">{metric.trend}</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  )
}
