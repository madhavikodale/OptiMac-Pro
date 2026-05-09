import React from 'react';
import { motion } from 'framer-motion';

export default function AdvancedMonitor({ metrics, isDarkMode = true }) {
  const stats = [
    { label: 'System Uptime', value: '2h 46m', icon: '⏱', color: '#06b6d4' },
    { label: 'Temperature', value: `${metrics.power.temp.toFixed(1)}°C`, icon: '🌡', color: '#f59e0b' },
    { label: 'Fan Speed', value: 'Auto', icon: '◯', color: '#22c55e' },
    { label: 'Performance', value: 'Good', icon: '▲', color: '#00f0ff' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(15, 20, 51, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(226, 232, 240, 0.5) 0%, rgba(203, 213, 225, 0.3) 100%)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode
          ? '1.5px solid rgba(0, 240, 255, 0.3)'
          : '1.5px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        padding: '1.5rem',
        gridColumn: '2 / 3',
        transition: 'all 0.5s ease'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>◈</span>
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: '700',
          color: isDarkMode ? '#00f0ff' : '#3b82f6',
          textShadow: isDarkMode ? '0 0 10px rgba(0, 240, 255, 0.4)' : 'none',
          margin: 0,
          transition: 'all 0.5s ease'
        }}>
          System Status
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            style={{
              padding: '1rem',
              background: isDarkMode
                ? `linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0.04) 100%)`
                : `linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)`,
              border: isDarkMode
                ? `1.5px solid ${stat.color}30`
                : `1.5px solid ${stat.color}20`,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{
              borderColor: isDarkMode ? `${stat.color}80` : `${stat.color}50`,
              boxShadow: isDarkMode
                ? `0 0 16px ${stat.color}20`
                : `0 0 12px ${stat.color}15`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', opacity: 0.8 }}>{stat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: isDarkMode ? '#888' : '#64748b', 
                  marginBottom: '0.25rem', 
                  fontWeight: '500',
                  transition: 'all 0.5s ease'
                }}>
                  {stat.label}
                </div>
                <div style={{ 
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  color: stat.color,
                  textShadow: isDarkMode ? `0 0 8px ${stat.color}40` : 'none',
                  fontFamily: 'monospace',
                  transition: 'all 0.5s ease'
                }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ 
          fontSize: '0.9rem', 
          fontWeight: '700', 
          color: isDarkMode ? '#00f0ff' : '#3b82f6', 
          marginBottom: '1rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          transition: 'all 0.5s ease'
        }}>
          Activity Timeline
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { time: '10:03 AM', event: 'System optimized', type: 'success' },
            { time: '09:45 AM', event: 'Cache cleared', type: 'info' },
            { time: '09:22 AM', event: 'Update completed', type: 'success' },
            { time: '08:15 AM', event: 'System startup', type: 'info' }
          ].map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: isDarkMode
                  ? 'rgba(0, 240, 255, 0.05)'
                  : 'rgba(59, 130, 246, 0.05)',
                borderRadius: '6px',
                border: isDarkMode
                  ? '1px solid rgba(0, 240, 255, 0.1)'
                  : '1px solid rgba(59, 130, 246, 0.1)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                background: isDarkMode
                  ? 'rgba(0, 240, 255, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                borderColor: isDarkMode
                  ? 'rgba(0, 240, 255, 0.3)'
                  : 'rgba(59, 130, 246, 0.2)',
                x: 4
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: entry.type === 'success' ? '#22c55e' : '#00f0ff',
                  boxShadow: entry.type === 'success' ? '0 0 8px #22c55e' : '0 0 8px #00f0ff'
                }}
              />
              <span style={{ 
                color: isDarkMode ? '#aaa' : '#64748b', 
                fontWeight: '600', 
                minWidth: '80px',
                transition: 'all 0.5s ease'
              }}>
                {entry.time}
              </span>
              <span style={{ 
                color: entry.type === 'success' ? '#22c55e' : '#00f0ff',
                transition: 'all 0.5s ease'
              }}>
                {entry.event}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alert Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.04) 100%)',
          border: isDarkMode
            ? '1.5px solid rgba(34, 197, 94, 0.3)'
            : '1.5px solid rgba(34, 197, 94, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        whileHover={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%)',
          borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.4)',
          boxShadow: isDarkMode
            ? '0 0 16px rgba(34, 197, 94, 0.15)'
            : '0 0 12px rgba(34, 197, 94, 0.1)'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            flexShrink: 0
          }}
        />
        <div>
          <div style={{ 
            fontSize: '0.8125rem', 
            fontWeight: '700', 
            color: '#22c55e',
            transition: 'all 0.5s ease'
          }}>
            All Systems Green
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: isDarkMode ? '#666' : '#94a3b8', 
            marginTop: '0.25rem',
            transition: 'all 0.5s ease'
          }}>
            No critical alerts
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
