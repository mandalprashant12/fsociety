import { Express } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import meetingRoutes from './meetingRoutes';
import bookingRoutes from './bookingRoutes';
import userRoutes from './userRoutes';
import notificationRoutes from './notificationRoutes';
import aiRoutes from './aiRoutes';
import integrationRoutes from './integrationRoutes';

export const setupRoutes = (app: Express): void => {
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/meetings', meetingRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/integrations', integrationRoutes);
};
