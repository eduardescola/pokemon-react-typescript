import React from 'react';
import './TypeFilter.css'; // Importa el archivo CSS

type Type = {
  name: string;
};

const typeStyles: Record<string, { icon: string }> = {
  normal: { icon: 'fas fa-paw' },
  fire: { icon: 'fas fa-fire' },
  water: { icon: 'fas fa-tint' },
  electric: { icon: 'fas fa-bolt' },
  grass: { icon: 'fas fa-leaf' },
  ice: { icon: 'fas fa-snowflake' },
  fighting: { icon: 'fas fa-dumbbell' },
  poison: { icon: 'fas fa-skull-crossbones' },
  ground: { icon: 'fas fa-mountain' },
  flying: { icon: 'fas fa-feather' },
  psychic: { icon: 'fas fa-brain' },
  bug: { icon: 'fas fa-bug' },
  rock: { icon: 'fas fa-gem' },
  ghost: { icon: 'fas fa-ghost' },
  dragon: { icon: 'fas fa-dragon' },
  dark: { icon: 'fas fa-moon' },
  steel: { icon: 'fas fa-cogs' },
  fairy: { icon: 'fas fa-star' },
  stellar: { icon: 'fas fa-star-of-life' },
};

const validTypes = Object.keys(typeStyles);

type TypeFilterProps = {
  types: Type[];
  filteredType: string[];
  onTypeFilter: (type: string) => void;
};

const TypeFilter: React.FC<TypeFilterProps> = ({ types, filteredType, onTypeFilter }) => {
  return (
    <div className="filters">
      {/* Botón ALL: Se marca cuando no hay filtros activos */}
      <button
        className={`type-button all ${filteredType.length === 0 ? 'is-active' : ''}`}
        onClick={() => onTypeFilter('')} // "ALL" limpia el filtro
      >
        ALL
      </button>
      {types
        .filter((type) => validTypes.includes(type.name))
        .map((type) => {
          return (
            <button
              key={type.name}
              className={`type-button ${type.name} ${filteredType.includes(type.name) ? 'is-active' : ''}`}
              onClick={() => onTypeFilter(type.name)} // Se marca o desmarca el tipo
            >
              <i className={`${typeStyles[type.name]?.icon} icon`}></i>
              {type.name.toUpperCase()}
            </button>
          );
        })}
    </div>
  );
};

export default TypeFilter;
