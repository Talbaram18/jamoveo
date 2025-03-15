import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PlayerMainPage } from './pages/PlayerMainPage';
import { AdminMainPage } from './pages/AdminMainPage';
import { LivePage } from './pages/LivePage';
import './styles/global.css';
import { CLIENT_ROUTES } from './utils/constants';

// routing
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [user, setUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check user authentication
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // redirect to appropriate main page
      if (
        currentPath === '/' ||
        currentPath === '/login' ||
        currentPath === '/signup'
      ) {
        const redirectPath =
          parsedUser.role === 'admin'
            ? CLIENT_ROUTES.ADMIN_MAIN
            : CLIENT_ROUTES.PLAYER_MAIN;
        window.history.pushState({}, '', redirectPath);
        setCurrentPath(redirectPath);
      }
    }

    setIsInitializing(false);

    // hANDLES CHANGES IN ROOTS
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [currentPath]);

  // Wait until initialization is complete
  if (isInitializing) {
    return <div className="loading">Loading...</div>;
  }

  // Route rendering
  const renderContent = () => {
    switch (currentPath) {
      case '/login':
        return user ? (
          user.role === 'admin' ? (
            <AdminMainPage />
          ) : (
            <PlayerMainPage />
          )
        ) : (
          <LoginPage />
        );
      case '/signup':
        return user ? (
          user.role === 'admin' ? (
            <AdminMainPage />
          ) : (
            <PlayerMainPage />
          )
        ) : (
          <SignupPage />
        );
      case '/player/main':
        return user?.role === 'player' ? <PlayerMainPage /> : <LoginPage />;
      case '/admin/main':
        return user?.role === 'admin' ? <AdminMainPage /> : <LoginPage />;
      case '/live':
        return user ? <LivePage /> : <LoginPage />;
      default:
        return user ? (
          user.role === 'admin' ? (
            <AdminMainPage />
          ) : (
            <PlayerMainPage />
          )
        ) : (
          <LoginPage />
        );
    }
  };

  return <div className="app">{renderContent()}</div>;
};

export default App;
