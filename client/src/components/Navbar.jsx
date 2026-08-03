import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NotificationDropdown from './NotificationDropdown';
import { LayoutGrid, LogOut, Bell, Radio } from 'lucide-react';

export default function Navbar({ currentProject, onGoDashboard, onSelectProject }) {
  const { user, logout } = useAuth();
  const { connected, unreadCount } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid rgba(248, 113, 113, 0.16)',
        background: 'rgba(251, 248, 243, 0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Brand & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          onClick={onGoDashboard}
          id="nav-brand"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(248, 113, 113, 0.35)'
            }}
          >
            <LayoutGrid size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#1f1919' }}>
            SyncLineApp
          </span>
        </div>

        {currentProject && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6e6161' }}>
            <span>/</span>
            <button
              onClick={onGoDashboard}
              style={{ background: 'none', border: 'none', color: '#6e6161', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              Projects
            </button>
            <span>/</span>
            <span style={{ color: '#f87171', fontWeight: 700 }}>{currentProject.name}</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* WebSocket Connection Status */}
        <div
          title={connected ? "Socket.io Connected" : "Connecting Socket..."}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: connected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '12px',
            color: connected ? '#10b981' : '#d97706'
          }}
        >
          <Radio size={12} className={connected ? "" : "animate-pulse"} />
          <span style={{ fontWeight: 600 }}>{connected ? 'Live Sync' : 'Connecting'}</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="notification-bell-btn"
            className="btn-icon"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#f87171',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fbf8f3'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            onSelectProject={onSelectProject}
          />
        </div>

        {/* Profile Pill */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px', borderLeft: '1px solid rgba(248, 113, 113, 0.16)' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(248, 113, 113, 0.4)'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1f1919' }}>{user.name}</span>
              <span style={{ fontSize: '11px', color: '#6e6161' }}>{user.email}</span>
            </div>
            <button
              onClick={logout}
              id="logout-btn"
              className="btn-icon"
              title="Log Out"
              style={{ width: '34px', height: '34px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
