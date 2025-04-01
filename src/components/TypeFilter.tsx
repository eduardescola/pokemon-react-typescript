// TypeFilter.tsx
import React from 'react';

type Type = {
  name: string;
};

const typeColors: Record<string, string> = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

type TypeFilterProps = {
  types: Type[];
  filteredType: string | null;
  onTypeFilter: (type: string) => void;
};

const TypeFilter: React.FC<TypeFilterProps> = ({ types, filteredType, onTypeFilter }) => {
  return (
    <div className="filters">
      {types.map((type) => (
        <button
          key={type.name}
          className="type-button"
          style={{ backgroundColor: typeColors[type.name] || "gray" }}
          onClick={() => onTypeFilter(type.name)}
        >
          {type.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default TypeFilter;
