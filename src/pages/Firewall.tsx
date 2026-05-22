import React, { useState, useEffect } from 'react'
import {
  Shield, ShieldAlert, ShieldCheck, Globe, Lock, Loader2,
  ArrowRightLeft, Ban, CheckCircle2, Server,
  Eye, EyeOff
} from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { getFirewallStatus, type FirewallStatus } from '../lib/tauri'

function getActionColor(action: string): { bg: string; text: string; border: string } {
  const a = action.toLowerCase()
  if (a.includes('block') || a.includes('stealth') || a.includes('deny')) {
    return { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' }
  }
  if (a.includes('allow') || a.includes('permit')) {
    return { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' }
  }
  return { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)' }
}

function getDirectionIcon(direction: string) {
  const d = direction.toLowerCase()
  if (d.includes('in')) return ArrowRightLeft
  if (d.includes('out')) return ArrowRightLeft
  return Globe
}

function getDirectionColor(direction: string): string {
  const d = direction.toLowerCase()
  if (d.includes('in')) return '#fbbf24'
  if (d.includes('out')) return '#60a5fa'
  return '#a78bfa'
}

export default function Firewall() {
  const [firewall, setFirewall] = useState<FirewallStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRule, setSelectedRule] = useState<number | null>(null)

  useEffect(() => {
    loadFirewall()
  }, [])

  async function loadFirewall() {
    try {
      setLoading(true)
      const data = await getFirewallStatus()
      setFirewall(data)
    } catch (err) {
      console.error('Failed to load firewall status:', err)
    } finally {
      setLoading(false)
    }
  }

  const activeRules = firewall?.rules.length || 0
  const blockRules = firewall?.rules.filter(r =>
    r.action.toLowerCase().includes('block') || r.action.toLowerCase().includes('stealth')
  ).length || 0
  const allowRules = activeRules - blockRules

  if (loading) {
    return (
      <PageLayout title="Firewall" subtitle="Monitor and manage your system firewall">
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '500px', gap: '20px',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 100%)',
            border: '1px solid rgba(6,182,212,0.2)',
          }}>
            <Shield size={32} color="#22d3ee" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Loading Firewall Status
            </p>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>
              Reading system firewall configuration...
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Firewall" subtitle="Monitor and manage your system firewall">
      {/* Status Hero */}
      <div style={{
        borderRadius: '20px',
        border: `1px solid ${firewall?.enabled ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        background: firewall?.enabled
          ? 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(20,184,166,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.04) 100%)',
        padding: '28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        transition: 'all 0.3s',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: firewall?.enabled ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${firewall?.enabled ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          boxShadow: firewall?.enabled ? '0 4px 20px rgba(34,197,94,0.15)' : '0 4px 20px rgba(239,68,68,0.15)',
          flexShrink: 0,
        }}>
          {firewall?.enabled ? (
            <ShieldCheck size={34} color="#4ade80" />
          ) : (
            <ShieldAlert size={34} color="#f87171" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px',
          }}>
            <h2 style={{
              fontSize: '22px', fontWeight: '800',
              color: firewall?.enabled ? '#4ade80' : '#f87171',
              letterSpacing: '-0.3px',
            }}>
              {firewall?.enabled ? 'Firewall Enabled' : 'Firewall Disabled'}
            </h2>
            <span style={{
              fontSize: '11px', fontWeight: '800',
              padding: '4px 10px', borderRadius: '7px',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              background: firewall?.enabled ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: firewall?.enabled ? '#4ade80' : '#f87171',
              border: `1px solid ${firewall?.enabled ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}>
              {firewall?.enabled ? 'Protected' : 'Vulnerable'}
            </span>
          </div>
          <p style={{
            fontSize: '14px', fontWeight: '500',
            color: 'var(--text-muted)', lineHeight: '1.5',
          }}>
            {firewall?.enabled
              ? 'Your system is protected from unauthorized network connections and port scans.'
              : 'Your system may be vulnerable to network attacks. Consider enabling the firewall.'}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        marginBottom: '24px',
      }}>
        {[
          {
            label: 'Active Rules',
            value: activeRules.toString(),
            icon: Server,
            color: '#22d3ee',
          },
          {
            label: 'Block Rules',
            value: blockRules.toString(),
            icon: Ban,
            color: '#f87171',
          },
          {
            label: 'Allow Rules',
            value: allowRules.toString(),
            icon: CheckCircle2,
            color: '#4ade80',
          },
          {
            label: 'Stealth Mode',
            value: firewall?.stealth_mode ? 'Active' : 'Inactive',
            icon: firewall?.stealth_mode ? EyeOff : Eye,
            color: firewall?.stealth_mode ? '#a78bfa' : '#9ca3af',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
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
              width: '40px', height: '40px', borderRadius: '11px',
              background: `linear-gradient(135deg, ${stat.color}18 0%, ${stat.color}08 100%)`,
              border: `1px solid ${stat.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color,
              flexShrink: 0,
            }}>
              <stat.icon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{
                fontSize: '20px', fontWeight: '800',
                color: 'var(--text-primary)', lineHeight: '1.2', letterSpacing: '-0.3px',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px', fontWeight: '600',
                color: 'var(--text-muted)', marginTop: '2px',
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stealth Mode Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '22px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '13px',
            background: firewall?.stealth_mode
              ? 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.08) 100%)'
              : 'linear-gradient(135deg, rgba(107,114,128,0.1) 0%, rgba(75,85,99,0.05) 100%)',
            border: `1px solid ${firewall?.stealth_mode ? 'rgba(168,85,247,0.2)' : 'rgba(107,114,128,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: firewall?.stealth_mode ? '#a78bfa' : '#9ca3af',
            flexShrink: 0,
          }}>
            <Lock size={22} strokeWidth={2} />
          </div>
          <div>
            <div style={{
              fontSize: '16px', fontWeight: '700',
              color: 'var(--text-primary)', marginBottom: '3px',
            }}>
              Stealth Mode
            </div>
            <div style={{
              fontSize: '13px', fontWeight: '500',
              color: 'var(--text-muted)', lineHeight: '1.4',
            }}>
              Prevents your Mac from responding to ping requests and port scans
            </div>
          </div>
        </div>
        <span style={{
          fontSize: '12px', fontWeight: '800',
          padding: '6px 14px', borderRadius: '8px',
          textTransform: 'uppercase', letterSpacing: '0.5px',
          background: firewall?.stealth_mode ? 'rgba(168,85,247,0.12)' : 'rgba(107,114,128,0.1)',
          color: firewall?.stealth_mode ? '#c084fc' : '#9ca3af',
          border: `1px solid ${firewall?.stealth_mode ? 'rgba(168,85,247,0.2)' : 'rgba(107,114,128,0.15)'}`,
          flexShrink: 0,
        }}>
          {firewall?.stealth_mode ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Rules Section */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Rules Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%)',
              border: '1px solid rgba(6,182,212,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#22d3ee',
            }}>
              <Globe size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{
                fontSize: '16px', fontWeight: '700',
                color: 'var(--text-primary)',
              }}>
                Firewall Rules
              </h3>
              <p style={{
                fontSize: '12px', fontWeight: '500',
                color: 'var(--text-muted)', marginTop: '2px',
              }}>
                {activeRules} rules configured
              </p>
            </div>
          </div>
        </div>

        {/* Rules Table */}
        {activeRules === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '60px 20px', gap: '14px',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-input)',
            }}>
              <Server size={24} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '15px', fontWeight: '600',
                color: 'var(--text-muted)',
              }}>
                No firewall rules
              </p>
              <p style={{
                fontSize: '13px', color: 'var(--text-muted)',
                opacity: 0.7, marginTop: '4px',
              }}>
                Your firewall is using default settings
              </p>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Direction', 'Action', 'Protocol', 'Port', 'Application'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '14px 20px',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firewall?.rules.map((rule, index) => {
                  const actionStyle = getActionColor(rule.action)
                  const DirectionIcon = getDirectionIcon(rule.direction)
                  const dirColor = getDirectionColor(rule.direction)
                  const isSelected = selectedRule === index

                  return (
                    <tr
                      key={index}
                      onClick={() => setSelectedRule(isSelected ? null : index)}
                      style={{
                        borderTop: '1px solid var(--border-color)',
                        background: isSelected
                          ? 'linear-gradient(90deg, rgba(6,182,212,0.04) 0%, transparent 60%)'
                          : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'var(--bg-card-hover)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '7px',
                            background: `${dirColor}15`,
                            border: `1px solid ${dirColor}25`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: dirColor,
                            flexShrink: 0,
                          }}>
                            <DirectionIcon size={13} strokeWidth={2.5} />
                          </div>
                          <span style={{
                            fontSize: '13px', fontWeight: '600',
                            color: 'var(--text-primary)',
                          }}>
                            {rule.direction}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '5px 12px', borderRadius: '8px',
                          fontSize: '12px', fontWeight: '700',
                          background: actionStyle.bg,
                          color: actionStyle.text,
                          border: `1px solid ${actionStyle.border}`,
                        }}>
                          {rule.action.toLowerCase().includes('block') ? (
                            <Ban size={11} />
                          ) : (
                            <CheckCircle2 size={11} />
                          )}
                          {rule.action}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontSize: '13px', fontWeight: '600',
                          color: 'var(--text-secondary)',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}>
                          {rule.protocol}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontSize: '13px', fontWeight: '700',
                          color: 'var(--text-primary)',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}>
                          {rule.port}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontSize: '13px', fontWeight: '500',
                          color: 'var(--text-muted)',
                        }}>
                          {rule.app}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
