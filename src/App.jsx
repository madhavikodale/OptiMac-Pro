import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import Sidebar from './components/Sidebar';
import MetricsGrid from './components/MetricsGrid';
import ProcessMonitor from './components/ProcessMonitor';
import AdvancedMonitor from './components/AdvancedMonitor';
import './App.css';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [metrics, setMetrics] = useState({
    cpu: { total: 23.2, cores: [55.0, 52.4, 45.0, 38.2], temp: 30.8, load: '5.79 / 9.50 / 9.60' },
    memory: { used: 81.0, free: 19.0, swap: 89.4, total: 13.0, avail: 3.0 },
    disk: { intr: 94.0, read: 55.4, write: 0.4, total: 433, used: 406 },
    power: { level: 99.0, health: 78, status: 'Discharging', time: '1:59', watts: 27, temp: 30.8 },
    network: { down: 0.01, up: 0.35, ip: '192.168.1.110' },
    processes: [
      { name: 'WindowServer', cpu: 44.6, mem: 12.5 },
      { name: 'logoptionsd', cpu: 29.5, mem: 8.3 },
      { name: 'Python', cpu: 14.1, mem: 5.2 },
    ],
  });

  useEffect(() => {
    // Fetch initial data from Tauri backend
    const fetchMetrics = async () => {
      try {
        const data = await invoke('update_system_metrics');
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();

    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      fetchMetrics();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const darkBg = 'linear-gradient(135deg, #0a0e27 0%, #0f1433 25%, #1a0f2e 50%, #0f1433 75%, #0a0e27 100%)';
  const lightBg = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%, #f8fafc 100%)';

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode ? darkBg : lightBg,
      backgroundSize: '400% 400%',
      color: isDarkMode ? 'white' : '#1a202c',
      overflow: 'hidden',
      display: 'flex',
      animation: 'gradientShift 15s ease infinite',
      transition: 'all 0.5s ease'
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: isDarkMode ? 0.03 : 0.02,
        pointerEvents: 'none',
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, .05) 25%, rgba(0, 240, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, .05) 75%, rgba(0, 240, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, .05) 25%, rgba(0, 240, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, .05) 75%, rgba(0, 240, 255, .05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
        animation: 'gridShift 20s linear infinite',
        transition: 'all 0.5s ease'
      }} />

      {/* Radial Glow */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        animation: 'float 10s ease-in-out infinite',
        transition: 'all 0.5s ease'
      }} />

      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: isDarkMode
          ? 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        animation: 'float 12s ease-in-out infinite reverse',
        transition: 'all 0.5s ease'
      }} />

      <Sidebar isDarkMode={isDarkMode} />

      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        position: 'relative', 
        zIndex: 10,
        scrollBehavior: 'smooth'
      }}>
        {/* Premium Header with Traffic Lights */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backdropFilter: 'blur(20px)',
            backgroundColor: isDarkMode ? 'rgba(10, 14, 39, 0.5)' : 'rgba(248, 250, 252, 0.6)',
            borderBottom: isDarkMode ? '1.5px solid rgba(0, 240, 255, 0.15)' : '1.5px solid rgba(59, 130, 246, 0.15)',
            padding: '1.5rem 2rem',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0, 240, 255, 0.08)' : '0 8px 32px rgba(59, 130, 246, 0.08)',
            transition: 'all 0.5s ease'
          }}
        >
          {/* macOS Traffic Light Controls */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            left: '2rem',
            display: 'flex',
            gap: '0.75rem',
            zIndex: 50
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {}} // Close window
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#ef5350',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 83, 80, 0.4)',
                transition: 'all 0.3s ease'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {}} // Minimize window
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#fdd835',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(253, 216, 53, 0.4)',
                transition: 'all 0.3s ease'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                background: '#66bb6a',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(102, 187, 106, 0.4)',
                transition: 'all 0.3s ease'
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '60px' }}>
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: '800', 
                  color: isDarkMode ? '#00f0ff' : '#3b82f6',
                  margin: 0,
                  textShadow: isDarkMode ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none',
                  letterSpacing: '-1px',
                  transition: 'all 0.5s ease'
                }}
              >
                Mole Status
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  fontSize: '0.9rem', 
                  color: isDarkMode ? '#888' : '#64748b', 
                  margin: '0.5rem 0 0 0',
                  transition: 'all 0.5s ease'
                }}
              >
                MacBook Pro · Apple M1 Pro (16GPU) · 16 GB
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: 'right' }}
            >
              <motion.p 
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: isDarkMode ? '#00f0ff' : '#3b82f6',
                  margin: 0,
                  fontFamily: 'monospace',
                  textShadow: isDarkMode ? '0 0 16px rgba(0, 240, 255, 0.3)' : 'none',
                  transition: 'all 0.5s ease'
                }}
              >
                {new Date().toLocaleTimeString()}
              </motion.p>
              <p style={{ 
                fontSize: '0.8rem', 
                color: isDarkMode ? '#666' : '#94a3b8', 
                margin: '0.25rem 0 0 0',
                transition: 'all 0.5s ease'
              }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* ASCII Mascot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '1rem',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(139, 92, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
              border: isDarkMode 
                ? '1.5px solid rgba(0, 240, 255, 0.2)'
                : '1.5px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              color: isDarkMode ? 'rgba(0, 240, 255, 0.6)' : 'rgba(59, 130, 246, 0.6)',
              lineHeight: '1.8',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.5s ease'
            }}
          >
            <pre style={{ margin: 0, fontWeight: '500', letterSpacing: '1px' }}>{`    /\\_/\\
   / . . \\
    \\ === /
   (__m__m(__/`}</pre>
          </motion.div>

          {/* Metrics Grid */}
          <MetricsGrid metrics={metrics} isDarkMode={isDarkMode} />

          {/* Dual Panel Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <ProcessMonitor processes={metrics.processes} isDarkMode={isDarkMode} />
            <AdvancedMonitor metrics={metrics} isDarkMode={isDarkMode} />
          </div>

          {/* Bottom Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1.5rem',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.03) 100%)',
              backdropFilter: 'blur(20px)',
              border: isDarkMode
                ? '1.5px solid rgba(34, 197, 94, 0.3)'
                : '1.5px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(34, 197, 94, 0.1)'
                : '0 8px 32px rgba(34, 197, 94, 0.05)',
              transition: 'all 0.5s ease'
            }}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 8px #22c55e', '0 0 16px #22c55e', '0 0 8px #22c55e'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#22c55e',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#22c55e' }}>Optimized</div>
              <p style={{ 
                fontSize: '0.8rem', 
                color: isDarkMode ? '#888' : '#64748b', 
                margin: '0.25rem 0 0 0',
                transition: 'all 0.5s ease'
              }}>System is running smoothly</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.625rem 1.25rem',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2))'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                border: isDarkMode
                  ? '1px solid rgba(34, 197, 94, 0.4)'
                  : '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isDarkMode
                  ? '0 0 16px rgba(34, 197, 94, 0.2)'
                  : '0 0 8px rgba(34, 197, 94, 0.1)',
                textShadow: isDarkMode ? '0 0 8px rgba(34, 197, 94, 0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.3))'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2))'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))';
              }}
            >
              View Details →
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gridShift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Smooth Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
