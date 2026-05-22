import React, { Component, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('OptiMac Pro Error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.hash = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 100%)',
          padding: '32px'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.03) 100%)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)'
            }}>
              <AlertTriangle size={32} strokeWidth={2} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: '1.5' }}>
              {this.state.error?.message || 'An unexpected error occurred in the application.'}
            </p>

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                borderRadius: '10px',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(6,182,212,0.25)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(6,182,212,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(6,182,212,0.25)'
              }}
            >
              <RotateCcw size={16} />
              Return to Dashboard
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
