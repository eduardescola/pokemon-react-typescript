// PokemonCard.tsx
import React from 'react';

type Pokemon = {
  id: number;
  name: string;
  types: { type: { name: string } }[];
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

const PokemonCard: React.FC<Pokemon> = ({ id, name, types }) => {
  return (
    <div className="card">
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
        alt={name}
        className="sprite"
      />
      <h3>{name.toUpperCase()}</h3>
      <div className="types">
        {types.map((t, idx) => (
          <span
            key={idx}
            className="type"
            style={{ backgroundColor: typeColors[t.type.name] }}
          >
            {t.type.name.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
