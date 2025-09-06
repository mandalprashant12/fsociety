import cron from 'node-cron';
import { Meeting } from '../models/Meeting';
import { Task } from '../models/Task';
import { sendMeetingReminder } from './socketService';
import { io } from '../index';

export const startCronJobs = (): void => {
  console.log('🕐 Starting cron jobs...');

  // Check for meeting reminders every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

      // Find meetings starting in 10 minutes
      const upcomingMeetings = await Meeting.find({
        startTime: {
          $gte: tenMinutesFromNow,
          $lte: fifteenMinutesFromNow
        },
        'attendees.status': { $in: ['accepted', 'pending'] }
      }).populate('attendees.id', 'name email');

      for (const meeting of upcomingMeetings) {
        sendMeetingReminder(io, meeting);
      }
    } catch (error) {
      console.error('Error in meeting reminder cron job:', error);
    }
  });

  // Check for overdue tasks every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const overdueTasks = await Task.find({
        deadline: { $lt: new Date() },
        status: { $ne: 'completed' }
      }).populate('createdBy', 'name email');

      // Send notifications for overdue tasks
      for (const task of overdueTasks) {
        io.to(`user_${task.createdBy._id}`).emit('task:overdue', {
          task,
          type: 'overdue',
          message: `Task "${task.title}" is overdue`
        });
      }
    } catch (error) {
      console.error('Error in overdue tasks cron job:', error);
    }
  });

  // Daily cleanup of old notifications (runs at 2 AM)
  cron.schedule('0 2 * * *', async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Clean up old completed tasks
      await Task.deleteMany({
        status: 'completed',
        completedAt: { $lt: thirtyDaysAgo }
      });

      console.log('Daily cleanup completed');
    } catch (error) {
      console.error('Error in daily cleanup cron job:', error);
    }
  });

  // Weekly productivity report (runs every Monday at 9 AM)
  cron.schedule('0 9 * * 1', async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Generate weekly reports for all users
      const users = await User.find({});
      
      for (const user of users) {
        const tasksCompleted = await Task.countDocuments({
          createdBy: user._id,
          status: 'completed',
          completedAt: { $gte: oneWeekAgo }
        });

        const tasksCreated = await Task.countDocuments({
          createdBy: user._id,
          createdAt: { $gte: oneWeekAgo }
        });

        const meetingsAttended = await Meeting.countDocuments({
          'attendees.id': user._id,
          startTime: { $gte: oneWeekAgo }
        });

        io.to(`user_${user._id}`).emit('report:weekly', {
          type: 'weekly_report',
          data: {
            tasksCompleted,
            tasksCreated,
            meetingsAttended,
            period: 'last_week'
          }
        });
      }

      console.log('Weekly reports sent');
    } catch (error) {
      console.error('Error in weekly report cron job:', error);
    }
  });

  console.log('✅ Cron jobs started successfully');
};
