import React, { useState, useEffect } from 'react';

type SearchBarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  allPokemonNames: string[]; // ← pasás todos los nombres disponibles
};

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  onSearchChange,
  allPokemonNames,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (search.trim() === '') {
      setSuggestions([]);
    } else {
      const matches = allPokemonNames.filter((name) =>
        name.toLowerCase().startsWith(search.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5)); // máximo 5 sugerencias
    }
  }, [search, allPokemonNames]);

  return (
    <div style={{ marginBottom: '1rem', position: 'relative' }}>
      <input
        type="text"
        placeholder="Search Pokémon"
        className="input"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul
        className="suggestions-list"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          maxHeight: '120px', // 👈 limita la altura
          overflowY: 'auto',   // 👈 agrega scroll si hay muchas
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          listStyle: 'none',
          padding: '0.25rem', // 👈 menos padding
          marginTop: '0.3rem',
          zIndex: 5,
        }}
      >
        {suggestions.map((name, idx) => (
          <li
            key={idx}
            style={{
              padding: '0.2rem 0.4rem', // 👈 más compacto
              cursor: 'pointer',
              fontSize: '0.9rem', // 👈 un poco más chico
            }}
            onClick={() => onSearchChange(name)}
          >
            {name}
          </li>
        ))}
      </ul>      
      )}
    </div>
  );
};

export default SearchBar;
