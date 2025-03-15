import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { SongSearchResult } from '../types/song';
import { useSongSearch } from '../hooks/useSongSearch';
import { ResultsPageProps } from './interfaces';
/**
 * ResultsPage Component
 *
 * Displays search results from song queries and allows users to select a song.
 * */

export const ResultsPage: React.FC<ResultsPageProps> = ({
  searchResults,
  onSelectSong,
  onBack,
}) => {
  // Track which song is currently selected

  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  // Get the fetchSongDetails function from the useSongSearch hook

  const { fetchSongDetails } = useSongSearch();

  const handleSongSelect = async (songResult: SongSearchResult) => {
    try {
      const fullSongDetails = await fetchSongDetails(songResult.id);

      if (fullSongDetails) {
        setSelectedSongId(songResult.id);
        onSelectSong(fullSongDetails);
      }
    } catch (error) {
      console.error('Error fetching song details:', error);
    }
  };

  const handleCardClick = (song: SongSearchResult) => {
    handleSongSelect(song);
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement> | undefined,
    song: SongSearchResult
  ) => {
    if (event) {
      event.stopPropagation();
    }
    handleSongSelect(song);
  };

  return (
    <div className="results-page">
      <div className="results-header">
        <Button onClick={onBack} variant="outline" className="back-button">
          ← Back to Search
        </Button>
        <h2>Search Results ({searchResults.length})</h2>
      </div>

      <div className="results-grid">
        {searchResults.map((song) => (
          <div
            key={song.id}
            className={`song-result-card ${
              selectedSongId === song.id ? 'selected' : ''
            }`}
            onClick={() => handleCardClick(song)}
          >
            <div className="song-card-content">
              <h3 className="song-title">{song.title}</h3>
              {song.artist && <p className="song-artist">by {song.artist}</p>}

              <div className="song-card-actions">
                <Button
                  onClick={(event) => handleButtonClick(event, song)}
                  variant={selectedSongId === song.id ? 'secondary' : 'primary'}
                  className="select-song-button"
                >
                  {selectedSongId === song.id ? 'Selected' : 'Select Song'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {searchResults.length === 0 && (
        <div className="no-results">
          <p>No songs found matching your search.</p>
          <Button onClick={onBack} variant="primary">
            Try Another Search
          </Button>
        </div>
      )}
    </div>
  );
};
