// TypeFilter.tsx
import React from 'react';

type Type = {
  name: string;
};

// Estilos para los tipos de Pokémon
const typeStyles: Record<string, { color: string; icon: string }> = {
  normal: { color: '#A8A878', icon: 'fas fa-paw' },
  fire: { color: '#F08030', icon: 'fas fa-fire' },
  water: { color: '#6890F0', icon: 'fas fa-tint' },
  electric: { color: '#F8D030', icon: 'fas fa-bolt' },
  grass: { color: '#78C850', icon: 'fas fa-leaf' },
  ice: { color: '#98D8D8', icon: 'fas fa-snowflake' },
  fighting: { color: '#C03028', icon: 'fas fa-dumbbell' },
  poison: { color: '#A040A0', icon: 'fas fa-skull-crossbones' },
  ground: { color: '#E0C068', icon: 'fas fa-mountain' },
  flying: { color: '#A890F0', icon: 'fas fa-feather' },
  psychic: { color: '#F85888', icon: 'fas fa-brain' },
  bug: { color: '#A8B820', icon: 'fas fa-bug' },
  rock: { color: '#B8A038', icon: 'fas fa-gem' },
  ghost: { color: '#705898', icon: 'fas fa-ghost' },
  dragon: { color: '#7038F8', icon: 'fas fa-dragon' },
  dark: { color: '#705848', icon: 'fas fa-moon' },
  steel: { color: '#B8B8D0', icon: 'fas fa-cogs' },
  fairy: { color: '#EE99AC', icon: 'fas fa-star' },
  stellar: { color: '#b0c4de', icon: 'fas fa-star-of-life' }, // Nuevo tipo
};

// Filtrar tipos válidos
const validTypes = Object.keys(typeStyles);

// Definir propiedades para el filtro de tipos
type TypeFilterProps = {
  types: Type[];           // Tipos recibidos
  filteredType: string | null;  // Tipo filtrado actual
  onTypeFilter: (type: string) => void;  // Función que maneja el filtro
};

const TypeFilter: React.FC<TypeFilterProps> = ({ types, filteredType, onTypeFilter }) => {
  return (
    <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {/* Botón para seleccionar todos los tipos */}
      <button
        className={`nes-btn ${filteredType === null ? 'is-primary' : ''}`}
        onClick={() => onTypeFilter('')} // El filtro "null" elimina cualquier filtro
        style={{ backgroundColor: '#777', color: '#fff' }}
      >
        ALL
      </button>

      {/* Mostrar los botones de filtro para los tipos */}
      {types
        .filter((type) => validTypes.includes(type.name))  // Solo tipos válidos
        .map((type) => {
          const style = typeStyles[type.name] || { color: 'gray', icon: 'fas fa-question' };

          return (
            <button
              key={type.name}
              className={`nes-btn ${filteredType === type.name ? 'is-primary' : ''}`}
              style={{
                backgroundColor: style.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.8rem',
                fontSize: '0.7rem',
              }}
              onClick={() => onTypeFilter(type.name)}
            >
              <i className={style.icon}></i>
              {type.name.toUpperCase()}
            </button>
          );
        })}
    </div>
  );
};

export default TypeFilter;
