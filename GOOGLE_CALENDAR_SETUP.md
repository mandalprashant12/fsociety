# Google Calendar API Integration Setup

This guide will help you set up Google Calendar API integration for your TaskFlow application.

## Prerequisites

- Google Cloud Console account
- Node.js and npm installed
- MongoDB running locally or remotely

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - `http://localhost:8080/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
5. Save the credentials and note down:
   - Client ID
   - Client Secret

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp backend/env.example backend/.env
   ```

2. Update the `.env` file with your Google credentials:
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Frontend URL (for OAuth redirects)
   FRONTEND_URL=http://localhost:8080
   ```

## Step 4: Install Dependencies

The required dependencies are already installed:
- `googleapis` - Google APIs client library
- `google-auth-library` - Google authentication library

## Step 5: Start the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Step 6: Test the Integration

1. Open your browser and go to `http://localhost:8080`
2. Click "Continue as Demo User" to access the dashboard
3. Navigate to the "Integrations" tab
4. Click "Connect Google Calendar"
5. Complete the OAuth flow
6. Test syncing events and tasks

## API Endpoints

The following endpoints are available for Google Calendar integration:

### Authentication
- `GET /api/integrations/google/auth-url` - Get OAuth URL
- `POST /api/integrations/google/callback` - Handle OAuth callback
- `DELETE /api/integrations/google/disconnect` - Disconnect integration

### Events
- `GET /api/integrations/google/events` - Get calendar events
- `POST /api/integrations/google/events` - Create calendar event
- `PUT /api/integrations/google/events/:eventId` - Update calendar event
- `DELETE /api/integrations/google/events/:eventId` - Delete calendar event

### Sync
- `POST /api/integrations/google/sync` - Sync with Google Calendar

## Features

### Automatic Sync
- Meetings created in TaskFlow are automatically synced to Google Calendar
- Tasks with deadlines appear as calendar events
- Two-way sync keeps both calendars in sync

### Event Management
- Create, update, and delete events
- Support for attendees, locations, and reminders
- Time zone handling

### Security
- OAuth 2.0 authentication
- Secure token storage
- Automatic token refresh

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Check that `FRONTEND_URL` in `.env` is correct

2. **"Access denied" error**
   - Make sure the Google Calendar API is enabled
   - Check that OAuth consent screen is configured

3. **"Token expired" error**
   - The service automatically refreshes tokens
   - If issues persist, disconnect and reconnect

4. **Events not syncing**
   - Check that the user has granted calendar permissions
   - Verify the integration is active in the database

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=googleapis:*
```

## Production Deployment

For production deployment:

1. Update redirect URIs in Google Cloud Console
2. Set `FRONTEND_URL` to your production domain
3. Ensure HTTPS is enabled
4. Update CORS settings if needed

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Check the backend logs
3. Verify all environment variables are set correctly
4. Ensure Google Calendar API is properly configured

## Next Steps

- Add support for other calendar providers (Outlook, Apple)
- Implement webhook notifications
- Add calendar event editing capabilities
- Implement bulk sync operations
