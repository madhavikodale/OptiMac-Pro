export default function Processes() {
  const processes = [
    { pid: 1234, name: 'Google Chrome', cpu: 23.4, memory: 1856 },
    { pid: 5678, name: 'Visual Studio Code', cpu: 8.2, memory: 892 },
    { pid: 9012, name: 'Finder', cpu: 2.1, memory: 234 },
    { pid: 3456, name: 'Spotify', cpu: 5.3, memory: 456 },
    { pid: 7890, name: 'Safari', cpu: 12.7, memory: 678 },
  ]

  return (
    <div style={{ width: '100%', padding: '32px', backgroundColor: '#0a0a0a', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Processes</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', fontSize: '14px' }}>Manage running applications and processes</p>

        <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>Process Name</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>PID</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>CPU %</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>Memory MB</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px', color: 'white' }}>{p.name}</td>
                  <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{p.pid}</td>
                  <td style={{ padding: '16px', color: '#06b6d4' }}>{p.cpu}%</td>
                  <td style={{ padding: '16px', color: '#a78bfa' }}>{p.memory} MB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
