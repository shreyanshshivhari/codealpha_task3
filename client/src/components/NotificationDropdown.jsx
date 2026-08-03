import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell, CheckCheck, Clock } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose, onSelectProject }) {
  const { notifications, unreadCount, markAllNotificationsRead, markSingleNotificationRead } = useSocket();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: '0',
        marginTop: '8px',
        width: '360px',
        maxHeight: '480px',
        background: 'rgba(255, 253, 250, 0.98)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(224, 79, 79, 0.2)',
        borderRadius: '16px',
        boxShadow: '0 16px 40px rgba(180, 80, 80, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
      className="animate-fade-in"
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(224, 79, 79, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: '#e04f4f' }} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#2d1e1e' }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                background: '#e04f4f',
                color: '#fff',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            id="mark-all-read-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e04f4f',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9c7575', fontSize: '13px' }}>
            No notifications yet
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markSingleNotificationRead(n.id);
                if (n.project_id && onSelectProject) {
                  onSelectProject(n.project_id);
                  onClose();
                }
              }}
              style={{
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '4px',
                background: n.is_read ? 'transparent' : 'rgba(224, 79, 79, 0.06)',
                border: n.is_read ? '1px solid transparent' : '1px solid rgba(224, 79, 79, 0.18)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: n.is_read ? 'transparent' : '#e04f4f',
                  marginTop: '6px',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: n.is_read ? '#6b4c4c' : '#2d1e1e', margin: '0 0 4px 0', lineHeight: 1.4, fontWeight: n.is_read ? 400 : 600 }}>
                  {n.message}
                </p>
                <div style={{ fontSize: '11px', color: '#9c7575', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} /> {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
