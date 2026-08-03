import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialData = {
  users: [],
  projects: [],
  project_members: [],
  tasks: [],
  comments: [],
  notifications: []
};

// Seed helper
function seedInitialData(data) {
  const passwordHash = bcrypt.hashSync('password123', 10);
  
  const user1 = {
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password_hash: passwordHash,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    created_at: new Date().toISOString()
  };

  const user2 = {
    id: 'u-2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password_hash: passwordHash,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    created_at: new Date().toISOString()
  };

  const user3 = {
    id: 'u-3',
    name: 'Michael Vance',
    email: 'mike@example.com',
    password_hash: passwordHash,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    created_at: new Date().toISOString()
  };

  data.users.push(user1, user2, user3);

  // Project 1
  const proj1 = {
    id: 'p-1',
    name: 'TaskSync Platform Revamp',
    description: 'Redesigning the primary collaborative workspace UI & real-time messaging pipeline.',
    created_by: user1.id,
    created_at: new Date().toISOString()
  };

  // Project 2
  const proj2 = {
    id: 'p-2',
    name: 'Mobile App Launch v2.0',
    description: 'Cross-platform iOS and Android companion app development for project tracking.',
    created_by: user2.id,
    created_at: new Date().toISOString()
  };

  data.projects.push(proj1, proj2);

  // Members
  data.project_members.push(
    { id: 'pm-1', project_id: proj1.id, user_id: user1.id, role: 'owner', joined_at: new Date().toISOString() },
    { id: 'pm-2', project_id: proj1.id, user_id: user2.id, role: 'member', joined_at: new Date().toISOString() },
    { id: 'pm-3', project_id: proj1.id, user_id: user3.id, role: 'member', joined_at: new Date().toISOString() },
    { id: 'pm-4', project_id: proj2.id, user_id: user2.id, role: 'owner', joined_at: new Date().toISOString() },
    { id: 'pm-5', project_id: proj2.id, user_id: user1.id, role: 'member', joined_at: new Date().toISOString() }
  );

  // Tasks
  const task1 = {
    id: 't-1',
    project_id: proj1.id,
    title: 'Setup WebSocket Real-Time Infrastructure',
    description: 'Implement Socket.IO event channels for board drag-and-drop actions and active presence indicators.',
    status: 'done',
    priority: 'urgent',
    assigned_to: user1.id,
    created_by: user1.id,
    due_date: '2026-08-10',
    position: 0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  };

  const task2 = {
    id: 't-2',
    project_id: proj1.id,
    title: 'Design Dark Mode Glassmorphism Theme',
    description: 'Build a responsive CSS design system featuring floating modals, neon accents, and smooth transitions.',
    status: 'in_progress',
    priority: 'high',
    assigned_to: user2.id,
    created_by: user1.id,
    due_date: '2026-08-15',
    position: 0,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString()
  };

  const task3 = {
    id: 't-3',
    project_id: proj1.id,
    title: 'Implement Task Comments & Activity Log',
    description: 'Allow users to publish rich comments inside task modals with real-time updates.',
    status: 'review',
    priority: 'medium',
    assigned_to: user3.id,
    created_by: user2.id,
    due_date: '2026-08-12',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const task4 = {
    id: 't-4',
    project_id: proj1.id,
    title: 'User Invitation & Group Access Controls',
    description: 'Create user search API and modal for adding existing platform users to project boards.',
    status: 'todo',
    priority: 'medium',
    assigned_to: user1.id,
    created_by: user2.id,
    due_date: '2026-08-18',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  data.tasks.push(task1, task2, task3, task4);

  // Comments
  data.comments.push(
    {
      id: 'c-1',
      task_id: task2.id,
      user_id: user1.id,
      content: "I've drafted the glassmorphism color variables. Let's make sure hover states feel snappy!",
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'c-2',
      task_id: task2.id,
      user_id: user2.id,
      content: "Looks fantastic! I added the custom scrollbar and modal overlay animations.",
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  );

  // Notifications
  data.notifications.push(
    {
      id: 'n-1',
      user_id: user2.id,
      message: 'Alex assigned you to task "Design Dark Mode Glassmorphism Theme"',
      type: 'assignment',
      project_id: proj1.id,
      task_id: task2.id,
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  );
}

class Database {
  constructor() {
    this.data = initialData;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileData = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileData);
      } else {
        seedInitialData(this.data);
        this.save();
      }
    } catch (e) {
      console.error('Failed to load database, initializing defaults:', e);
      seedInitialData(this.data);
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // Users
  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getAllUsers() {
    return this.data.users.map(({ password_hash, ...rest }) => rest);
  }

  createUser({ name, email, password_hash, avatar }) {
    const newUser = {
      id: 'u-' + crypto.randomBytes(4).toString('hex'),
      name,
      email,
      password_hash,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    const { password_hash: _, ...userWithoutPass } = newUser;
    return userWithoutPass;
  }

  // Projects
  getProjectsForUser(userId) {
    const memberProjectIds = this.data.project_members
      .filter(m => m.user_id === userId)
      .map(m => m.project_id);
    
    return this.data.projects
      .filter(p => memberProjectIds.includes(p.id) || p.created_by === userId)
      .map(p => {
        const members = this.getProjectMembers(p.id);
        const tasks = this.data.tasks.filter(t => t.project_id === p.id);
        return {
          ...p,
          members,
          task_count: tasks.length,
          completed_task_count: tasks.filter(t => t.status === 'done').length
        };
      });
  }

  getProjectById(projectId) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (!proj) return null;
    const members = this.getProjectMembers(projectId);
    return { ...proj, members };
  }

  createProject({ name, description, created_by }) {
    const newProj = {
      id: 'p-' + crypto.randomBytes(4).toString('hex'),
      name,
      description: description || '',
      created_by,
      created_at: new Date().toISOString()
    };
    this.data.projects.push(newProj);

    // Add creator as owner member
    this.data.project_members.push({
      id: 'pm-' + crypto.randomBytes(4).toString('hex'),
      project_id: newProj.id,
      user_id: created_by,
      role: 'owner',
      joined_at: new Date().toISOString()
    });

    this.save();
    return this.getProjectById(newProj.id);
  }

  addProjectMember(projectId, userId, role = 'member') {
    const existing = this.data.project_members.find(
      m => m.project_id === projectId && m.user_id === userId
    );
    if (existing) return existing;

    const newMember = {
      id: 'pm-' + crypto.randomBytes(4).toString('hex'),
      project_id: projectId,
      user_id: userId,
      role,
      joined_at: new Date().toISOString()
    };
    this.data.project_members.push(newMember);
    this.save();
    return newMember;
  }

  getProjectMembers(projectId) {
    const memberRecords = this.data.project_members.filter(m => m.project_id === projectId);
    return memberRecords.map(m => {
      const user = this.getUserById(m.user_id);
      return {
        id: m.id,
        user_id: m.user_id,
        role: m.role,
        name: user ? user.name : 'Unknown User',
        email: user ? user.email : '',
        avatar: user ? user.avatar : ''
      };
    });
  }

  isProjectMember(projectId, userId) {
    return this.data.project_members.some(
      m => m.project_id === projectId && m.user_id === userId
    ) || this.data.projects.some(p => p.id === projectId && p.created_by === userId);
  }

  // Tasks
  getTasksByProject(projectId) {
    return this.data.tasks
      .filter(t => t.project_id === projectId)
      .map(t => this.enrichTask(t));
  }

  getTaskById(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return null;
    return this.enrichTask(task);
  }

  enrichTask(task) {
    const assignee = task.assigned_to ? this.getUserById(task.assigned_to) : null;
    const creator = task.created_by ? this.getUserById(task.created_by) : null;
    const commentCount = this.data.comments.filter(c => c.task_id === task.id).length;

    return {
      ...task,
      assignee: assignee ? { id: assignee.id, name: assignee.name, avatar: assignee.avatar, email: assignee.email } : null,
      creator: creator ? { id: creator.id, name: creator.name, avatar: creator.avatar } : null,
      comment_count: commentCount
    };
  }

  createTask({ project_id, title, description, status = 'todo', priority = 'medium', assigned_to, created_by, due_date }) {
    const projectTasks = this.data.tasks.filter(t => t.project_id === project_id && t.status === status);
    const newTask = {
      id: 't-' + crypto.randomBytes(4).toString('hex'),
      project_id,
      title,
      description: description || '',
      status,
      priority,
      assigned_to: assigned_to || null,
      created_by,
      due_date: due_date || null,
      position: projectTasks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.tasks.push(newTask);

    // Create notification if assigned to another user
    if (assigned_to && assigned_to !== created_by) {
      const creator = this.getUserById(created_by);
      this.createNotification({
        user_id: assigned_to,
        message: `${creator ? creator.name : 'Someone'} assigned you to task "${title}"`,
        type: 'assignment',
        project_id,
        task_id: newTask.id
      });
    }

    this.save();
    return this.getTaskById(newTask.id);
  }

  updateTask(taskId, updates) {
    const index = this.data.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;

    const oldTask = this.data.tasks[index];
    const prevAssignee = oldTask.assigned_to;

    this.data.tasks[index] = {
      ...oldTask,
      ...updates,
      updated_at: new Date().toISOString()
    };

    const updatedTask = this.data.tasks[index];

    // Notification on new assignment
    if (updates.assigned_to && updates.assigned_to !== prevAssignee && updates.assigned_to !== updates.updated_by) {
      const updater = updates.updated_by ? this.getUserById(updates.updated_by) : null;
      this.createNotification({
        user_id: updates.assigned_to,
        message: `${updater ? updater.name : 'Someone'} assigned you to task "${updatedTask.title}"`,
        type: 'assignment',
        project_id: updatedTask.project_id,
        task_id: updatedTask.id
      });
    }

    this.save();
    return this.getTaskById(taskId);
  }

  deleteTask(taskId) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
    this.data.comments = this.data.comments.filter(c => c.task_id !== taskId);
    this.save();
    return true;
  }

  // Comments
  getCommentsByTask(taskId) {
    return this.data.comments
      .filter(c => c.task_id === taskId)
      .map(c => {
        const user = this.getUserById(c.user_id);
        return {
          ...c,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  addComment({ task_id, user_id, content }) {
    const newComment = {
      id: 'c-' + crypto.randomBytes(4).toString('hex'),
      task_id,
      user_id,
      content,
      created_at: new Date().toISOString()
    };
    this.data.comments.push(newComment);

    const task = this.getTaskById(task_id);
    const commenter = this.getUserById(user_id);

    // Notify task assignee if someone else comments
    if (task && task.assigned_to && task.assigned_to !== user_id) {
      this.createNotification({
        user_id: task.assigned_to,
        message: `${commenter ? commenter.name : 'Someone'} commented on "${task.title}"`,
        type: 'comment',
        project_id: task.project_id,
        task_id
      });
    }

    this.save();
    
    return {
      ...newComment,
      user: commenter ? { id: commenter.id, name: commenter.name, avatar: commenter.avatar } : null
    };
  }

  // Notifications
  getNotificationsForUser(userId) {
    return this.data.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createNotification({ user_id, message, type = 'general', project_id, task_id }) {
    const notif = {
      id: 'n-' + crypto.randomBytes(4).toString('hex'),
      user_id,
      message,
      type,
      project_id: project_id || null,
      task_id: task_id || null,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.data.notifications.push(notif);
    this.save();
    return notif;
  }

  markNotificationRead(notificationId) {
    const notif = this.data.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.is_read = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    this.save();
    return true;
  }
}

export const db = new Database();
