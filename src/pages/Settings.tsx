import React, { useState } from 'react'
import { Moon, Zap, Bell, Shield, Info, ChevronRight } from 'lucide-react'
import PageLayout from '../components/PageLayout'

interface ToggleProps {
  label: string
  description: string
  icon: React.ElementType
  color: string
  defaultOn?: boolean
  disabled?: boolean
}

function ToggleRow({ label, description, icon: Icon, color, defaultOn = false, disabled = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: `rgba(${color},0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: `rgb(${color})`,
            flexShrink: 0,
          }}
        >
          <Icon size={17} />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '2px' }}>{label}</h4>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{description}</p>
        </div>
      </div>

      <button
        onClick={() => !disabled && setOn(!on)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: on ? `rgb(${color})` : 'rgba(255,255,255,0.1)',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          position: 'relative',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: '3px',
            left: on ? '22px' : '4px',
            transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  return (
    <PageLayout title="Settings" subtitle="Configure your OptiMac Pro preferences" maxWidth="720px">
      {/* Appearance */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
          Appearance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ToggleRow
            label="Dark Mode"
            description="Always enabled for optimal viewing"
            icon={Moon}
            color="107, 114, 128"
            defaultOn={true}
            disabled={true}
          />
        </div>
      </div>

      {/* Optimization */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
          Optimization
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ToggleRow
            label="Auto Optimize"
            description="Run optimization at startup"
            icon={Zap}
            color="6, 182, 212"
            defaultOn={true}
          />
          <ToggleRow
            label="Notifications"
            description="Alert when system needs attention"
            icon={Bell}
            color="245, 158, 11"
            defaultOn={false}
          />
          <ToggleRow
            label="Privacy Shield"
            description="Block trackers and analytics"
            icon={Shield}
            color="74, 222, 128"
            defaultOn={true}
          />
        </div>
      </div>

      {/* About */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
          About
        </h3>
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '800',
                fontSize: '14px',
              }}
            >
              OP
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '2px' }}>OptiMac Pro</h4>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Version 1.0.0</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Check for Updates', value: '' },
              { label: 'License', value: 'MIT' },
              { label: 'Built with', value: 'Tauri + React' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: item.value ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!item.value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{item.label}</span>
                {item.value ? (
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>{item.value}</span>
                ) : (
                  <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
