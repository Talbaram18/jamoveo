import { useState, useEffect } from 'react';
import { User, UserLogin, UserSignup } from '../types/user';
import { API } from '../utils/api';
import { CLIENT_ROUTES } from '../utils/constants';
import { useSocket } from './useSocket';

/**
 * Custom hook for authentication functionality
 * Manages login, signup, and logout functions
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize the socket hook with the current user
  const { quitSession } = useSocket(user);

  useEffect(() => {
    // Check for existing user in local storage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: UserLogin) => {
    setError(null);
    try {
      const { user } = await API.login(credentials);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on user role
      window.location.href =
        user.role === 'admin'
          ? CLIENT_ROUTES.ADMIN_MAIN
          : CLIENT_ROUTES.PLAYER_MAIN;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setUser(null);
    }
  };

  const signup = async (userData: UserSignup) => {
    setError(null);
    try {
      await API.signup(userData);
      // Redirect to login after successful signup
      window.location.href = CLIENT_ROUTES.LOGIN;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const logout = () => {
    // If user is admin, end the session for all users
    if (user?.role === 'admin') {
      // Show confirmation before quitting session
      const confirmQuit = window.confirm(
        'Do you want to end the session for all users?'
      );

      if (confirmQuit) {
        // Call quitSession to end the session for all connected users
        quitSession();
      }
    }

    // Remove user from local storage
    localStorage.removeItem('user');
    setUser(null);

    // Redirect to login page
    window.location.href = CLIENT_ROUTES.LOGIN;
  };

  return {
    user,
    error,
    login,
    signup,
    logout,
  };
};
