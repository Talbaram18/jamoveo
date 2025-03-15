import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SongSearchProps } from '../interfaces';

/**
 * SongSearch component
 * Handles search queries
 **/
export const SongSearch: React.FC<SongSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // State to track the user's search input

  // triggers the search if query is not empty

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="song-search-container">
      {/* Search form */}

      <form onSubmit={handleSearch} className="song-search-form">
        <div className="search-input-row">
          {/* Search input field */}

          <Input
            type="text"
            name="songSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter song title or artist..."
            className="flex-grow"
          />
          {/* Search button - disabled when search query is empty */}

          <Button type="submit" disabled={!searchQuery} className="ml-2">
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};
