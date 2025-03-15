import React from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { CLIENT_ROUTES } from '../../utils/constants';
/**
 * Header component
 * Shows login/signup links for unauthenticated users
 * Shows user info and logout button for authenticated users
 */
export const Header: React.FC = () => {
  // Access authentication context

  const { user, logout } = useAuth();

  // Handle logout button click

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-right">
          {!user ? (
            // Navigation for unauthenticated users

            <div className="header-nav">
              <a href={CLIENT_ROUTES.LOGIN} className="nav-link">
                Login
              </a>
              <> </>
              <a href={CLIENT_ROUTES.SIGNUP} className="nav-link">
                Signup
              </a>
            </div>
          ) : (
            // Navigation for authenticated users

            <div className="header-nav">
              {/* Display username and role/instrument */}

              <span className="user-info">
                {user.username} | {user.instrument || user.role}
              </span>
              {/* Logout button */}

              <Button
                onClick={handleLogout}
                variant="secondary"
                className="logout-btn"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
