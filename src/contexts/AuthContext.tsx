import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, UserStatus } from '../types/user';

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  hasPermission: (permission: string | string[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    token: string | null;
  }>({ user: null, token: null });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          const { user, token, expiresAt } = JSON.parse(storedAuth);
          
          // Check if token is still valid
          if (!expiresAt || expiresAt > Date.now()) {
            setAuthState({ user, token });
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
  };

  const logout = () => {
    // Optional: Make API call to invalidate tokens
    setAuthState({ user: null, token: null });
    localStorage.removeItem('auth');
  };

  const value = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.user,
    isApproved: authState.user?.status === 'approved',
    hasPermission,
    hasRole,
    login,
    logout,
    refreshToken: handleTokenRefresh,
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