import { UserLogin, UserSignup } from '../types/user';
import { SongSearchResult, Song } from '../types/song';
/**
 * API Module
 * */
// Define the server base URL
const API_BASE_URL = 'http://localhost:5000';

export const API = {
  //auth with the server
  //login functionality
  async login(credentials: UserLogin) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  //signup functionality

  async signup(userData: UserSignup) {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  },

  //search functionality

  async searchSongs(query: string): Promise<SongSearchResult[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${API_BASE_URL}/api/songs/search?q=${encodedQuery}`
      );

      if (!response.ok) {
        throw new Error('Song search failed');
      }

      return response.json();
    } catch (error) {
      console.error('Error in searchSongs:', error);
      throw error;
    }
  },

  //song fetching functionality

  async getSong(songId: string): Promise<Song> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/songs/${songId}`);

      if (!response.ok) {
        throw new Error('Could not fetch song');
      }

      const songData = await response.json();

      return songData;
    } catch (error) {
      console.error('Error in getSong:', error);
      throw error;
    }
  },
};
