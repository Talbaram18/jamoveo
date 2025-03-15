import React, { useState, useEffect, useRef } from 'react';
import { SongLyric } from '../../types/song';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { SongDisplayProps } from '../interfaces';

/**
 * SongDisplay component for rendering song lyrics with chords
 * - Displays song title and artist
 * - Renders lyrics with chords positioned above words
 * - Supports auto-scrolling functionality
 * - Handles RTL languages like Hebrew
 * - Admin can quit the current session
 */

export const SongDisplay: React.FC<SongDisplayProps> = ({
  song,
  showChords = true,
}) => {
  // Get auth and socket data
  const { user } = useAuth();
  const { quitSession } = useSocket(user);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Auto-scroll state and refs

  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = 1;

  // Helper function to detect Hebrew text
  const isHebrewText = (text: string): boolean => {
    // The Hebrew Unicode range
    const hebrewPattern = /[\u0590-\u05FF]/;
    return hebrewPattern.test(text);
  };

  // Extract artist
  const getArtist = (): string => {
    if (song.artist) {
      return song.artist;
    }

    return 'Unknown Artist';
  };

  const getLyrics = (): SongLyric[][] => {
    //we have lyrics
    if (Array.isArray(song.lyrics)) {
      return song.lyrics;
    }
    //no valid lyrics found
    return [];
  };

  // Auto-scrolling effect
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    if (isAutoScrolling && containerRef.current) {
      scrollInterval = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop += scrollSpeed;

          // When reaching the bottom, stop auto-scrolling
          if (
            containerRef.current.scrollTop +
              containerRef.current.clientHeight >=
            containerRef.current.scrollHeight - 10 // Small buffer
          ) {
            setIsAutoScrolling(false);
          }
        }
      }, 50);
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isAutoScrolling]);

  // Toggle auto-scroll
  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  // Handle quit session for admin
  const handleQuitSession = () => {
    if (
      window.confirm('Are you sure you want to end this session for all users?')
    ) {
      quitSession(); // This will end the session for all users
    }
  };

  // Render a line of lyrics with chords
  const renderLyricLine = (line: SongLyric[]) => {
    // Determine if the entire line is Hebrew
    const containsHebrew = line.some((word) => isHebrewText(word.lyrics));

    // Use the HTML dir attribute to handle RTL text correctly
    return (
      <div
        dir={containsHebrew ? 'rtl' : 'ltr'}
        className="lyric-line-container"
      >
        {line.map((word, wordIndex) => (
          <span key={wordIndex} className="word-container">
            {showChords && word.chords && (
              <span className="chord-above">{word.chords}</span>
            )}
            <span className="word-text">{word.lyrics}</span>{' '}
          </span>
        ))}
      </div>
    );
  };
  // Get artist and lyrics
  const artist = getArtist();
  const lyrics = getLyrics();

  return (
    <div className="song-display-container">
      <div className="song-header">
        <h2 className="song-title">
          {song.title}
          {<span className="song-artist"> - {artist}</span>}
        </h2>
      </div>

      {/* Controls above lyrics with both buttons */}
      <div className="song-controls-top">
        {/* Only show quit button to admins */}
        {isAdmin && (
          <Button
            onClick={handleQuitSession}
            variant="secondary"
            className="quit-session-btn"
          >
            Quit
          </Button>
        )}

        <Button
          onClick={toggleAutoScroll}
          variant={isAutoScrolling ? 'secondary' : 'primary'}
          className={`auto-scroll-toggle ${isAutoScrolling ? 'active' : ''}`}
        >
          {'Auto-Scroll'}
        </Button>
      </div>

      <div
        ref={containerRef}
        className={`lyrics-container ${
          isAutoScrolling ? 'auto-scrolling' : ''
        }`}
      >
        {lyrics.length > 0 ? (
          lyrics.map((line, lineIndex: number) => (
            <div key={lineIndex} className="lyric-line">
              {Array.isArray(line) && line.length > 0 ? (
                renderLyricLine(line)
              ) : (
                <br />
              )}
            </div>
          ))
        ) : (
          <div className="no-lyrics-message">
            No lyrics available for this song.
          </div>
        )}

        <div style={{ height: '50px' }}></div>
      </div>
    </div>
  );
};
