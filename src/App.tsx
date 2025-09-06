import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MeetingRoom from "./components/MeetingRoom";
import NotFound from "./pages/NotFound";
import GoogleLogin from "./components/GoogleLogin";
import { authService } from "./services/authService";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMeeting, setCurrentMeeting] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleGoogleLoginSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const joinMeeting = (meeting: any) => {
    setCurrentMeeting(meeting);
  };

  const leaveMeeting = () => {
    setCurrentMeeting(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentMeeting) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MeetingRoom 
            meeting={currentMeeting} 
            onLeave={leaveMeeting}
            onEnd={leaveMeeting}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">TM</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">TaskFlow</h1>
                <p className="text-slate-400">Modern task manager with calendar integration</p>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-6 text-center">Welcome Back</h2>
                
                <div className="space-y-4">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    className="w-full"
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-800 px-2 text-slate-400">Or</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Mock login for demo purposes
                      const mockUser = {
                        id: '1',
                        name: 'Demo User',
                        email: 'demo@example.com',
                        avatar: undefined
                      };
                      localStorage.setItem('user', JSON.stringify(mockUser));
                      localStorage.setItem('token', 'demo-token');
                      handleLogin(mockUser);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Continue as Demo User
                  </button>
                  
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">
                      Sign in with Google for full features, or continue as demo user.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                  TaskFlow - Boost your productivity with modern task management
                </p>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} onJoinMeeting={joinMeeting} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
