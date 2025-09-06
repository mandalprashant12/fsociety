# 🟣 Task Manager + Calendar + Scheduling Web App

A modern, full-stack web application that combines task management, calendar functionality, and meeting scheduling with Cal.com-inspired features. Built with React, TypeScript, Node.js, and MongoDB.

## ✨ Features

### 🎯 Core Features

- **Task Management**
  - Create, edit, delete, and organize tasks with deadlines
  - Categories/labels (Work, Personal, Meetings, etc.)
  - Search, filter, and sort tasks
  - Priority levels and status tracking
  - Time estimation and tracking

- **Calendar Interface**
  - Google Calendar-style daily, weekly, and monthly views
  - Add events/meetings with start & end times
  - Drag-and-drop functionality (planned)
  - Reminder notifications

- **Meeting Management**
  - Create and manage meetings
  - Jitsi integration for video calls
  - Meeting notes and agenda
  - Attendee management
  - Default settings (mic muted, camera off)

### 🎯 Cal.com-Inspired Features

- **Booking Pages**
  - Public booking links (`/book/:username`)
  - Multiple meeting types (15-min, 30-min, custom)
  - Custom fields and settings

- **Availability Management**
  - Set working hours and availability
  - Buffer times between meetings
  - Timezone handling

- **Team Scheduling**
  - Round-robin scheduling
  - Collective availability
  - Team member management

### 🔔 Notifications & Integrations

- **Real-time Notifications**
  - Web Push API support
  - Socket.io for real-time updates
  - Email reminders

- **Calendar Integrations**
  - Google Calendar sync
  - Outlook integration
  - Webhook support for Slack/Notion

### 🎨 UI/UX

- **Modern Dark Theme**
  - Purple, black, and white color palette
  - Gradient backgrounds
  - Smooth animations with Framer Motion
  - Responsive design

- **Dashboard**
  - Task overview and statistics
  - Upcoming meetings
  - Productivity metrics
  - Weekly summaries

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** components
- **React Hook Form** for forms
- **React Query** for data fetching
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** authentication
- **Socket.io** for real-time features
- **Passport.js** for OAuth
- **Web Push API** for notifications
- **Node-cron** for scheduled tasks

### External Services
- **Jitsi Meet** for video conferencing
- **MongoDB Atlas** for database hosting
- **Cloudinary** for file uploads
- **OpenAI API** for AI features (planned)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fsociety
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development servers**

   **Frontend (Terminal 1):**
   ```bash
   npm run dev
   ```

   **Backend (Terminal 2):**
   ```bash
   cd backend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
fsociety/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── TaskCard.tsx         # Task display component
│   │   ├── TaskModal.tsx        # Task creation/editing
│   │   ├── CalendarView.tsx     # Calendar interface
│   │   └── MeetingCard.tsx      # Meeting display
│   ├── pages/                   # Page components
│   ├── types/                   # TypeScript type definitions
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   └── data/                    # Mock data
├── backend/                     # Backend source
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Express middleware
│   │   ├── services/            # Business logic
│   │   └── config/              # Configuration
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/task-manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Web Push (Optional)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task status

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get single meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `POST /api/meetings/:id/join` - Join meeting

## 🎨 UI Components

The app uses a modern dark theme with purple accents:

- **Primary Colors**: Purple (#8B5CF6), Black (#0F172A), White (#FFFFFF)
- **Background**: Gradient from slate-900 to purple-900
- **Cards**: Semi-transparent with backdrop blur
- **Animations**: Smooth transitions with Framer Motion

## 🔮 Planned Features

- [ ] Drag-and-drop for tasks and events
- [ ] AI-powered meeting summaries
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced scheduling algorithms
- [ ] Integration with more calendar providers
- [ ] File attachments for tasks
- [ ] Time tracking
- [ ] Project management features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Cal.com](https://cal.com/) for inspiration on scheduling features
- [Jitsi](https://jitsi.org/) for video conferencing

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using modern web technologies**