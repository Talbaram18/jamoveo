import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { Song } from '../types/song';
import { User } from '../types/user';
import { CLIENT_ROUTES } from '../utils/constants';
import { CONFIG } from '../utils/config';
/**
 * Custom hook for socket.io integration
 * Manages socket connection, song data, and user tracking
 */
export const useSocket = (user: User | null) => {
  // Socket connection instance

  const [socket, setSocket] = useState<typeof Socket | null>(null);
  //currently selected song in the session

  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  //establish socket connection
  useEffect(() => {
    if (!user) {
      setSocket(null);
      return;
    }

    // Create socket connection
    const newSocket = io(CONFIG.SOCKET_URL, {
      query: { userId: user.id },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);

      // join rehearsal room when connected
      newSocket.emit('join-rehearsal', user);
    });

    // Song loading event
    newSocket.on('load-song', (song: Song) => {
      console.log('Received song data from server:', song);
      setCurrentSong(song);
    });

    // Session ended handling
    newSocket.on('session-ended', () => {
      console.log('Session ended by admin');
      setCurrentSong(null);

      // direct the user to page based on user role
      if (user) {
        window.location.href =
          user.role === 'admin'
            ? CLIENT_ROUTES.ADMIN_MAIN
            : CLIENT_ROUTES.PLAYER_MAIN;
      }
    });

    // Set the socket
    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Song selection
  const selectSong = useCallback(
    (song: Song) => {
      if (socket) {
        socket.emit('song-selected', song);
      }
    },
    [socket]
  );

  // quit session
  const quitSession = useCallback(() => {
    if (socket) {
      console.log('Quitting session');
      socket.emit('quit-session');
    }
  }, [socket]);

  return {
    socket,
    currentSong,
    selectSong,
    quitSession,
  };
};
