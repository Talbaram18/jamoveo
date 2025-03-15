// client/src/types/song.ts (and server/src/types/song.ts)
export interface SongLyric {
  lyrics: string;
  chords?: string;
}

export interface Song {
  isAutoScrolling?: boolean;
  onScrollComplete?: () => void;
  id: string;
  title: string;
  artist: string;
  lyrics: SongLyric[][];
  language?: string; // Optional language property for RTL detection
}

export interface SongSearchResult {
  id: string;
  title: string;
  artist: string;
}
