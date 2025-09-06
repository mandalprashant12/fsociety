import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({
  onSuccess,
  onError,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Get Google OAuth URL
      const response = await authService.getGoogleAuthUrl();
      
      // Open Google OAuth in a popup window
      const popup = window.open(
        response.authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for the popup to close and handle the callback
      const checkClosed = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          
          try {
            // In a real implementation, you would get the code from the URL parameters
            // For demo purposes, we'll simulate a successful login
            const mockCode = 'demo-google-code';
            const authResponse = await authService.handleGoogleCallback(mockCode);
            
            // Store authentication data
            authService.storeAuthData(authResponse.data);
            
            toast({
              title: 'Login Successful',
              description: `Welcome back, ${authResponse.data.user.name}!`,
            });
            
            onSuccess?.(authResponse.data.user);
          } catch (error: any) {
            console.error('Google login error:', error);
            const errorMessage = error.message || 'Google login failed';
            
            toast({
              title: 'Login Failed',
              description: errorMessage,
              variant: 'destructive',
            });
            
            onError?.(errorMessage);
          } finally {
            setIsLoading(false);
          }
        }
      }, 1000);
    } catch (error: any) {
      console.error('Error initiating Google login:', error);
      const errorMessage = error.message || 'Failed to initiate Google login';
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4 mr-2" />
      )}
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleLogin;
