import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { emitToProject, emitToUser } from '../websocket.js';

const router = express.Router({ mergeParams: true });

// Get all tasks for a project
router.get('/', authenticateToken, (req, res) => {
  try {
    const { projectId } = req.params;
    if (!db.isProjectMember(projectId, req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tasks = db.getTasksByProject(projectId);
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task in project
router.post('/', authenticateToken, (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, assigned_to, due_date } = req.body;

    if (!db.isProjectMember(projectId, req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = db.createTask({
      project_id: projectId,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      assigned_to,
      created_by: req.user.id,
      due_date
    });

    // Real-time broadcast to project room
    emitToProject(projectId, 'task:created', { task });

    // Real-time notification if assigned
    if (assigned_to && assigned_to !== req.user.id) {
      const notifs = db.getNotificationsForUser(assigned_to);
      const latestNotif = notifs[0];
      if (latestNotif) {
        emitToUser(assigned_to, 'notification:new', latestNotif);
      }
    }

    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:taskId', authenticateToken, (req, res) => {
  try {
    const { taskId } = req.params;
    const existingTask = db.getTaskById(taskId);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!db.isProjectMember(existingTask.project_id, req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, status, priority, assigned_to, due_date, position } = req.body;

    const updatedTask = db.updateTask(taskId, {
      title,
      description,
      status,
      priority,
      assigned_to,
      due_date,
      position,
      updated_by: req.user.id
    });

    // Emit update event to all users connected to project
    emitToProject(existingTask.project_id, 'task:updated', { task: updatedTask });

    // Emit notification to newly assigned user if applicable
    if (assigned_to && assigned_to !== existingTask.assigned_to && assigned_to !== req.user.id) {
      const notifs = db.getNotificationsForUser(assigned_to);
      if (notifs[0]) {
        emitToUser(assigned_to, 'notification:new', notifs[0]);
      }
    }

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:taskId', authenticateToken, (req, res) => {
  try {
    const { taskId } = req.params;
    const existingTask = db.getTaskById(taskId);

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!db.isProjectMember(existingTask.project_id, req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.deleteTask(taskId);

    emitToProject(existingTask.project_id, 'task:deleted', { taskId, projectId: existingTask.project_id });

    res.json({ success: true, taskId });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
