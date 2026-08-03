# SyncLineApp 🚀 - Collaborative Project Management Tool

**SyncLineApp** is a modern, real-time, full-stack collaborative project management platform built for **CodeAlpha Task 3**. Inspired by industry-leading workspace tools like Trello and Asana, SyncLineApp enables team members to create group projects, manage interactive Kanban boards, assign tasks with priority levels, communicate via task comment streams, and stay updated with live WebSockets notifications.

Designed with a warm **Light Theme** aesthetic featuring a clean **beige background** (`#fbf8f3`) and pastel **light red accents** (`#f87171`).

---

## ✨ Features Breakdown

### 🔐 1. Authentication & Demo Accounts
- **JWT-Based Authentication**: Secure registration, login, session persistence, and password hashing (`bcryptjs`).
- **Instant Demo Login**: One-click demo login buttons for instant evaluation:
  - 👑 **Alex Rivera** (`alex@example.com`) — Project Owner
  - 👩‍💻 **Sarah Chen** (`sarah@example.com`) — Team Lead
  - 👨‍💻 **Michael Vance** (`mike@example.com`) — Developer

### 📁 2. Group Projects & Collaborator Management
- **Workspace Project Creation**: Create group project spaces with custom titles and descriptions.
- **Collaborator Invitations**: Search team members by name/email and add them to project boards in real time.
- **Progress Tracking**: Automatic project completion progress bars showing deliverable counts.

### 📋 3. Interactive Kanban Board & Task Cards
- **4 Status Columns**: `To Do`, `In Progress`, `Under Review`, and `Completed`.
- **Task Assignment**: Assign tasks to specific collaborators with member avatar badges.
- **Priority Indicators**: Visual badges for `Urgent`, `High`, `Medium`, and `Low` priority levels.
- **Quick Status Transfers**: Single-click column movement controls.
- **Filters & Search**: Live title/description filtering and priority drop-down filters.

### 💬 4. Task Detail Modal & Live Discussions
- **Task Detail Card**: Full editing suite for title, description, status column, priority level, assignee, and due date.
- **Real-Time Comment Stream**: Task-specific comment threads allowing team members to communicate effectively.

### ⚡ 5. WebSockets Real-Time Sync & Notifications
- **Live Board Updates**: Instant Socket.IO broadcasting when tasks are created, updated, moved, or deleted across connected sessions.
- **Notification Drawer**: Unread badge counters, instant toast alerts, and single/all-read notification drawers.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Lucide React Icons, Socket.io-client, CSS Variables Design Token System |
| **Backend** | Node.js, Express.js, Socket.IO Server |
| **Database** | Persistent SQLite Data Layer (`sqlite3`) with pre-populated seed workspace data |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/shreyanshshivhari/codealpha_task3.git
cd codealpha_task3
```

### 2. Install Dependencies
Install dependencies for both root (server) and client:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Run the Development Server

Start the **Backend API & WebSockets server** (Port 5000):
```bash
node server/index.js
```

In a second terminal window, start the **Frontend Vite Dev Server** (Port 3000):
```bash
cd client
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📦 Production Single-Port Deployment

To build the client assets and run a unified production server on a single port:

```bash
# 1. Build client bundle
cd client && npm run build && cd ..

# 2. Start unified Express + Socket.IO server
node server/index.js
```
Open **`http://localhost:5000`** in your browser.

---

## 🔌 API Endpoint Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/auth/users` | Search team members for project invitations |

### Project Routes (`/api/projects`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch user's workspace group projects |
| `POST` | `/api/projects` | Create a new group project |
| `GET` | `/api/projects/:id` | Fetch specific project details & member list |
| `POST` | `/api/projects/:id/members` | Invite member to project |

### Task Routes (`/api/projects/:projectId/tasks`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects/:projectId/tasks` | Fetch tasks for a project board |
| `POST` | `/api/projects/:projectId/tasks` | Create a new task card |
| `PUT` | `/api/projects/:projectId/tasks/:id` | Update task status, priority, description, or assignee |
| `DELETE` | `/api/projects/:projectId/tasks/:id` | Delete a task card |

### Comment Routes (`/api/comments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/comments/task/:taskId` | Fetch discussion comments for a task |
| `POST` | `/api/comments/task/:taskId` | Post a new comment to a task card |

---

## 📄 License
This project is developed as part of **CodeAlpha Internship (Task 3)**. Feel free to use and customize!
