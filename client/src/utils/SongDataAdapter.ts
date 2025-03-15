/**
 * Adapts song data from the backend to the format expected by the SongDisplay component
 */
export function adaptSongData(rawSong: any) {
  // Check if song data is available
  if (!rawSong) return null;

  // For new format with metadata and lyrics
  if (rawSong.metadata && rawSong.lyrics) {
    return {
      id: rawSong.id || 'unknown',
      title: rawSong.metadata.title,
      artist: rawSong.metadata.artist,
      lyrics: rawSong.lyrics,
      language: rawSong.metadata.language,
    };
  }

  // songs already containing lyrics in the correct format
  if (rawSong.lyrics && Array.isArray(rawSong.lyrics)) {
    return {
      id: rawSong.id,
      title: rawSong.title || 'Untitled',
      artist: rawSong.artist || 'Unknown Artist',
      lyrics: rawSong.lyrics,
      language: rawSong.language,
    };
  }

  // Handle case where the song might be just the raw lyrics array
  if (Array.isArray(rawSong)) {
    return {
      id: 'unknown',
      title: 'Untitled Song',
      artist: 'Unknown Artist',
      lyrics: rawSong,
    };
  }
}
