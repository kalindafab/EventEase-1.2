import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, UserStatus } from '../types/user';

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  organization: string;
  status: UserStatus;
  permissions: string[];
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
  themePreference?: 'light' | 'dark' | 'system'; // Added theme preference
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  theme: 'light' | 'dark'; // Current active theme
  hasPermission: (permission: string | string[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => void; // Added theme setter
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    token: string | null;
  }>({ user: null, token: null });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    
    // If user is logged in and theme preference differs, we could update it on the server
    if (authState.user && authState.user.themePreference !== theme) {
      // Optional: Sync with user preferences on server
    }
  }, [theme, authState.user]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
    } else {
      setThemeState(newTheme);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          const { user, token, expiresAt } = JSON.parse(storedAuth);
          
          // Check if token is still valid
          if (!expiresAt || expiresAt > Date.now()) {
            setAuthState({ user, token });
            // Apply user's theme preference if available
            if (user?.themePreference) {
              setTheme(user.themePreference);
            }
          } else {
            await handleTokenRefresh();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('auth');
      }
    };

    initializeAuth();
  }, []);

  const handleTokenRefresh = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: authState.user?.refreshToken,
        }),
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { user, token, expiresAt } = await response.json();
      setAuthState({ user, token });
      localStorage.setItem('auth', JSON.stringify({ user, token, expiresAt }));
      
      // Apply user's theme preference if available
      if (user?.themePreference) {
        setTheme(user.themePreference);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!authState.user) return false;
    
    if (Array.isArray(permission)) {
      return permission.some(p => authState.user?.permissions.includes(p));
    }
    return authState.user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!authState.user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(authState.user.role);
    }
    return authState.user.role === role;
  };

  const login = (userData: User, token: string) => {
    const authData = {
      user: userData,
      token,
      expiresAt: userData.tokenExpiresAt,
    };
    setAuthState({ user: userData, token });
    localStorage.setItem('auth', JSON.stringify(authData));
    
    // Apply user's theme preference if available
    if (userData.themePreference) {
      setTheme(userData.themePreference);
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem('auth');
    // Don't reset theme on logout - keep user's UI preference
  };

  const value = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.user,
    isApproved: authState.user?.status === 'approved',
    theme,
    hasPermission,
    hasRole,
    login,
    logout,
    refreshToken: handleTokenRefresh,
    setTheme,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};