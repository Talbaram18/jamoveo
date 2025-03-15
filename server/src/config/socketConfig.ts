import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { User } from '../types/user';
import { Song } from '../types/song';
/**
 * Socket.io Configuration
 * */
export const configureSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Track connected users and active session
  const connectedUsers: Map<string, User> = new Map();
  let currentSong: Song | null = null;

  io.on('connection', (socket) => {
    console.log('New client connected');

    // User joins rehearsal
    socket.on('join-rehearsal', (user: User) => {
      // Store user in connected users
      connectedUsers.set(socket.id, user);

      // Broadcast User joined
      io.emit('user-joined', user);

      // send active song  to the new user
      if (currentSong) {
        socket.emit('load-song', currentSong);
      }
    });

    // Song selection
    socket.on('song-selected', (song: Song) => {
      // Update current song
      currentSong = song;
    });

    // Quit session (used by admin)
    socket.on('quit-session', () => {
      console.log('Admin ended the session');

      // Reset song
      currentSong = null;

      // broadcast all users
      io.emit('session-ended');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);

      if (user) {
        // Remove user from connected users
        connectedUsers.delete(socket.id);

        // Broadcast user left
        io.emit('user-left', user);
      }

      console.log('Client disconnected');
    });
  });

  return io;
};
