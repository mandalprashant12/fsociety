import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, CheckCircle, XCircle, RefreshCw, Settings } from 'lucide-react';
import { googleCalendarService } from '@/services/googleCalendarService';
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarIntegrationProps {
  userId?: string;
  onIntegrationChange?: (isConnected: boolean) => void;
}

const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({ 
  userId,
  onIntegrationChange 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Check if user has Google Calendar integration
      // This would typically be done by checking user's integration status
      // For now, we'll simulate it
      const hasIntegration = localStorage.getItem('googleCalendarConnected') === 'true';
      setIsConnected(hasIntegration);
      onIntegrationChange?.(hasIntegration);
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await googleCalendarService.getAuthUrl(userId);
      
      // Open Google OAuth in a popup window
      const popup = window.open(
        response.authUrl,
        'google-calendar-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for the popup to close and handle the callback
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          handleAuthCallback();
        }
      }, 1000);
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Google Calendar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async () => {
    try {
      // In a real implementation, you would get the code from the URL parameters
      // For demo purposes, we'll simulate a successful connection
      const code = 'demo-code'; // This would come from URL parameters
      await googleCalendarService.handleCallback(code, userId);
      
      localStorage.setItem('googleCalendarConnected', 'true');
      setIsConnected(true);
      onIntegrationChange?.(true);
      
      toast({
        title: 'Connected Successfully',
        description: 'Google Calendar has been connected successfully!',
      });
    } catch (error) {
      console.error('Error handling auth callback:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to complete Google Calendar connection.',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await googleCalendarService.disconnect(userId);
      localStorage.removeItem('googleCalendarConnected');
      setIsConnected(false);
      onIntegrationChange?.(false);
      
      toast({
        title: 'Disconnected',
        description: 'Google Calendar has been disconnected.',
      });
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast({
        title: 'Disconnect Failed',
        description: 'Failed to disconnect Google Calendar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await googleCalendarService.sync(userId);
      setLastSync(new Date());
      
      toast({
        title: 'Sync Complete',
        description: 'Google Calendar has been synced successfully!',
      });
    } catch (error) {
      console.error('Error syncing Google Calendar:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync with Google Calendar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-red-500 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Google Calendar</CardTitle>
                <CardDescription className="text-slate-400">
                  Sync your tasks and meetings with Google Calendar
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
            >
              {isConnected ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Not Connected</>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">
                    Google Calendar is connected and ready to sync
                  </p>
                  {lastSync && (
                    <p className="text-xs text-slate-500 mt-1">
                      Last synced: {lastSync.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    className="border-red-600 text-red-300 hover:bg-red-800"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-white mb-2">Features Enabled:</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Automatic sync of meetings to Google Calendar</li>
                  <li>• Task deadlines appear as calendar events</li>
                  <li>• Two-way sync with your Google Calendar</li>
                  <li>• Real-time updates and notifications</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-300 mb-4">
                  Connect your Google Calendar to sync tasks and meetings automatically
                </p>
                <Button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
                </Button>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-white mb-2">What you'll get:</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Sync meetings and tasks with Google Calendar</li>
                  <li>• Automatic event creation and updates</li>
                  <li>• Seamless integration with your existing calendar</li>
                  <li>• Real-time synchronization</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoogleCalendarIntegration;
