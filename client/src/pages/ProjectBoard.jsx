import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import AddMemberModal from '../components/AddMemberModal';
import { Plus, UserPlus, Filter, Search, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', icon: Clock, color: '#e04f4f', bg: 'var(--column-todo)' },
  { id: 'in_progress', title: 'In Progress', icon: PlayCircle, color: '#ea580c', bg: 'var(--column-progress)' },
  { id: 'review', title: 'Under Review', icon: AlertCircle, color: '#d97706', bg: 'var(--column-review)' },
  { id: 'done', title: 'Completed', icon: CheckCircle2, color: '#059669', bg: 'var(--column-done)' }
];

export default function ProjectBoard({ projectId, onGoDashboard, onProjectLoaded }) {
  const { user, token } = useAuth();
  const { socket } = useSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Filters
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState('todo');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch Project & Tasks
  const loadProjectData = () => {
    if (!token || !projectId) return;

    Promise.all([
      fetch(`/api/projects/${projectId}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/tasks`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([projData, taskData]) => {
        if (projData.project) {
          setProject(projData.project);
          if (onProjectLoaded) onProjectLoaded(projData.project);
        }
        if (taskData.tasks) {
          setTasks(taskData.tasks);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId, token]);

  // Socket.IO Real-time Events
  useEffect(() => {
    if (!socket || !projectId || !user) return;

    socket.emit('project:join', { projectId, userId: user.id });

    const handleTaskCreated = ({ task }) => {
      if (task.project_id === projectId) {
        setTasks(prev => [task, ...prev.filter(t => t.id !== task.id)]);
      }
    };

    const handleTaskUpdated = ({ task }) => {
      if (task.project_id === projectId) {
        setTasks(prev => prev.map(t => t.id === task.id ? task : t));
        if (selectedTask && selectedTask.id === task.id) {
          setSelectedTask(task);
        }
      }
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
    };

    const handleCommentAdded = ({ taskId, comment }) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comment_count: (t.comment_count || 0) + 1 } : t));
    };

    const handleMemberAdded = ({ members }) => {
      setProject(prev => prev ? { ...prev, members } : prev);
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);
    socket.on('comment:added', handleCommentAdded);
    socket.on('project:member_added', handleMemberAdded);

    return () => {
      socket.emit('project:leave', { projectId });
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
      socket.off('comment:added', handleCommentAdded);
      socket.off('project:member_added', handleMemberAdded);
    };
  }, [socket, projectId, user, selectedTask]);

  // Task Handlers
  const handleCreateTask = async (taskData) => {
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (res.ok && data.task) {
      setTasks(prev => [data.task, ...prev]);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (res.ok && data.task) {
      setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    await handleUpdateTask(taskId, {
      ...task,
      status: newStatus
    });
  };

  const handleDeleteTask = async (taskId) => {
    const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setSelectedTask(null);
    }
  };

  const handleAddMember = async (pId, userId) => {
    const res = await fetch(`/api/projects/${pId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: userId })
    });
    const data = await res.json();
    if (res.ok && data.members) {
      setProject(prev => prev ? { ...prev, members: data.members } : prev);
    }
  };

  // Filtering
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: '#6b4c4c' }}>
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: '#e04f4f' }}>
        Project not found or access denied.
      </div>
    );
  }

  const members = project.members || [];

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Board Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#2d1e1e', margin: 0, letterSpacing: '-0.02em' }}>
              {project.name}
            </h1>
            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(224, 79, 79, 0.12)', color: '#e04f4f', border: '1px solid rgba(224, 79, 79, 0.3)', fontWeight: 700 }}>
              Group Board
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6b4c4c', margin: 0 }}>
            {project.description || 'Collaborative task management board.'}
          </p>
        </div>

        {/* Member Avatars & Add Member */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {members.map((m, i) => (
              <img
                key={m.id || i}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.role})`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #f5efe6',
                  marginLeft: i > 0 ? '-8px' : '0'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setIsAddMemberOpen(true)}
            id="add-member-btn"
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            <UserPlus size={15} /> Invite Collaborator
          </button>

          <button
            onClick={() => {
              setCreateInitialStatus('todo');
              setIsCreateTaskOpen(true);
            }}
            id="new-task-btn"
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9c7575' }} />
            <input
              type="text"
              id="search-tasks-input"
              className="input-field"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', padding: '0.45rem 1rem 0.45rem 2.2rem', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} style={{ color: '#9c7575' }} />
            <span style={{ fontSize: '13px', color: '#6b4c4c', fontWeight: 600 }}>Priority:</span>
            <select
              className="input-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: '130px', padding: '0.4rem 0.8rem', fontSize: '13px' }}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#6b4c4c', fontWeight: 600 }}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Kanban 4-Column Board Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'start',
          overflowX: 'auto',
          paddingBottom: '16px'
        }}
      >
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              style={{
                background: col.bg,
                border: '1px solid rgba(224, 79, 79, 0.15)',
                borderRadius: '16px',
                padding: '16px',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={16} style={{ color: col.color }} />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#2d1e1e', margin: 0 }}>
                    {col.title}
                  </h3>
                  <span
                    style={{
                      background: 'rgba(224, 79, 79, 0.12)',
                      color: col.color,
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setCreateInitialStatus(col.id);
                    setIsCreateTaskOpen(true);
                  }}
                  className="btn-icon"
                  title={`Add Task to ${col.title}`}
                  style={{ width: '28px', height: '28px', borderRadius: '8px' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Task Cards Container */}
              <div style={{ flex: 1 }}>
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      border: '1px dashed rgba(224, 79, 79, 0.2)',
                      borderRadius: '12px',
                      padding: '24px 12px',
                      textAlign: 'center',
                      color: '#9c7575',
                      fontSize: '12px'
                    }}
                  >
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onOpenTask={setSelectedTask}
                      onMoveTask={handleMoveTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail & Comments Modal */}
      <TaskModal
        task={selectedTask}
        projectMembers={members}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        initialStatus={createInitialStatus}
        projectMembers={members}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Invite Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        project={project}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
