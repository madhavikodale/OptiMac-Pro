export default function Network() {
  return (
    <div style={{ width: '100%', padding: '32px', backgroundColor: '#0a0a0a', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Network</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '14px' }}>Monitor network connections and bandwidth</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px' }}>Download Speed</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#06b6d4' }}>45.2 Mbps</p>
          </div>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px' }}>Upload Speed</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#a78bfa' }}>12.8 Mbps</p>
          </div>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px' }}>Ping</p>
            <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#4ade80' }}>28 ms</p>
          </div>
        </div>
      </div>
    </div>
  )
}
