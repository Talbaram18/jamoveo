import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SongSearch } from '../components/song/SongSearch';
import { ResultsPage } from './ResultsPage';
import { Song } from '../types/song';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { useSongSearch } from '../hooks/useSongSearch';
import { Button } from '../components/common/Button';
import { AdminPageState } from '../types/adminPageState.ENUM';
import '../styles/ResultsPage.css';
import '../styles/AdminMainPage.css';

/**
 * AdminMainPage Component
 * dashboard for admin users to search for songs and manage band rehearsal sessions.
 */
export const AdminMainPage: React.FC = () => {
  // Get authenticated user information

  const { user } = useAuth();
  const { selectSong, currentSong } = useSocket(user);
  const { searchResults, searchSongs, resetSearch } = useSongSearch();
  // state to track which view/page state we're currently in

  const [pageState, setPageState] = useState<AdminPageState>(
    currentSong ? AdminPageState.SONG_DISPLAY : AdminPageState.WELCOME
  );

  //song search and updates page state to display results
  const handleSearch = (query: string) => {
    searchSongs(query);
    setPageState(AdminPageState.RESULTS);
  };

  //song select and updates page state to display results
  const handleSongSelect = (fullSongDetails: Song) => {
    selectSong(fullSongDetails);
    setPageState(AdminPageState.SONG_DISPLAY);
  };
  //resets search
  const startNewSearch = () => {
    resetSearch();
    setPageState(AdminPageState.SEARCH);
  };

  //returns to the search view
  const backToSearch = () => {
    setPageState(AdminPageState.SEARCH);
  };

  //directs you to live session page
  const goToLiveSession = () => {
    window.location.href = '/live';
  };

  const renderContent = () => {
    switch (pageState) {
      case AdminPageState.WELCOME:
        return (
          <div className="admin-welcome text-center">
            <h2>Welcome!</h2>
            <p>Start a new session to select songs for your band rehearsal.</p>
            <Button
              onClick={startNewSearch}
              variant="primary"
              className="start-session-btn mt-4"
            >
              Start New Session
            </Button>
          </div>
        );
      case AdminPageState.SEARCH:
        return (
          <div className="song-selection-area">
            <h3>Search for a Song</h3>
            <SongSearch onSearch={handleSearch} />
          </div>
        );
      case AdminPageState.RESULTS:
        return (
          <ResultsPage
            searchResults={searchResults}
            onSelectSong={handleSongSelect}
            onBack={backToSearch}
          />
        );
      case AdminPageState.SONG_DISPLAY:
        return (
          <div className="current-song-container">
            <div className="song-controls mb-4">
              <Button
                onClick={startNewSearch}
                variant="outline"
                className="new-search-btn"
              >
                Search Another Song
              </Button>
              <Button
                onClick={goToLiveSession}
                variant="primary"
                className="live-session-btn"
              >
                Go to Live Session
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-main-page">
      <Header />
      <div className="container">
        <div className="admin-dashboard">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
};
