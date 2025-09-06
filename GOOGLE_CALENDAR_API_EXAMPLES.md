# Google Calendar API Usage Examples

This document provides examples of how to use the Google Calendar API with user ID parameters.

## Frontend Service Usage

### Basic Usage (Current User)
```typescript
import { googleCalendarService } from '@/services/googleCalendarService';

// Get auth URL for current user
const response = await googleCalendarService.getAuthUrl();

// Handle OAuth callback
await googleCalendarService.handleCallback(code);

// Get events for current user
const events = await googleCalendarService.getEvents();

// Create event for current user
await googleCalendarService.createEvent({
  title: 'Meeting',
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T11:00:00Z'
});
```

### Usage with Specific User ID
```typescript
import { googleCalendarService } from '@/services/googleCalendarService';

const userId = '507f1f77bcf86cd799439011'; // MongoDB ObjectId

// Get auth URL for specific user
const response = await googleCalendarService.getAuthUrl(userId);

// Handle OAuth callback for specific user
await googleCalendarService.handleCallback(code, userId);

// Get events for specific user
const events = await googleCalendarService.getEvents(
  '2024-01-01T00:00:00Z', // timeMin
  '2024-01-31T23:59:59Z', // timeMax
  userId // userId
);

// Create event for specific user
await googleCalendarService.createEvent({
  title: 'Team Meeting',
  description: 'Weekly team sync',
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T11:00:00Z',
  timeZone: 'UTC',
  attendees: [
    { email: 'john@example.com', name: 'John Doe' },
    { email: 'jane@example.com', name: 'Jane Smith' }
  ],
  location: 'Conference Room A',
  reminders: [
    { method: 'popup', minutes: 15 },
    { method: 'email', minutes: 60 }
  ]
}, userId);

// Update event for specific user
await googleCalendarService.updateEvent('event-id-123', {
  title: 'Updated Meeting',
  startTime: '2024-01-15T14:00:00Z',
  endTime: '2024-01-15T15:00:00Z'
}, userId);

// Delete event for specific user
await googleCalendarService.deleteEvent('event-id-123', userId);

// Sync calendar for specific user
await googleCalendarService.sync(userId);

// Disconnect calendar for specific user
await googleCalendarService.disconnect(userId);
```

## Backend API Usage

### Direct API Calls

#### Get OAuth URL
```bash
GET /api/integrations/google/auth-url?userId=507f1f77bcf86cd799439011
Authorization: Bearer <your-jwt-token>
```

#### Handle OAuth Callback
```bash
POST /api/integrations/google/callback
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "code": "4/0AX4XfWh...",
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Get Events
```bash
GET /api/integrations/google/events?userId=507f1f77bcf86cd799439011&timeMin=2024-01-01T00:00:00Z&timeMax=2024-01-31T23:59:59Z
Authorization: Bearer <your-jwt-token>
```

#### Create Event
```bash
POST /api/integrations/google/events
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "timeZone": "UTC",
  "attendees": [
    { "email": "john@example.com", "name": "John Doe" }
  ],
  "location": "Conference Room A",
  "reminders": [
    { "method": "popup", "minutes": 15 }
  ]
}
```

#### Update Event
```bash
PUT /api/integrations/google/events/event-id-123
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "title": "Updated Meeting",
  "startTime": "2024-01-15T14:00:00Z",
  "endTime": "2024-01-15T15:00:00Z"
}
```

#### Delete Event
```bash
DELETE /api/integrations/google/events/event-id-123
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Sync Calendar
```bash
POST /api/integrations/google/sync
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Disconnect Calendar
```bash
DELETE /api/integrations/google/disconnect
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

## React Component Usage

### Basic Component
```tsx
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';

function MyComponent() {
  const userId = '507f1f77bcf86cd799439011';
  
  return (
    <GoogleCalendarIntegration 
      userId={userId}
      onIntegrationChange={(isConnected) => {
        console.log('Integration status:', isConnected);
      }}
    />
  );
}
```

### With User Context
```tsx
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';

function IntegrationsPage() {
  const { user } = useContext(UserContext);
  
  return (
    <div>
      <h1>Calendar Integrations</h1>
      <GoogleCalendarIntegration 
        userId={user?.id}
        onIntegrationChange={(isConnected) => {
          // Handle integration status change
        }}
      />
    </div>
  );
}
```

## Error Handling

```typescript
try {
  const events = await googleCalendarService.getEvents(undefined, undefined, userId);
  console.log('Events:', events);
} catch (error) {
  if (error.message.includes('Google Calendar integration not found')) {
    console.log('User needs to connect their Google Calendar first');
  } else if (error.message.includes('Token expired')) {
    console.log('Token needs to be refreshed');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Response Examples

### Successful Response
```json
{
  "success": true,
  "events": [
    {
      "id": "event-id-123",
      "summary": "Team Meeting",
      "description": "Weekly team sync",
      "start": {
        "dateTime": "2024-01-15T10:00:00Z",
        "timeZone": "UTC"
      },
      "end": {
        "dateTime": "2024-01-15T11:00:00Z",
        "timeZone": "UTC"
      },
      "attendees": [
        {
          "email": "john@example.com",
          "displayName": "John Doe"
        }
      ],
      "location": "Conference Room A"
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Google Calendar integration not found",
  "error": "User has not connected their Google Calendar"
}
```

## Notes

- If no `userId` is provided, the API will use the authenticated user's ID from the JWT token
- All user IDs should be valid MongoDB ObjectIds
- The `userId` parameter is optional in all methods
- When using the frontend service, the user ID is automatically passed from the component props
- Backend routes support both query parameters and request body for user ID
