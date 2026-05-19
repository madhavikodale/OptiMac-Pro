export default function Storage() {
  return (
    <div style={{ width: '100%', padding: '32px', backgroundColor: '#0a0a0a', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Storage</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '14px' }}>View detailed storage breakdown and usage</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Macintosh SSD</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>420 GB / 1000 GB (42%)</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(to right, #06b6d4, #0891b2)', width: '42%' }} />
            </div>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>External Drive</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>780 GB / 2000 GB (39%)</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(to right, #a78bfa, #9333ea)', width: '39%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
