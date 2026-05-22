import React from 'react'

export default function LoadingFallback() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          margin: '0 auto 20px',
          animation: 'pulse 1.5s ease-in-out infinite',
          boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500' }}>
          Loading...
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.9); opacity: 0.7; }
          }
        `}</style>
      </div>
    </div>
  )
}
