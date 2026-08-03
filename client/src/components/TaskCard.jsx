import React from 'react';
import { Calendar, MessageSquare, ChevronLeft, ChevronRight, User } from 'lucide-react';

const STATUS_ORDER = ['todo', 'in_progress', 'review', 'done'];

export default function TaskCard({ task, onOpenTask, onMoveTask }) {
  const { id, title, description, priority, status, due_date, assignee, comment_count = 0 } = task;

  const currentIdx = STATUS_ORDER.indexOf(status);
  const prevStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null;
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;

  return (
    <div
      id={`task-card-${id}`}
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(224, 79, 79, 0.16)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(180, 80, 80, 0.05)'
      }}
      onClick={(e) => {
        if (e.target.closest('.move-btn')) return;
        onOpenTask(task);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(224, 79, 79, 0.4)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(180, 80, 80, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(224, 79, 79, 0.16)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(180, 80, 80, 0.05)';
      }}
    >
      {/* Priority Badge & Quick Move */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span className={`badge badge-${priority || 'medium'}`}>
          {priority || 'medium'}
        </span>

        <div style={{ display: 'flex', gap: '4px' }}>
          {prevStatus && (
            <button
              className="btn-icon move-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMoveTask(id, prevStatus);
              }}
              title={`Move to ${prevStatus.replace('_', ' ')}`}
              style={{ width: '26px', height: '26px', borderRadius: '6px' }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
          {nextStatus && (
            <button
              className="btn-icon move-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMoveTask(id, nextStatus);
              }}
              title={`Move to ${nextStatus.replace('_', ' ')}`}
              style={{ width: '26px', height: '26px', borderRadius: '6px' }}
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2d1e1e', margin: '0 0 6px 0', lineHeight: 1.4 }}>
        {title}
      </h4>

      {/* Description Snippet */}
      {description && (
        <p style={{ fontSize: '12px', color: '#6b4c4c', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {description}
        </p>
      )}

      {/* Footer Details */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(224, 79, 79, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#9c7575' }}>
          {due_date && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> {due_date}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={12} /> {comment_count}
          </span>
        </div>

        {/* Assignee Avatar */}
        {assignee ? (
          <img
            src={assignee.avatar}
            alt={assignee.name}
            title={`Assigned to ${assignee.name}`}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(224, 79, 79, 0.5)'
            }}
          />
        ) : (
          <div
            title="Unassigned"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(224, 79, 79, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed rgba(224, 79, 79, 0.3)'
            }}
          >
            <User size={12} style={{ color: '#9c7575' }} />
          </div>
        )}
      </div>
    </div>
  );
}
