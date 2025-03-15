import { Request, Response } from 'express';
import { dbUtils } from '../database/dbUtils';
/**
 * Song Controller
 * Handles all song-related operations including searching for songs
 * */

export const songController = {
  async searchSongs(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || '';

      // Search songs
      const songs = await dbUtils.searchSongs(query);

      // Map to search results
      const searchResults = songs.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist || 'Unknown Artist',
      }));

      res.json(searchResults);
    } catch (error) {
      console.error('Song search error:', error);
      res.status(500).json({ message: 'Error searching songs' });
    }
  },

  async getSong(req: Request, res: Response) {
    try {
      const { songId } = req.params;

      // Find song by ID
      const song = await dbUtils.findSongById(songId);

      if (!song) {
        return res.status(404).json({ message: 'Song not found' });
      }

      res.json(song);
    } catch (error) {
      console.error('Get song error:', error);
      res.status(500).json({ message: 'Error fetching song' });
    }
  },
};
