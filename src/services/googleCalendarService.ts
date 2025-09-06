const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class GoogleCalendarService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Helper method to add user ID to request body
  private addUserIdToBody(body: any, userId?: string) {
    if (userId) {
      return { ...body, userId };
    }
    return body;
  }

  // Get Google OAuth URL
  async getAuthUrl(userId?: string) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    
    const queryString = params.toString();
    const endpoint = `/integrations/google/auth-url${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Handle Google OAuth callback
  async handleCallback(code: string, userId?: string) {
    return this.makeRequest('/integrations/google/callback', {
      method: 'POST',
      body: JSON.stringify(this.addUserIdToBody({ code }, userId)),
    });
  }

  // Disconnect Google Calendar
  async disconnect(userId?: string) {
    return this.makeRequest('/integrations/google/disconnect', {
      method: 'DELETE',
      body: JSON.stringify(this.addUserIdToBody({}, userId)),
    });
  }

  // Get Google Calendar events
  async getEvents(timeMin?: string, timeMax?: string, userId?: string) {
    const params = new URLSearchParams();
    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);
    if (userId) params.append('userId', userId);
    
    const queryString = params.toString();
    const endpoint = `/integrations/google/events${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Create Google Calendar event
  async createEvent(eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    timeZone?: string;
    attendees?: Array<{ email: string; name: string }>;
    location?: string;
    reminders?: Array<{ method: string; minutes: number }>;
  }, userId?: string) {
    return this.makeRequest('/integrations/google/events', {
      method: 'POST',
      body: JSON.stringify(this.addUserIdToBody(eventData, userId)),
    });
  }

  // Update Google Calendar event
  async updateEvent(eventId: string, eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    timeZone?: string;
    attendees?: Array<{ email: string; name: string }>;
    location?: string;
    reminders?: Array<{ method: string; minutes: number }>;
  }, userId?: string) {
    return this.makeRequest(`/integrations/google/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(this.addUserIdToBody(eventData, userId)),
    });
  }

  // Delete Google Calendar event
  async deleteEvent(eventId: string, userId?: string) {
    return this.makeRequest(`/integrations/google/events/${eventId}`, {
      method: 'DELETE',
      body: JSON.stringify(this.addUserIdToBody({}, userId)),
    });
  }

  // Sync with Google Calendar
  async sync(userId?: string) {
    return this.makeRequest('/integrations/google/sync', {
      method: 'POST',
      body: JSON.stringify(this.addUserIdToBody({}, userId)),
    });
  }
}

export const googleCalendarService = new GoogleCalendarService();
