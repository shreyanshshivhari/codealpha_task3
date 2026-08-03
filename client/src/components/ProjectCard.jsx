import React from 'react';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onOpen }) {
  const { id, name, description, members = [], task_count = 0, completed_task_count = 0 } = project;
  const progress = task_count > 0 ? Math.round((completed_task_count / task_count) * 100) : 0;

  return (
    <div
      onClick={() => onOpen(id)}
      id={`project-card-${id}`}
      className="glass-panel"
      style={{
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '220px',
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid rgba(224, 79, 79, 0.18)',
        boxShadow: '0 4px 16px rgba(180, 80, 80, 0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(224, 79, 79, 0.45)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(180, 80, 80, 0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(224, 79, 79, 0.18)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(180, 80, 80, 0.08)';
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2d1e1e', margin: 0 }}>
            {name}
          </h3>
          <ArrowRight size={18} style={{ color: '#e04f4f' }} />
        </div>
        <p style={{ fontSize: '13px', color: '#6b4c4c', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b4c4c', marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} style={{ color: '#059669' }} /> {completed_task_count} of {task_count} tasks
            </span>
            <span style={{ fontWeight: 700, color: '#e04f4f' }}>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(224, 79, 79, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #e04f4f 0%, #ea580c 100%)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Footer: Member Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {members.slice(0, 4).map((m, i) => (
              <img
                key={m.id || i}
                src={m.avatar}
                alt={m.name}
                title={m.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #f5efe6',
                  marginLeft: i > 0 ? '-8px' : '0'
                }}
              />
            ))}
            {members.length > 4 && (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(224, 79, 79, 0.15)',
                  color: '#e04f4f',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #f5efe6',
                  marginLeft: '-8px'
                }}
              >
                +{members.length - 4}
              </div>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#6b4c4c', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={13} /> {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
        </div>
      </div>
    </div>
  );
}
