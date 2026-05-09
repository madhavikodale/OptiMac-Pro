import React from 'react';
import { motion } from 'framer-motion';
import { Zap, RotateCcw, Trash2, Shield } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { icon: Zap, label: 'Boost Performance', color: 'from-yellow-500 to-orange-500' },
    { icon: RotateCcw, label: 'Clear Cache', color: 'from-blue-500 to-cyan-500' },
    { icon: Trash2, label: 'Clean Junk', color: 'from-red-500 to-pink-500' },
    { icon: Shield, label: 'Security Scan', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="grid grid-cols-4 gap-4"
    >
      {actions.map((action, i) => (
        <motion.button
          key={i}
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0, 240, 255, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-br ${action.color} p-4 rounded-lg text-white font-semibold text-sm flex flex-col items-center gap-2 hover:shadow-lg transition-all group relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <action.icon className="w-6 h-6 relative z-10" />
          <span className="relative z-10">{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
