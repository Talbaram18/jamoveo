import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
/**
 * PlayerMainPage Component
 * This component serves as the landing page for band members (non-admin users).
 * */
export const PlayerMainPage: React.FC = () => {
  const goToLiveSession = () => {
    window.location.href = '/live';
  };

  return (
    <div className="player-main-page">
      <Header />
      <div className="container">
        <div className="player-dashboard">
          <h2>Rehearsal Room</h2>
          <div className="waiting-area">
            <Button
              onClick={goToLiveSession}
              variant="primary"
              className="live-session-btn"
            >
              Go to Live Session
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
