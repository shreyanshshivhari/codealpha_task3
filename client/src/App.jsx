import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';

function MainApp() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          color: '#94a3b8',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto'
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          Initializing SyncLineApp Workspace...
        </div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <SocketProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Navbar
          currentProject={activeProject}
          onGoDashboard={() => {
            setCurrentProjectId(null);
            setActiveProject(null);
          }}
          onSelectProject={(id) => {
            setCurrentProjectId(id);
          }}
        />

        <main>
          {currentProjectId ? (
            <ProjectBoard
              projectId={currentProjectId}
              onGoDashboard={() => {
                setCurrentProjectId(null);
                setActiveProject(null);
              }}
              onProjectLoaded={(proj) => setActiveProject(proj)}
            />
          ) : (
            <Dashboard
              onSelectProject={(id) => {
                setCurrentProjectId(id);
              }}
            />
          )}
        </main>
      </div>
    </SocketProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
