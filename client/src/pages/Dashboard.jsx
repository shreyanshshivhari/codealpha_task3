import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { Plus, Search, FolderKanban, CheckCircle2, Clock } from 'lucide-react';

export default function Dashboard({ onSelectProject }) {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchProjects = () => {
    if (!token) return;
    fetch('/api/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjects(data.projects);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const handleCreateProject = async (projectData) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (res.ok && data.project) {
      setProjects(prev => [data.project, ...prev]);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTasks = projects.reduce((acc, p) => acc + (p.task_count || 0), 0);
  const totalCompleted = projects.reduce((acc, p) => acc + (p.completed_task_count || 0), 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2d1e1e', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Welcome back, {user ? user.name : 'User'} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#6b4c4c', margin: 0 }}>
            Manage group project spaces, assign team tasks, and collaborate in real-time.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          id="create-project-btn"
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          <Plus size={18} /> Create Group Project
        </button>
      </div>

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(224, 79, 79, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderKanban size={22} style={{ color: '#e04f4f' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#2d1e1e' }}>{projects.length}</div>
            <div style={{ fontSize: '12px', color: '#6b4c4c' }}>Total Group Projects</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} style={{ color: '#ea580c' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#2d1e1e' }}>{totalTasks}</div>
            <div style={{ fontSize: '12px', color: '#6b4c4c' }}>Active Workspace Tasks</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} style={{ color: '#059669' }} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#2d1e1e' }}>{totalCompleted}</div>
            <div style={{ fontSize: '12px', color: '#6b4c4c' }}>Completed Deliverables</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1e1e', margin: 0 }}>
          Your Collaborative Workspaces
        </h2>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9c7575' }} />
          <input
            type="text"
            id="search-projects-input"
            className="input-field"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b4c4c' }}>
          Loading workspace projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '20px' }}>
          <FolderKanban size={48} style={{ color: '#9c7575', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2d1e1e', marginBottom: '8px' }}>
            No Projects Found
          </h3>
          <p style={{ fontSize: '14px', color: '#6b4c4c', maxWidth: '400px', margin: '0 auto 24px auto' }}>
            {searchQuery ? "No workspace projects match your search criteria." : "Get started by creating your first collaborative project space."}
          </p>
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} /> Create Project Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredProjects.map(p => (
            <ProjectCard key={p.id} project={p} onOpen={onSelectProject} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
