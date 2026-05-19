export default function Settings() {
  return (
    <div style={{ width: '100%', padding: '32px', backgroundColor: '#0a0a0a', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '14px' }}>Configure your OptiMac Pro preferences</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '600px' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Mode</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Always enabled</p>
              </div>
              <input type="checkbox" checked disabled style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>Auto Optimize</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Run optimization at startup</p>
              </div>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>About</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>OptiMac Pro v1.0.0</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Premium macOS System Optimizer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
