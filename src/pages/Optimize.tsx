export default function Optimize() {
  return (
    <div style={{ width: '100%', padding: '32px', backgroundColor: '#0a0a0a', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>One-Click Optimize</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '14px' }}>Run optimization tasks to boost your system performance</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>🧹 Clear Cache</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>Remove temporary files and cache</p>
            <button style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(to right, #06b6d4, #0891b2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Start
            </button>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>⚡ Boost Performance</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>Optimize system memory and CPU</p>
            <button style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(to right, #a78bfa, #9333ea)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Start
            </button>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>🗑️ Remove Duplicates</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>Find and remove duplicate files</p>
            <button style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(to right, #4ade80, #22c55e)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Start
            </button>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>🔧 System Maintenance</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px' }}>Run system maintenance tasks</p>
            <button style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(to right, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
