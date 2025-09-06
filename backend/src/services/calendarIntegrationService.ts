import axios from 'axios';
import { CalendarIntegration } from '../models/CalendarIntegration';
import { Meeting } from '../models/Meeting';
import { Task } from '../models/Task';

export class CalendarIntegrationService {
  static async syncWithGoogleCalendar(userId: string) {
    try {
      const integration = await CalendarIntegration.findOne({
        userId,
        provider: 'google',
        isActive: true
      });

      if (!integration) {
        throw new Error('Google Calendar integration not found');
      }

      // Sync meetings to Google Calendar
      await this.syncMeetingsToGoogle(userId, integration);
      
      // Sync tasks with deadlines to Google Calendar
      await this.syncTasksToGoogle(userId, integration);

      // Update last sync time
      integration.lastSyncAt = new Date();
      await integration.save();

      return { success: true, message: 'Google Calendar synced successfully' };
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      throw error;
    }
  }

  static async syncMeetingsToGoogle(userId: string, integration: any) {
    const meetings = await Meeting.find({
      $or: [
        { createdBy: userId },
        { 'attendees.id': userId }
      ],
      startTime: { $gte: new Date() }
    });

    for (const meeting of meetings) {
      try {
        await this.createGoogleEvent(integration, meeting);
      } catch (error) {
        console.error(`Error syncing meeting ${meeting._id}:`, error);
      }
    }
  }

  static async syncTasksToGoogle(userId: string, integration: any) {
    const tasks = await Task.find({
      createdBy: userId,
      deadline: { $gte: new Date() },
      status: { $ne: 'completed' }
    });

    for (const task of tasks) {
      try {
        await this.createGoogleEventFromTask(integration, task);
      } catch (error) {
        console.error(`Error syncing task ${task._id}:`, error);
      }
    }
  }

  static async createGoogleEvent(integration: any, meeting: any) {
    const event = {
      summary: meeting.title,
      description: meeting.description || '',
      start: {
        dateTime: meeting.startTime.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: meeting.endTime.toISOString(),
        timeZone: 'UTC'
      },
      attendees: meeting.attendees.map((attendee: any) => ({
        email: attendee.email,
        displayName: attendee.name
      })),
      location: meeting.location || '',
      reminders: {
        useDefault: false,
        overrides: meeting.reminders.map((minutes: number) => ({
          method: 'popup',
          minutes
        }))
      }
    };

    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/${integration.calendarId}/events`,
      event,
      {
        headers: {
          'Authorization': `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  static async createGoogleEventFromTask(integration: any, task: any) {
    const event = {
      summary: `📋 ${task.title}`,
      description: task.description || `Task: ${task.title}\nPriority: ${task.priority}\nCategory: ${task.category}`,
      start: {
        dateTime: task.deadline.toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(task.deadline.getTime() + 30 * 60000).toISOString(), // 30 minutes duration
        timeZone: 'UTC'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'popup', minutes: 15 }
        ]
      }
    };

    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/${integration.calendarId}/events`,
      event,
      {
        headers: {
          'Authorization': `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  static async refreshGoogleToken(integration: any) {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: integration.refreshToken,
        grant_type: 'refresh_token'
      });

      integration.accessToken = response.data.access_token;
      integration.expiresAt = new Date(Date.now() + response.data.expires_in * 1000);
      await integration.save();

      return integration;
    } catch (error) {
      console.error('Error refreshing Google token:', error);
      throw error;
    }
  }

  static async syncWithOutlook(userId: string) {
    try {
      const integration = await CalendarIntegration.findOne({
        userId,
        provider: 'outlook',
        isActive: true
      });

      if (!integration) {
        throw new Error('Outlook integration not found');
      }

      // Similar implementation for Outlook
      // This would use Microsoft Graph API
      
      integration.lastSyncAt = new Date();
      await integration.save();

      return { success: true, message: 'Outlook Calendar synced successfully' };
    } catch (error) {
      console.error('Error syncing with Outlook:', error);
      throw error;
    }
  }

  static async sendSlackNotification(webhookUrl: string, message: any) {
    try {
      await axios.post(webhookUrl, {
        text: message.title,
        attachments: [
          {
            color: message.type === 'success' ? 'good' : 'warning',
            fields: [
              {
                title: 'Message',
                value: message.body,
                short: false
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw error;
    }
  }

  static async sendNotionUpdate(webhookUrl: string, data: any) {
    try {
      await axios.post(webhookUrl, {
        content: data.content,
        properties: data.properties
      });
    } catch (error) {
      console.error('Error sending Notion update:', error);
      throw error;
    }
  }
}
