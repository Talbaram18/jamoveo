import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from '../types/user';
import { Song } from '../types/song';
/**
 * Database Utility Module
 *
 * This module provides a simple JSON-based database implementation for the local db in the app.
 * */
const USERS_DB_PATH = path.join(__dirname, 'users.json');
const SONGS_DIR = path.join(__dirname, 'songs');

//reading from and writing to JSON files
class JsonDatabase {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async read<T>(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, return empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
        return [];
      }
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  async write<T>(data: T[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
      throw error;
    }
  }
}

export const dbUtils = {
  //all users
  async getUsers(): Promise<User[]> {
    const userDb = new JsonDatabase(USERS_DB_PATH);
    return userDb.read<User>();
  },

  // Add a new user
  async addUser(user: User): Promise<boolean> {
    try {
      const userDb = new JsonDatabase(USERS_DB_PATH);
      const users = await userDb.read<User>();

      // Prevent duplicate usernames
      if (users.some((u) => u.username === user.username)) {
        return false;
      }

      users.push(user);
      await userDb.write(users);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  },

  // Find user by username
  async findUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.username === username) || null;
  },

  // Get all songs
  async getSongs(): Promise<Song[]> {
    try {
      const songFiles = await fs.readdir(SONGS_DIR);
      const songs: Song[] = [];

      for (const file of songFiles) {
        if (!file.endsWith('.json')) continue;

        try {
          const songPath = path.join(SONGS_DIR, file);
          const songRawData = await fs.readFile(songPath, 'utf8');
          const songData = JSON.parse(songRawData);

          // Check if the song uses the new format with metadata or not
          if (songData.metadata && songData.lyrics) {
            songs.push({
              id: file.replace('.json', ''),
              title: songData.metadata.title,
              artist: songData.metadata.artist,
              lyrics: songData.lyrics,
              language: songData.metadata.language,
            });
          } else {
            const songId = file.replace('.json', '');
            const songTitle = songId
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            let songArtist = 'Unknown Artist';
            if (songId.includes('_by_')) {
              songArtist = songId
                .split('_by_')[1]
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }

            songs.push({
              id: songId,
              title: songTitle,
              artist: songArtist,
              lyrics: songData,
            });
          }
        } catch (error) {
          console.error(`Error processing song file ${file}:`, error);
        }
      }

      return songs;
    } catch (error) {
      console.error('Error reading songs directory:', error);
      return [];
    }
  },

  //find song by id
  async findSongById(id: string): Promise<Song | null> {
    try {
      const songPath = path.join(SONGS_DIR, `${id}.json`);
      const songRawData = await fs.readFile(songPath, 'utf8');
      const songData = JSON.parse(songRawData);

      // Check if the song uses the new format with metadata
      if (songData.metadata && songData.lyrics) {
        return {
          id: id,
          title: songData.metadata.title,
          artist: songData.metadata.artist,
          lyrics: songData.lyrics,
          language: songData.metadata.language,
        };
      } else {
        const songTitle = id
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        let songArtist = 'Unknown Artist';
        if (id.includes('_by_')) {
          songArtist = id
            .split('_by_')[1]
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }

        return {
          id,
          title: songTitle,
          artist: songArtist,
          lyrics: songData,
        };
      }
    } catch (error) {
      console.error(`Error finding song ${id}:`, error);
      return null;
    }
  },

  // Search songs
  async searchSongs(query: string): Promise<Song[]> {
    try {
      const songs = await this.getSongs();

      if (!query || query.trim() === '') {
        return songs;
      }

      const lowercaseQuery = query.toLowerCase();

      return songs.filter((song) => {
        const matchesTitle = song.title.toLowerCase().includes(lowercaseQuery);
        const matchesArtist =
          (song.artist && song.artist.toLowerCase().includes(lowercaseQuery)) ||
          (song.artist === 'Unknown Artist' && lowercaseQuery === 'unknown');
        const matchesId = song.id.toLowerCase().includes(lowercaseQuery);

        return matchesTitle || matchesArtist || matchesId;
      });
    } catch (error) {
      console.error('Error searching songs:', error);
      return [];
    }
  },
};
