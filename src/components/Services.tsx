import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, AlertCircle, CheckCircle } from 'lucide-react';

interface Service {
  name: string;
  status: 'running' | 'stopped';
  type: 'system' | 'user';
  description: string;
}

import { useTheme } from '../contexts/ThemeContext'

export const Services: React.FC = () => {
  const { isDark } = useTheme()
  const [services, setServices] = useState<Service[]>([
    { name: 'Bluetooth', status: 'running', type: 'system', description: 'Bluetooth connectivity service' },
    { name: 'WiFi Service', status: 'running', type: 'system', description: 'Wireless network connection' },
    { name: 'Audio Service', status: 'running', type: 'system', description: 'System audio output control' },
    { name: 'Update Service', status: 'stopped', type: 'system', description: 'Software update checker' },
    { name: 'Cloud Sync', status: 'running', type: 'user', description: 'Cloud storage synchronization' },
    { name: 'VPN Service', status: 'stopped', type: 'user', description: 'Virtual private network' },
  ])

  const toggleService = (index: number) => {
    const newServices = [...services]
    newServices[index].status = newServices[index].status === 'running' ? 'stopped' : 'running'
    setServices(newServices)
  }

  const runningCount = services.filter((s) => s.status === 'running').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-full p-6 md:p-8 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}
    >
      <div>
        <h1 className="text-4xl font-bold mb-2">System Services</h1>
        <p className="text-gray-400">Manage background services and processes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className={`p-6 rounded-2xl ${isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-black/[0.06]'}`}
        >
          <p className="text-gray-400 text-sm mb-2">Running Services</p>
          <p className="text-3xl font-bold text-green-400">{runningCount}</p>
          <p className="text-gray-500 text-xs mt-2">of {services.length} total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl ${isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-black/[0.06]'}`}
        >
          <p className="text-gray-400 text-sm mb-2">Stopped Services</p>
          <p className="text-3xl font-bold text-orange-400">{services.length - runningCount}</p>
          <p className="text-gray-500 text-xs mt-2">inactive</p>
        </motion.div>
      </div>

      {/* Services List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mt-8 rounded-2xl overflow-hidden ${isDark ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-black/[0.06]'}`}
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Active Services</h2>
        </div>

        <div className="divide-y divide-white/5">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + idx * 0.05 }}
              className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center">
                  {service.status === 'running' ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <AlertCircle className="text-orange-400" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-gray-500 text-xs">{service.description}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Type: <span className="text-gray-400">{service.type}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleService(idx)}
                className={`p-3 rounded-lg transition-all ${
                  service.status === 'running'
                    ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Power size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
