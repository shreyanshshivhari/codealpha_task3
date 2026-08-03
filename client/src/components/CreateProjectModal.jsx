import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Search, Check, FolderPlus } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onCreateProject }) {
  const { token, user: currentUser } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetch(`/api/auth/users?query=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.users) {
            setAvailableUsers(data.users.filter(u => u.id !== currentUser.id));
          }
        })
        .catch(console.error);
    }
  }, [isOpen, searchQuery, token, currentUser]);

  if (!isOpen) return null;

  const toggleUserSelection = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUserIds(prev => [...prev, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreateProject({
        name: name.trim(),
        description: description.trim(),
        member_ids: selectedUserIds
      });
      setName('');
      setDescription('');
      setSelectedUserIds([]);
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
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
          maxWidth: '540px',
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
            <FolderPlus size={22} style={{ color: '#e04f4f' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2d1e1e', margin: 0 }}>
              Create Group Project Space
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b4c4c', marginBottom: '6px', fontWeight: 600 }}>
              Project Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Q3 Mobile App Launch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b4c4c', marginBottom: '6px', fontWeight: 600 }}>
              Description
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="What is the main objective of this group project?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Member Invitation Search */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6b4c4c', marginBottom: '6px', fontWeight: 600 }}>
              Invite Group Collaborators
            </label>

            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9c7575' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search team members by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '13px' }}
              />
            </div>

            <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid rgba(224, 79, 79, 0.15)', borderRadius: '10px', padding: '6px', background: 'rgba(245, 239, 230, 0.5)' }}>
              {availableUsers.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: '#9c7575', fontSize: '12px' }}>
                  No members found
                </div>
              ) : (
                availableUsers.map(u => {
                  const isSelected = selectedUserIds.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleUserSelection(u.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(224, 79, 79, 0.12)' : 'transparent',
                        marginBottom: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={u.avatar} alt={u.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2d1e1e' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: '#6b4c4c' }}>{u.email}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: isSelected ? 'none' : '1px solid rgba(224, 79, 79, 0.3)',
                          background: isSelected ? '#e04f4f' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && <Check size={14} color="#fff" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
