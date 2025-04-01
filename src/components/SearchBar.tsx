// SearchBar.tsx
import React from 'react';

type SearchBarProps = {
  search: string;
  onSearchChange: (search: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search Pokémon"
      className="input"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default SearchBar;
