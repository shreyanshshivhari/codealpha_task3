import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message || 'Failed to register');
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
        padding: '24px'
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
            Join SyncLineApp
          </h2>
          <p style={{ fontSize: '14px', color: '#6e6161', margin: 0 }}>
            Collaborate on group workspace projects in real-time
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
            <label style={{ display: 'block', fontSize: '12px', color: '#6e6161', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e8e8e' }} />
              <input
                type="text"
                id="register-name-input"
                className="input-field"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6e6161', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9e8e8e' }} />
              <input
                type="email"
                id="register-email-input"
                className="input-field"
                placeholder="jane@company.com"
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
                id="register-password-input"
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
            id="register-submit-btn"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}
          >
            {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6e6161' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            id="switch-to-login-btn"
            style={{ background: 'none', border: 'none', color: '#f87171', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
