import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon, label, active = false, delay = 0, isDarkMode = true }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    whileHover={{ x: 4 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      padding: '0.875rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: active 
        ? isDarkMode 
          ? 'rgba(0, 240, 255, 0.15)'
          : 'rgba(59, 130, 246, 0.1)'
        : 'transparent',
      borderLeft: active 
        ? isDarkMode
          ? '2px solid #00f0ff'
          : '2px solid #3b82f6'
        : '2px solid transparent',
      marginBottom: '0.5rem'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = isDarkMode
        ? 'rgba(0, 240, 255, 0.1)'
        : 'rgba(59, 130, 246, 0.08)';
      e.currentTarget.style.borderLeftColor = isDarkMode ? '#00f0ff80' : '#3b82f680';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = active 
        ? isDarkMode
          ? 'rgba(0, 240, 255, 0.15)'
          : 'rgba(59, 130, 246, 0.1)'
        : 'transparent';
      e.currentTarget.style.borderLeftColor = active 
        ? isDarkMode ? '#00f0ff' : '#3b82f6'
        : 'transparent';
    }}
  >
    <span style={{ fontSize: '1.25rem', opacity: active ? 1 : 0.6 }}>{icon}</span>
    <span style={{ 
      fontSize: '0.9375rem',
      fontWeight: active ? '700' : '500',
      color: active 
        ? isDarkMode ? '#00f0ff' : '#3b82f6'
        : isDarkMode ? '#aaa' : '#64748b',
      textShadow: active && isDarkMode ? '0 0 8px rgba(0, 240, 255, 0.5)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      {label}
    </span>
  </motion.div>
);

export default function Sidebar({ isDarkMode = true }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'optimize', icon: '⚙', label: 'Optimize' },
    { id: 'processes', icon: '⟳', label: 'Processes' },
    { id: 'network', icon: '⇆', label: 'Network' },
    { id: 'storage', icon: '▨', label: 'Storage' },
    { id: 'settings', icon: '◉', label: 'Settings' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '240px',
        background: isDarkMode
          ? 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(15, 20, 51, 0.8) 100%)'
          : 'linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: isDarkMode
          ? '1.5px solid rgba(0, 240, 255, 0.15)'
          : '1.5px solid rgba(59, 130, 246, 0.15)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        boxShadow: isDarkMode
          ? '4px 0 20px rgba(0, 240, 255, 0.1)'
          : '4px 0 20px rgba(59, 130, 246, 0.05)',
        zIndex: 50,
        transition: 'all 0.5s ease'
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: isDarkMode
            ? 'rgba(0, 240, 255, 0.1)'
            : 'rgba(59, 130, 246, 0.08)',
          borderRadius: '10px',
          border: isDarkMode
            ? '1px solid rgba(0, 240, 255, 0.2)'
            : '1px solid rgba(59, 130, 246, 0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        whileHover={{ 
          background: isDarkMode
            ? 'rgba(0, 240, 255, 0.15)'
            : 'rgba(59, 130, 246, 0.12)',
          boxShadow: isDarkMode
            ? '0 0 20px rgba(0, 240, 255, 0.2)'
            : '0 0 16px rgba(59, 130, 246, 0.1)'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: isDarkMode
            ? 'linear-gradient(135deg, #00f0ff, #0084ff)'
            : 'linear-gradient(135deg, #3b82f6, #1e40af)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: isDarkMode
            ? '0 0 16px rgba(0, 240, 255, 0.4)'
            : '0 0 12px rgba(59, 130, 246, 0.3)'
        }}>
          ◈
        </div>
        <div>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: '800', 
            color: isDarkMode ? '#00f0ff' : '#3b82f6', 
            textShadow: isDarkMode ? '0 0 8px rgba(0, 240, 255, 0.5)' : 'none',
            transition: 'all 0.5s ease'
          }}>
            OptiMac
          </div>
          <div style={{ 
            fontSize: '0.6875rem', 
            color: isDarkMode ? '#666' : '#94a3b8', 
            fontWeight: '500',
            transition: 'all 0.5s ease'
          }}>
            Pro
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: '0.6875rem', 
          fontWeight: '700', 
          color: isDarkMode ? '#555' : '#cbd5e1', 
          textTransform: 'uppercase', 
          letterSpacing: '0.8px', 
          marginBottom: '1rem', 
          paddingLeft: '0.5rem',
          transition: 'all 0.5s ease'
        }}>
          NAVIGATION
        </div>
        {menuItems.map((item, i) => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}>
            <SidebarItem 
              icon={item.icon} 
              label={item.label}
              active={activeTab === item.id}
              delay={0.3 + i * 0.08}
              isDarkMode={isDarkMode}
            />
          </div>
        ))}
      </div>

      {/* Status Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          borderTop: isDarkMode
            ? '1px solid rgba(0, 240, 255, 0.15)'
            : '1px solid rgba(59, 130, 246, 0.15)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          transition: 'all 0.5s ease'
        }}
      >
        {/* System Status */}
        <div style={{
          padding: '0.875rem',
          background: isDarkMode
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(34, 197, 94, 0.08)',
          borderRadius: '8px',
          border: isDarkMode
            ? '1px solid rgba(34, 197, 94, 0.2)'
            : '1px solid rgba(34, 197, 94, 0.15)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDarkMode
            ? 'rgba(34, 197, 94, 0.15)'
            : 'rgba(34, 197, 94, 0.12)';
          e.currentTarget.style.borderColor = isDarkMode
            ? 'rgba(34, 197, 94, 0.4)'
            : 'rgba(34, 197, 94, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDarkMode
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(34, 197, 94, 0.08)';
          e.currentTarget.style.borderColor = isDarkMode
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(34, 197, 94, 0.15)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e'
              }}
            />
            <span style={{ 
              fontSize: '0.8125rem', 
              fontWeight: '700', 
              color: '#22c55e',
              transition: 'all 0.5s ease'
            }}>
              Optimized
            </span>
          </div>
          <span style={{ 
            fontSize: '0.7rem', 
            color: isDarkMode ? '#666' : '#94a3b8',
            display: 'block',
            transition: 'all 0.5s ease'
          }}>
            System running smoothly
          </span>
        </div>

        {/* Version Info */}
        <div style={{
          fontSize: '0.7rem',
          color: isDarkMode ? '#555' : '#94a3b8',
          padding: '0.75rem',
          background: isDarkMode
            ? 'rgba(0, 240, 255, 0.05)'
            : 'rgba(59, 130, 246, 0.04)',
          borderRadius: '6px',
          borderLeft: isDarkMode ? '2px solid #00f0ff40' : '2px solid #3b82f640',
          fontFamily: 'monospace',
          transition: 'all 0.5s ease'
        }}>
          <div>v1.0.0</div>
          <div style={{ marginTop: '0.25rem' }}>macOS 14.5</div>
        </div>

        {/* Report Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 132, 255, 0.2))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1))',
            border: isDarkMode
              ? '1px solid rgba(0, 240, 255, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            color: isDarkMode ? '#00f0ff' : '#3b82f6',
            fontSize: '0.8125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode
              ? '0 0 16px rgba(0, 240, 255, 0.2)'
              : '0 0 12px rgba(59, 130, 246, 0.1)',
            textShadow: isDarkMode ? '0 0 8px rgba(0, 240, 255, 0.4)' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 132, 255, 0.3))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.15))';
            e.currentTarget.style.boxShadow = isDarkMode
              ? '0 0 24px rgba(0, 240, 255, 0.3)'
              : '0 0 20px rgba(59, 130, 246, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 132, 255, 0.2))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1))';
            e.currentTarget.style.boxShadow = isDarkMode
              ? '0 0 16px rgba(0, 240, 255, 0.2)'
              : '0 0 12px rgba(59, 130, 246, 0.1)';
          }}
        >
          Report an Issue
        </motion.button>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}
