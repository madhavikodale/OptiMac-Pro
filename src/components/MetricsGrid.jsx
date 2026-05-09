import React from 'react';
import { motion } from 'framer-motion';

const HUDCard = ({ icon, title, children, delay = 0, accent = '#00f0ff', isDarkMode = true }) => {
  const darkStyle = {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(15, 20, 51, 0.4) 100%)',
    border: `1.5px solid ${accent}40`,
    boxShadow: `0 8px 32px ${accent}15`
  };

  const lightStyle = {
    background: 'linear-gradient(135deg, rgba(226, 232, 240, 0.5) 0%, rgba(203, 213, 225, 0.3) 100%)',
    border: `1.5px solid ${accent}30`,
    boxShadow: `0 8px 32px ${accent}08`
  };

  const style = isDarkMode ? darkStyle : lightStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ 
        y: -6,
        boxShadow: `0 20px 60px ${accent}33`
      }}
      style={{
        ...style,
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}80`;
        e.currentTarget.style.background = isDarkMode
          ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(15, 20, 51, 0.5) 100%)'
          : 'linear-gradient(135deg, rgba(226, 232, 240, 0.7) 0%, rgba(203, 213, 225, 0.5) 100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${accent}40`;
        e.currentTarget.style.background = isDarkMode
          ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(15, 20, 51, 0.4) 100%)'
          : 'linear-gradient(135deg, rgba(226, 232, 240, 0.5) 0%, rgba(203, 213, 225, 0.3) 100%)';
      }}
    >
      {/* Glow effect */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          opacity: 0.1,
          background: `radial-gradient(circle at top right, ${accent}, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
        {icon && <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>{icon}</span>}
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '700', 
          color: accent,
          textShadow: isDarkMode ? `0 0 10px ${accent}40` : 'none',
          letterSpacing: '0.5px',
          margin: 0
        }}>{title}</h3>
      </div>
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
};

const GlowBar = ({ label, value, color = '#22c55e', max = 100, isDarkMode = true }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    style={{ marginBottom: '0.875rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
      <span style={{ color: isDarkMode ? '#aaa' : '#64748b', fontWeight: '500', letterSpacing: '0.3px' }}>{label}</span>
      <motion.span 
        animate={{ color: [color, '#ffffff', color] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color, fontWeight: '700', fontFamily: 'monospace' }}
      >
        {value.toFixed(1)}%
      </motion.span>
    </div>
    <div style={{
      height: '6px',
      background: isDarkMode
        ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)'
        : 'linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0.03) 100%)',
      borderRadius: '9999px',
      overflow: 'hidden',
      border: isDarkMode ? `1px solid ${color}30` : `1px solid ${color}20`,
      boxShadow: isDarkMode ? `inset 0 0 8px ${color}20` : `inset 0 0 4px ${color}10`
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: isDarkMode ? `0 0 16px ${color}, inset 0 0 8px ${color}40` : `0 0 8px ${color}`,
          borderRadius: '9999px',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          animation: 'shimmer 2s infinite'
        }} />
      </motion.div>
    </div>
  </motion.div>
);

export default function MetricsGrid({ metrics, isDarkMode = true }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* CPU Card */}
      <HUDCard icon="◉" title="CPU" delay={0.1} accent="#00f0ff" isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <GlowBar label="Total" value={metrics.cpu.total} color="#00f0ff" isDarkMode={isDarkMode} />
          <GlowBar label="Core 1" value={metrics.cpu.cores[0]} color="#06b6d4" isDarkMode={isDarkMode} />
          <GlowBar label="Core 3" value={metrics.cpu.cores[1]} color="#06b6d4" isDarkMode={isDarkMode} />
          <GlowBar label="Core 2" value={metrics.cpu.cores[2]} color="#06b6d4" isDarkMode={isDarkMode} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '0.75rem',
              color: isDarkMode ? '#888' : '#64748b',
              fontFamily: 'monospace',
              marginTop: '0.875rem',
              padding: '0.625rem',
              background: isDarkMode ? 'rgba(0, 240, 255, 0.08)' : 'rgba(59, 130, 246, 0.08)',
              borderRadius: '6px',
              border: isDarkMode ? '1px solid rgba(0, 240, 255, 0.15)' : '1px solid rgba(59, 130, 246, 0.15)',
              lineHeight: '1.6'
            }}
          >
            <div>Load: {metrics.cpu.load}</div>
            <div style={{ marginTop: '0.25rem', color: isDarkMode ? '#666' : '#94a3b8' }}>(8P+2E)</div>
          </motion.div>
        </div>
      </HUDCard>

      {/* Memory Card */}
      <HUDCard icon="⊟" title="Memory" delay={0.2} accent="#a78bfa" isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <GlowBar label="Used" value={metrics.memory.used} color="#a78bfa" isDarkMode={isDarkMode} />
          <GlowBar label="Free" value={metrics.memory.free} color="#22c55e" isDarkMode={isDarkMode} />
          <GlowBar label="Swap" value={metrics.memory.swap} color="#ef4444" isDarkMode={isDarkMode} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ 
              fontSize: '0.8rem', 
              color: isDarkMode ? '#888' : '#64748b', 
              marginTop: '0.875rem', 
              lineHeight: '1.8',
              padding: '0.625rem',
              background: isDarkMode ? 'rgba(167, 139, 250, 0.08)' : 'rgba(167, 139, 250, 0.06)',
              borderRadius: '6px',
              borderLeft: '2px solid #a78bfa'
            }}
          >
            <div><span style={{ color: '#a78bfa' }}>Total:</span> {metrics.memory.total.toFixed(1)} GB / 16.0 GB</div>
            <div><span style={{ color: '#a78bfa' }}>Available:</span> {metrics.memory.avail.toFixed(1)} GB</div>
          </motion.div>
        </div>
      </HUDCard>

      {/* Disk Card */}
      <HUDCard icon="▨" title="Disk I/O" delay={0.3} accent="#f59e0b" isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <GlowBar label="Usage" value={metrics.disk.intr} color="#ef4444" isDarkMode={isDarkMode} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div style={{
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
              color: '#f59e0b',
              display: 'flex',
              gap: '0.25rem',
              fontWeight: '700'
            }}>
              {'█'.repeat(Math.ceil(metrics.disk.read / 15))}
            </div>
            <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: '0.8rem' }}>{metrics.disk.read.toFixed(1)} MB/s</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div style={{
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
              color: '#22c55e',
              display: 'flex',
              gap: '0.25rem',
              fontWeight: '700'
            }}>
              {'█'.repeat(Math.ceil(metrics.disk.write / 0.1))}
            </div>
            <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: '0.8rem' }}>{metrics.disk.write.toFixed(1)} MB/s</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              fontSize: '0.8rem', 
              color: isDarkMode ? '#666' : '#94a3b8', 
              marginTop: '0.75rem',
              padding: '0.5rem',
              background: isDarkMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
              borderRadius: '4px'
            }}
          >
            {metrics.disk.used}G / {metrics.disk.total}G
          </motion.div>
        </div>
      </HUDCard>

      {/* Power Card */}
      <HUDCard icon="⚡" title="Power" delay={0.4} accent="#ec4899" isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <GlowBar label="Level" value={metrics.power.level} color="#22c55e" isDarkMode={isDarkMode} />
          <GlowBar label="Health" value={metrics.power.health} color="#ec4899" isDarkMode={isDarkMode} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ 
              fontSize: '0.8rem', 
              color: isDarkMode ? '#888' : '#64748b', 
              marginTop: '0.875rem',
              lineHeight: '1.8',
              padding: '0.625rem',
              background: isDarkMode ? 'rgba(236, 72, 153, 0.08)' : 'rgba(236, 72, 153, 0.06)',
              borderRadius: '6px',
              borderLeft: '2px solid #ec4899',
              fontFamily: 'monospace'
            }}
          >
            <div>{metrics.power.status} · {metrics.power.time} · {metrics.power.watts}W</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: isDarkMode ? '#666' : '#94a3b8' }}>Service: Recommended</div>
          </motion.div>
        </div>
      </HUDCard>

      {/* Processes Card */}
      <HUDCard title="Top Processes" delay={0.5} accent="#8b5cf6" isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
          {metrics.processes?.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem',
                background: isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)',
                borderRadius: '6px',
                border: isDarkMode ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.06)';
                e.currentTarget.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)';
              }}
            >
              <span style={{ color: isDarkMode ? '#aaa' : '#64748b', fontWeight: '500' }}>{p.name}</span>
              <span style={{ color: '#8b5cf6', fontWeight: '700', fontFamily: 'monospace' }}>{p.cpu.toFixed(1)}%</span>
            </motion.div>
          ))}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ color: isDarkMode ? '#555' : '#cbd5e1', marginTop: '0.75rem', fontSize: '0.75rem', textAlign: 'center' }}
          >
            Total: 267 processes
          </motion.div>
        </div>
      </HUDCard>

      {/* Network Card */}
      <HUDCard icon="⇆" title="Network" delay={0.6} accent="#06b6d4" isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Download */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: '0.8125rem', fontWeight: '500' }}>↓ Down</span>
            <div style={{
              width: '56px',
              height: '20px',
              background: isDarkMode
                ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)'
                : 'linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0.03) 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDarkMode ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(6, 182, 212, 0.2)',
              overflow: 'hidden'
            }}>
              <motion.div
                animate={{ scaleX: [0.3, 1, 0.5, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  height: '6px',
                  width: '100%',
                  background: '#06b6d4',
                  borderRadius: '2px',
                  boxShadow: isDarkMode ? '0 0 8px #06b6d4' : '0 0 4px #06b6d4',
                  transformOrigin: 'center'
                }}
              />
            </div>
            <span style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: '700', fontFamily: 'monospace' }}>
              {metrics.network.down.toFixed(2)} MB/s
            </span>
          </div>

          {/* Upload */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: isDarkMode ? '#888' : '#64748b', fontSize: '0.8125rem', fontWeight: '500' }}>↑ Up</span>
            <div style={{
              width: '56px',
              height: '20px',
              background: isDarkMode
                ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)'
                : 'linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0.03) 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDarkMode ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(6, 182, 212, 0.2)',
              overflow: 'hidden'
            }}>
              <motion.div
                animate={{ scaleX: [0.5, 0.8, 1, 0.4, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  height: '6px',
                  width: '100%',
                  background: '#06b6d4',
                  borderRadius: '2px',
                  boxShadow: isDarkMode ? '0 0 8px #06b6d4' : '0 0 4px #06b6d4',
                  transformOrigin: 'center'
                }}
              />
            </div>
            <span style={{ color: '#06b6d4', fontSize: '0.75rem', fontWeight: '700', fontFamily: 'monospace' }}>
              {metrics.network.up.toFixed(2)} MB/s
            </span>
          </div>

          {/* IP Address */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              fontSize: '0.8rem', 
              color: isDarkMode ? '#666' : '#94a3b8', 
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: isDarkMode ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.06)',
              borderRadius: '4px',
              fontFamily: 'monospace',
              borderLeft: '2px solid #06b6d4'
            }}
          >
            IP: {metrics.network.ip}
          </motion.div>
        </div>
      </HUDCard>
    </div>
  );
}
