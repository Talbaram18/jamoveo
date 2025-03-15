import React from 'react';
import { SongDisplay } from '../components/song/SongDisplay';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { adaptSongData } from '../utils/SongDataAdapter';
import '../styles/LivePage.css';
/**
 * LivePage Component
 * This component renders the live session view for band members.

 */
export const LivePage: React.FC = () => {
  // Get authenticated user information

  const { user } = useAuth();
  const { currentSong } = useSocket(user);
  //  if the user is a vocalist to customize the display
  const isVocalist = user?.instrument === 'vocals';
  // Format the song data for display using the adapter utility

  const formattedSong = currentSong ? adaptSongData(currentSong) : null;

  return (
    <div className="live-page">
      <div className="live-page-container">
        {formattedSong ? (
          <div className="live-session">
            <div className="session-header">
              <h1>{formattedSong.title}</h1>
              {formattedSong.artist && <h2>{formattedSong.artist}</h2>}
            </div>
            <SongDisplay song={formattedSong} showChords={!isVocalist} />
          </div>
        ) : (
          <div className="no-active-session">
            <h2>No Active Session</h2>
            <p>Waiting for the admin to start a session...</p>
          </div>
        )}
      </div>
    </div>
  );
};
