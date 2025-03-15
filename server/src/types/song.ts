export interface SongLyric {
  lyrics: string;
  chords?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: SongLyric[][];
  language?: string;
}

export interface SongSearchResult {
  id: string;
  title: string;
  artist: string;
}
