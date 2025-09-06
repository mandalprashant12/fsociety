import axios from 'axios';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { CalendarIntegration } from '../models/CalendarIntegration';
import { Meeting } from '../models/Meeting';
import { Task } from '../models/Task';

export class CalendarIntegrationService {
  private static oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth/google/callback`
  );

  // @desc    Get Google OAuth URL
  // @route   GET /api/integrations/google/auth-url
  // @access  Private
  static getGoogleAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // @desc    Handle Google OAuth callback
  // @route   POST /api/integrations/google/callback
  // @access  Private
  static async handleGoogleCallback(code: string, userId: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const userInfo = await oauth2.userinfo.get();

      // Get calendar list
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      const calendarList = await calendar.calendarList.list();

      // Find primary calendar
      const primaryCalendar = calendarList.data.items?.find(cal => cal.primary) || calendarList.data.items?.[0];

      if (!primaryCalendar?.id) {
        throw new Error('No calendar found');
      }

      // Save or update integration
      const integration = await CalendarIntegration.findOneAndUpdate(
        { userId, provider: 'google' },
        {
          userId,
          provider: 'google',
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token!,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          calendarId: primaryCalendar.id,
          isActive: true,
          lastSyncAt: new Date(),
          userEmail: userInfo.data.email,
          userName: userInfo.data.name
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        message: 'Google Calendar connected successfully',
        integration
      };
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  }

  // @desc    Disconnect Google Calendar
  // @route   DELETE /api/integrations/google/disconnect
  // @access  Private
  static async disconnectGoogleCalendar(userId: string) {
    try {
      await CalendarIntegration.findOneAndUpdate(
        { userId, provider: 'google' },
        { isActive: false }
      );

      return {
        success: true,
        message: 'Google Calendar disconnected successfully'
      };
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      throw error;
    }
  }

  // @desc    Get Google Calendar events
  // @route   GET /api/integrations/google/events
  // @access  Private
  static async getGoogleEvents(userId: string, timeMin?: string, timeMax?: string) {
    try {
      const integration = await CalendarIntegration.findOne({
        userId,
        provider: 'google',
        isActive: true
      });

      if (!integration) {
        throw new Error('Google Calendar integration not found');
      }

      // Refresh token if needed
      const refreshedIntegration = await this.refreshGoogleToken(integration);

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({
        access_token: refreshedIntegration.accessToken,
        refresh_token: refreshedIntegration.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const response = await calendar.events.list({
        calendarId: integration.calendarId,
        timeMin: timeMin ? new Date(timeMin).toISOString() : new Date().toISOString(),
        timeMax: timeMax ? new Date(timeMax).toISOString() : undefined,
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return {
        success: true,
        events: response.data.items || []
      };
    } catch (error) {
      console.error('Error fetching Google events:', error);
      throw error;
    }
  }

  // @desc    Create Google Calendar event
  // @route   POST /api/integrations/google/events
  // @access  Private
  static async createGoogleEvent(userId: string, eventData: any) {
    try {
      const integration = await CalendarIntegration.findOne({
        userId,
        provider: 'google',
        isActive: true
      });

      if (!integration) {
        throw new Error('Google Calendar integration not found');
      }

      const refreshedIntegration = await this.refreshGoogleToken(integration);

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({
        access_token: refreshedIntegration.accessToken,
        refresh_token: refreshedIntegration.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'UTC'
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'UTC'
        },
        attendees: eventData.attendees?.map((attendee: any) => ({
          email: attendee.email,
          displayName: attendee.name
        })) || [],
        location: eventData.location || '',
        reminders: {
          useDefault: false,
          overrides: eventData.reminders || [
            { method: 'popup', minutes: 15 },
            { method: 'popup', minutes: 60 }
          ]
        }
      };

      const response = await calendar.events.insert({
        calendarId: integration.calendarId,
        requestBody: event
      });

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      console.error('Error creating Google event:', error);
      throw error;
    }
  }

  // @desc    Update Google Calendar event
  // @route   PUT /api/integrations/google/events/:eventId
  // @access  Private
  static async updateGoogleEvent(userId: string, eventId: string, eventData: any) {
    try {
      const integration = await CalendarIntegration.findOne({
        userId,
        provider: 'google',
        isActive: true
      });

      if (!integration) {
        throw new Error('Google Calendar integration not found');
      }

      const refreshedIntegration = await this.refreshGoogleToken(integration);

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({
        access_token: refreshedIntegration.accessToken,
        refresh_token: refreshedIntegration.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'UTC'
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'UTC'
        },
        attendees: eventData.attendees?.map((attendee: any) => ({
          email: attendee.email,
          displayName: attendee.name
        })) || [],
        location: eventData.location || '',
        reminders: {
          useDefault: false,
          overrides: eventData.reminders || [
            { method: 'popup', minutes: 15 },
            { method: 'popup', minutes: 60 }
          ]
        }
      };

      const response = await calendar.events.update({
        calendarId: integration.calendarId,
        eventId: eventId,
        requestBody: event
      });

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      console.error('Error updating Google event:', error);
      throw error;
    }
  }

  // @desc    Delete Google Calendar event
  // @route   DELETE /api/integrations/google/events/:eventId
  // @access  Private
  static async deleteGoogleEvent(userId: string, eventId: string) {
    try {
      const integration = await CalendarIntegration.findOne({
        userId,
        provider: 'google',
        isActive: true
      });

      if (!integration) {
        throw new Error('Google Calendar integration not found');
      }

      const refreshedIntegration = await this.refreshGoogleToken(integration);

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({
        access_token: refreshedIntegration.accessToken,
        refresh_token: refreshedIntegration.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      await calendar.events.delete({
        calendarId: integration.calendarId,
        eventId: eventId
      });

      return {
        success: true,
        message: 'Event deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting Google event:', error);
      throw error;
    }
  }

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
