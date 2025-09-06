const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Register user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    timezone?: string;
  }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Login user
  async login(credentials: {
    email: string;
    password: string;
  }) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Get Google OAuth URL
  async getGoogleAuthUrl() {
    return this.makeRequest('/auth/google/url');
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string) {
    return this.makeRequest('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Verify Google ID token
  async verifyGoogleToken(idToken: string) {
    return this.makeRequest('/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  // Refresh token
  async refreshToken(refreshToken: string) {
    return this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Get current user
  async getMe() {
    const token = localStorage.getItem('token');
    return this.makeRequest('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Logout
  async logout() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      try {
        await this.makeRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Update profile
  async updateProfile(profileData: {
    name?: string;
    timezone?: string;
    preferences?: any;
  }) {
    const token = localStorage.getItem('token');
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  }

  // Change password
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    const token = localStorage.getItem('token');
    return this.makeRequest('/auth/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get stored user data
  getStoredUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Store authentication data
  storeAuthData(data: {
    token: string;
    refreshToken: string;
    user: any;
  }) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}

export const authService = new AuthService();
