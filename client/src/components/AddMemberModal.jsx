import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Search, UserPlus, Check } from 'lucide-react';

export default function AddMemberModal({ isOpen, project, onClose, onAddMember }) {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (isOpen && token) {
      fetch(`/api/auth/users?query=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.users) {
            setUsers(data.users);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, searchQuery, token]);

  if (!isOpen || !project) return null;

  const currentMemberUserIds = (project.members || []).map(m => m.user_id);

  const handleAdd = async (userId) => {
    setAddingId(userId);
    try {
      await onAddMember(project.id, userId);
    } catch (err) {
      console.error('Failed to add member:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(45, 30, 30, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          background: 'rgba(255, 253, 250, 0.98)',
          borderRadius: '20px',
          border: '1px solid rgba(224, 79, 79, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(180, 80, 80, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={22} style={{ color: '#e04f4f' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1e1e', margin: 0 }}>
              Add Team Member
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9c7575' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search platform users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '13px' }}
          />
        </div>

        <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {users.map(u => {
            const isMember = currentMemberUserIds.includes(u.id);
            return (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                  border: '1px solid rgba(224, 79, 79, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#2d1e1e' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b4c4c' }}>{u.email}</div>
                  </div>
                </div>

                {isMember ? (
                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Member
                  </span>
                ) : (
                  <button
                    className="btn-primary"
                    disabled={addingId === u.id}
                    onClick={() => handleAdd(u.id)}
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    {addingId === u.id ? 'Adding...' : 'Add'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
