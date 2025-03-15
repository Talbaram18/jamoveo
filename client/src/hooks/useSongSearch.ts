import { useState } from 'react';
import { SongSearchResult, Song } from '../types/song';
import { API } from '../utils/api';

/**
 * Custom hook for searching and fetching song data
 */
export const useSongSearch = () => {
  // State to store search results from the API
  const [searchResults, setSearchResults] = useState<SongSearchResult[]>([]);

  // State to store the currently selected song with full details
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const searchSongs = async (query: string) => {
    try {
      const results = await API.searchSongs(query);
      setSearchResults(results);
    } catch (err) {
      // Clear results on error
      setSearchResults([]);
    }
  };

  //fetching the song detailes
  const fetchSongDetails = async (songId: string): Promise<Song | null> => {
    try {
      const song = await API.getSong(songId);
      setSelectedSong(song);
      return song;
    } catch (err) {
      setSelectedSong(null);
      return null;
    }
  };

  //reset the search
  const resetSearch = () => {
    setSearchResults([]);
    setSelectedSong(null);
  };

  return {
    searchResults,
    selectedSong,
    searchSongs,
    fetchSongDetails,
    resetSearch,
  };
};
