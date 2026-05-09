import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProcessMonitor({ processes, isDarkMode = true }) {
  const [expandedProcess, setExpandedProcess] = useState(null);

  const ProcessRow = ({ process, index, isExpanded, onToggle }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onToggle}
      style={{
        padding: '1rem',
        background: isExpanded 
          ? isDarkMode 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.1))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.08))'
          : isDarkMode
          ? 'rgba(26, 31, 58, 0.5)'
          : 'rgba(226, 232, 240, 0.4)',
        border: isExpanded 
          ? '1.5px solid rgba(139, 92, 246, 0.4)'
          : isDarkMode
          ? '1px solid rgba(0, 240, 255, 0.15)'
          : '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '0.75rem',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)'
      }}
      whileHover={{
        background: isDarkMode 
          ? 'rgba(139, 92, 246, 0.12)'
          : 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        boxShadow: isDarkMode
          ? '0 8px 24px rgba(139, 92, 246, 0.15)'
          : '0 8px 24px rgba(139, 92, 246, 0.08)'
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#8b5cf6',
              boxShadow: '0 0 8px #8b5cf6'
            }}
          />
          <h4 style={{ 
            fontSize: '0.9375rem', 
            fontWeight: '700', 
            color: isDarkMode ? '#e0e0ff' : '#3b82f6', 
            margin: 0 
          }}>
            {process.name}
          </h4>
        </div>
        <div style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.8rem',
          color: isDarkMode ? '#888' : '#64748b'
        }}>
          <span>CPU: <span style={{ color: '#8b5cf6', fontWeight: '600' }}>{process.cpu.toFixed(1)}%</span></span>
          <span>Memory: <span style={{ color: '#a78bfa', fontWeight: '600' }}>{process.mem.toFixed(1)} GB</span></span>
        </div>
      </div>

      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: '1.25rem',
          color: '#8b5cf6',
          opacity: 0.7
        }}
      >
        ▼
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(15, 20, 51, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(226, 232, 240, 0.5) 0%, rgba(203, 213, 225, 0.3) 100%)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode
          ? '1.5px solid rgba(139, 92, 246, 0.3)'
          : '1.5px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '12px',
        padding: '1.5rem',
        gridColumn: '1 / 2',
        transition: 'all 0.5s ease'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>⟳</span>
        <h3 style={{ 
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#8b5cf6',
          textShadow: isDarkMode ? '0 0 10px rgba(139, 92, 246, 0.4)' : 'none',
          margin: 0
        }}>
          Processes
        </h3>
        <div style={{
          marginLeft: 'auto',
          fontSize: '0.75rem',
          color: isDarkMode ? '#666' : '#94a3b8',
          background: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)',
          padding: '0.375rem 0.75rem',
          borderRadius: '20px',
          border: isDarkMode ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.15)'
        }}>
          267 total
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {processes?.map((process, i) => (
          <ProcessRow
            key={i}
            process={process}
            index={i}
            isExpanded={expandedProcess === i}
            onToggle={() => setExpandedProcess(expandedProcess === i ? null : i)}
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)',
          borderRadius: '8px',
          border: isDarkMode ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.15)',
          fontSize: '0.8rem',
          color: isDarkMode ? '#888' : '#64748b',
          fontFamily: 'monospace',
          lineHeight: '1.6',
          transition: 'all 0.5s ease'
        }}
      >
        <div>Real-time process monitoring</div>
        <div style={{ marginTop: '0.5rem', color: isDarkMode ? '#666' : '#94a3b8', fontSize: '0.75rem' }}>Last updated: now</div>
      </motion.div>
    </motion.div>
  );
}
