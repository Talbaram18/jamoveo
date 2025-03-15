import { Song, SongSearchResult } from '../types/song';

export interface ResultsPageProps {
  searchResults: SongSearchResult[];
  onSelectSong: (song: Song) => void;
  onBack: () => void;
}
