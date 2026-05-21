import React from 'react';
import { motion } from 'framer-motion';

export const PerformanceChart: React.FC = () => {
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.random() * 80 + 10,
    memory: Math.random() * 70 + 20,
  }));

  const getBarHeight = (value: number) => {
    return `${(value / 100) * 100}%`;
  };

  return (
    <div className="card-premium p-8">
      <h2 className="text-xl font-bold text-white mb-6">Performance Timeline</h2>

      <div className="flex items-end justify-between gap-2 h-64">
        {chartData.slice(-12).map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
            <motion.div
              className="w-full bg-gradient-to-t from-premium to-premium-light rounded-t-lg relative"
              initial={{ height: 0 }}
              animate={{ height: getBarHeight(data.cpu) }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, transformOrigin: 'bottom' }}
            />
            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {data.time}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">Peak CPU</p>
          <p className="text-2xl font-bold text-premium-light">
            {Math.max(...chartData.map((d) => d.cpu)).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">Avg Memory</p>
          <p className="text-2xl font-bold text-accent">
            {(
              chartData.reduce((acc, d) => acc + d.memory, 0) / chartData.length
            ).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};
