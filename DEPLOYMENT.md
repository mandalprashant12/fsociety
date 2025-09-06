# 🚀 Deployment Guide - Task Manager + Calendar + Scheduling App

This guide will help you deploy the complete Task Manager application with all features including notifications, AI integration, and Cal.com-style booking.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git installed
- At least 4GB RAM available
- Ports 3000, 5000, and 27017 available

## 🎯 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repository-url>
cd fsociety
```

### 2. Deploy with Docker
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🔧 Manual Deployment

### Step 1: Environment Configuration

1. **Create .env file** (if not exists):
```bash
cp .env.example .env
```

2. **Update environment variables**:
```env
# Production Environment
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongo:27017/task-manager?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
PORT=5000

# API Keys (Optional but recommended)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### Step 2: Build and Start Services

```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 3: Verify Deployment

```bash
# Check MongoDB
docker-compose exec mongo mongosh --eval "db.runCommand('ping')"

# Check Backend API
curl http://localhost:5000/health

# Check Frontend
curl http://localhost:3000
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   MongoDB       │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Redis         │
│   (Reverse      │    │   (Cache)       │
│   Proxy)        │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘
```

## 🔥 Features Included

### ✅ Core Features
- **Task Management**: Full CRUD with priorities, categories, deadlines
- **Calendar Views**: Day, week, month views with event management
- **Meeting Management**: Jitsi integration, attendee management
- **Real-time Notifications**: Web Push API + Socket.io
- **Modern UI**: Dark theme with purple gradients and animations

### ✅ Advanced Features
- **Cal.com-style Booking**: Public booking pages with availability management
- **AI Integration**: Meeting summaries and task insights (OpenAI)
- **Calendar Sync**: Google Calendar and Outlook integration
- **Webhook Support**: Slack and Notion integrations
- **Team Scheduling**: Round-robin and collective availability

### ✅ Production Ready
- **Docker Containerization**: Multi-stage builds for optimization
- **Health Checks**: Automatic service monitoring
- **Security Headers**: Nginx security configuration
- **Database Indexing**: Optimized MongoDB queries
- **Error Handling**: Comprehensive error management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create meeting
- `POST /api/meetings/:id/join` - Join meeting

### Bookings
- `GET /api/bookings/:slug` - Get public booking page
- `POST /api/bookings/:slug/book` - Book meeting
- `GET /api/bookings/:slug/availability` - Get available slots

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

### AI Features
- `POST /api/ai/meeting-summary` - Generate meeting summary
- `POST /api/ai/task-summary` - Generate task insights
- `POST /api/ai/suggestions` - Get smart suggestions

### Integrations
- `POST /api/integrations/google/sync` - Sync with Google Calendar
- `POST /api/integrations/slack/notify` - Send Slack notification

## 🛠️ Development

### Local Development
```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongo mongosh

# Backup database
docker-compose exec mongo mongodump --out /backup

# Restore database
docker-compose exec mongo mongorestore /backup
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT secrets**
3. **Enable HTTPS** in production
4. **Configure firewall** rules
5. **Regular security updates**

## 📈 Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /`
- MongoDB: Internal health check

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

## 🚀 Production Deployment

### Cloud Deployment Options

1. **AWS ECS/Fargate**
2. **Google Cloud Run**
3. **Azure Container Instances**
4. **DigitalOcean App Platform**
5. **Heroku with Docker**

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your-production-secret-key
FRONTEND_URL=https://yourdomain.com
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Memory issues**: Increase Docker memory limit
3. **Database connection**: Check MongoDB URI
4. **API errors**: Check backend logs

### Debug Commands
```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down --rmi all
docker-compose up --build
```

## 📞 Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check service health endpoints
4. Review this deployment guide

---

**🎉 Congratulations! Your Task Manager + Calendar + Scheduling App is now deployed and ready to use!**
