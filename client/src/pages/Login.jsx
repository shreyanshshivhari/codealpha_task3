import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError(err.message || 'Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          background: '#ffffff',
          boxShadow: '0 20px 50px rgba(248, 113, 113, 0.12)',
          borderRadius: '24px',
          border: '1px solid rgba(248, 113, 113, 0.2)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 4px 16px rgba(248, 113, 113, 0.35)'
            }}
          >
            <LayoutGrid size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1f1919', margin: '0 0 6px 0' }}>
            Welcome to SyncLineApp
          </h2>
          <p style={{ fontSize: '14px', color: '#6e6161', margin: 0 }}>
            Collaborative Project Management & Real-Time Kanban
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6e6161', marginBottom: '6px', fontWeight: 600 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e8e8e' }} />
              <input
                type="email"
                id="login-email-input"
                className="input-field"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6e6161', marginBottom: '6px', fontWeight: 600 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e8e8e' }} />
              <input
                type="password"
                id="login-password-input"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}
          >
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Accounts Quick Login */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(248, 113, 113, 0.15)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', textAlign: 'center' }}>
            ⚡ Instant Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleDemoLogin('alex@example.com')}
              className="btn-secondary"
              style={{ padding: '6px', fontSize: '12px', justifyContent: 'center' }}
            >
              Alex (Owner)
            </button>
            <button
              onClick={() => handleDemoLogin('sarah@example.com')}
              className="btn-secondary"
              style={{ padding: '6px', fontSize: '12px', justifyContent: 'center' }}
            >
              Sarah (Lead)
            </button>
            <button
              onClick={() => handleDemoLogin('mike@example.com')}
              className="btn-secondary"
              style={{ padding: '6px', fontSize: '12px', justifyContent: 'center' }}
            >
              Mike (Dev)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6e6161' }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            id="switch-to-register-btn"
            style={{ background: 'none', border: 'none', color: '#f87171', fontWeight: 700, cursor: 'pointer' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
