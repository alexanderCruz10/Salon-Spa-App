import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '@/store/userStore';

// Helper to get a cookie value by name
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

interface JwtPayload {
  isAuthenticated?: boolean;
  userRole?: string;
  exp?: number;
  [key: string]: string | number | boolean | undefined;
}

const useAuth = () => {
  const [auth, setAuth] = useState<{ isAuthenticated: boolean; userRole: string }>({
    isAuthenticated: false,
    userRole: '',
  });
  
  const { setUser, clearUser } = useUserStore();

  // Check auth status via API call (since httpOnly cookies can't be read by JS)
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include httpOnly cookies
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Update local state
        setAuth({
          isAuthenticated: true,
          userRole: userData.role || '', // Backend returns role directly
        });
        
        // Update Zustand store with full user data
        setUser({
          id: userData.userId,
          name: userData.name || '',
          email: userData.email,
          role: userData.role,
        });
      } else {
        // 401 is expected when not logged in, so don't log as error
        if (response.status !== 401) {
          console.log('Auth check failed - status:', response.status);
        }
        setAuth({ isAuthenticated: false, userRole: '' });
        clearUser(); // Clear user from Zustand store
      }
    } catch (error) {
      // Network errors or other issues
      console.error('Auth check network error:', error);
      setAuth({ isAuthenticated: false, userRole: '' });
      clearUser(); // Clear user from Zustand store
    }
  }, [setUser, clearUser]);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkAuth]);

  // login/logout would be handled by your backend and cookie logic
  return {
    isAuthenticated: auth.isAuthenticated,
    userRole: auth.userRole,
    refetchAuth: checkAuth, // Expose checkAuth function to manually trigger
  };
};

export default useAuth;
