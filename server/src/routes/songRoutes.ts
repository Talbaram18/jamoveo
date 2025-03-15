import express from 'express';
import { songController } from '../controllers/songController';
/**
 * Song Routes Module
 * */
const router = express.Router();

// Search Songs
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || req.query.query || '';

    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Query must be a string' });
    }

    // use the songController to search songs
    await songController.searchSongs(req, res);
  } catch (error) {
    console.error('Song search route error:', error);
    res.status(500).json({ message: 'Error searching songs' });
  }
});

// Get Specific Song
router.get('/:songId', async (req, res) => {
  try {
    await songController.getSong(req, res);
  } catch (error) {
    console.error('Get song route error:', error);
    res.status(500).json({ message: 'Error fetching song' });
  }
});

export default router;
