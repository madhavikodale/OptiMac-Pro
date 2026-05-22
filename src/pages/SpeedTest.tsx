import React, { useState, useEffect, useRef } from 'react'
import {
  Gauge, Download, Upload, Clock, Loader2, Play,
  Server, Activity, RotateCcw, Signal
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { runSpeedTest, type SpeedTestResult } from '../lib/tauri'

function getSpeedColor(mbps: number): string {
  if (mbps > 100) return '#4ade80'
  if (mbps > 50) return '#22d3ee'
  if (mbps > 20) return '#fbbf24'
  return '#f87171'
}

function getSpeedLabel(mbps: number): string {
  if (mbps > 100) return 'Excellent'
  if (mbps > 50) return 'Good'
  if (mbps > 20) return 'Fair'
  return 'Poor'
}

function getPingColor(ping: number): string {
  if (ping < 30) return '#4ade80'
  if (ping < 60) return '#22d3ee'
  if (ping < 100) return '#fbbf24'
  return '#f87171'
}

function getPingLabel(ping: number): string {
  if (ping < 30) return 'Ultra Low'
  if (ping < 60) return 'Low'
  if (ping < 100) return 'Moderate'
  return 'High'
}

function SpeedGauge({ value, max, color, label, size = 140 }: {
  value: number
  max: number
  color: string
  label: string
  size?: number
}) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(value / max, 1) * 0.75) * circumference
  const center = size / 2

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(135deg)' }}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontSize: size > 120 ? '28px' : '22px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
          lineHeight: '1.1',
        }}>
          {value.toFixed(1)}
        </span>
        <span style={{
          fontSize: size > 120 ? '11px' : '10px',
          fontWeight: '700',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginTop: '2px',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}

export default function SpeedTest() {
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle')
  const [history, setHistory] = useState<SpeedTestResult[]>([])

  async function handleRunTest() {
    setRunning(true)
    setProgress(0)
    setResult(null)
    setPhase('ping')

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 8 + 2, 95)
        if (next < 30) setPhase('ping')
        else if (next < 60) setPhase('download')
        else setPhase('upload')
        return next
      })
    }, 250)

    try {
      const data = await runSpeedTest()
      setResult(data)
      setHistory((prev) => [data, ...prev].slice(0, 5))
      setProgress(100)
      setPhase('complete')
    } catch (err) {
      console.error('Speed test failed:', err)
    } finally {
      clearInterval(interval)
      setRunning(false)
    }
  }

  const phaseLabels: Record<string, { label: string; sub: string }> = {
    ping: { label: 'Measuring Latency', sub: 'Testing response time to nearest server' },
    download: { label: 'Testing Download', sub: 'Measuring download throughput' },
    upload: { label: 'Testing Upload', sub: 'Measuring upload throughput' },
    complete: { label: 'Test Complete', sub: 'Results ready' },
  }

  return (
    <PageLayout title="Speed Test" subtitle="Measure your internet connection performance">
      {/* Hero Test Area */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px',
      }}>
        {/* Main Gauge or Button */}
        {result && !running ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <SpeedGauge
              value={result.download_mbps}
              max={200}
              color={getSpeedColor(result.download_mbps)}
              label="Download"
              size={160}
            />
            <SpeedGauge
              value={result.upload_mbps}
              max={100}
              color={getSpeedColor(result.upload_mbps)}
              label="Upload"
              size={140}
            />
            <SpeedGauge
              value={result.ping_ms}
              max={150}
              color={getPingColor(result.ping_ms)}
              label="Ping"
              size={120}
            />
          </div>
        ) : running ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 100%)',
              border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={36} color="#22d3ee" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {phaseLabels[phase]?.label || 'Testing...'}
              </p>
              <p style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-muted)',
              }}>
                {phaseLabels[phase]?.sub || ''}
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 100%)',
              border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(6,182,212,0.15)',
            }}>
              <Gauge size={36} color="#22d3ee" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                Ready to Test
              </p>
              <p style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-muted)',
              }}>
                Measure ping, download, and upload speeds
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {running && (
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{
              height: '6px',
              background: 'var(--bg-input)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                borderRadius: '3px',
                transition: 'width 0.3s ease-out',
                boxShadow: '0 0 12px rgba(6,182,212,0.3)',
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
            }}>
              {['Ping', 'Download', 'Upload'].map((step, i) => (
                <span key={step} style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: (phase === 'ping' && i === 0) ||
                    (phase === 'download' && i <= 1) ||
                    (phase === 'upload' && i <= 2) ||
                    phase === 'complete'
                    ? '#22d3ee'
                    : 'var(--text-muted)',
                  transition: 'color 0.3s',
                }}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRunTest}
          disabled={running}
          style={{
            padding: '14px 36px',
            borderRadius: '14px',
            border: 'none',
            background: running
              ? 'var(--bg-input)'
              : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            color: running ? 'var(--text-muted)' : '#fff',
            fontSize: '15px',
            fontWeight: '700',
            fontFamily: 'inherit',
            cursor: running ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: running ? 'none' : '0 4px 20px rgba(6,182,212,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!running) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(6,182,212,0.4)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = running ? 'none' : '0 4px 20px rgba(6,182,212,0.3)'
          }}
        >
          {running ? (
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          ) : result ? (
            <RotateCcw size={18} />
          ) : (
            <Play size={18} />
          )}
          {running ? 'Testing...' : result ? 'Run Again' : 'Start Test'}
        </button>
      </div>

      {/* Results Cards */}
      {result && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '24px',
        }}>
          {[
            {
              label: 'Download',
              value: `${result.download_mbps.toFixed(1)} Mbps`,
              sub: getSpeedLabel(result.download_mbps),
              icon: Download,
              color: getSpeedColor(result.download_mbps),
            },
            {
              label: 'Upload',
              value: `${result.upload_mbps.toFixed(1)} Mbps`,
              sub: getSpeedLabel(result.upload_mbps),
              icon: Upload,
              color: getSpeedColor(result.upload_mbps),
            },
            {
              label: 'Ping',
              value: `${result.ping_ms.toFixed(0)} ms`,
              sub: getPingLabel(result.ping_ms),
              icon: Clock,
              color: getPingColor(result.ping_ms),
            },
            {
              label: 'Jitter',
              value: `${result.jitter_ms.toFixed(1)} ms`,
              sub: result.jitter_ms < 10 ? 'Stable' : 'Variable',
              icon: Activity,
              color: result.jitter_ms < 10 ? '#4ade80' : '#fbbf24',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.borderColor = 'var(--border-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--border-color)'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${stat.color}18 0%, ${stat.color}08 100%)`,
                border: `1px solid ${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
              }}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: stat.color,
                  letterSpacing: '-0.3px',
                  lineHeight: '1.2',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  display: 'inline-block',
                  background: `${stat.color}15`,
                  color: stat.color,
                  border: `1px solid ${stat.color}25`,
                }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Server Info */}
      {result?.server && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          transition: 'all 0.3s',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hover)'
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%)',
            border: '1px solid rgba(6,182,212,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22d3ee',
            flexShrink: 0,
          }}>
            <Server size={16} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}>
              Test Server
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}>
              {result.server}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <Clock size={16} style={{ color: 'var(--text-muted)' }} />
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}>
              Recent Tests
            </h3>
          </div>
          <div>
            {history.slice(1).map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 20px',
                  borderTop: i > 0 ? '1px solid var(--border-color)' : 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  width: '24px',
                  flexShrink: 0,
                }}>
                  #{i + 2}
                </span>
                <div style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                }}>
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px',
                    }}>
                      Download
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: getSpeedColor(h.download_mbps),
                    }}>
                      {h.download_mbps.toFixed(1)} Mbps
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px',
                    }}>
                      Upload
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: getSpeedColor(h.upload_mbps),
                    }}>
                      {h.upload_mbps.toFixed(1)} Mbps
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px',
                    }}>
                      Ping
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: getPingColor(h.ping_ms),
                    }}>
                      {h.ping_ms.toFixed(0)} ms
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
