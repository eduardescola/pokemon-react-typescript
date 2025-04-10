import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PokemonDetail.css';

type PokemonDetailProps = {
  id: number;
  name: string;
  types: string[] | { type: { name: string } }[];  // Los tipos ahora pueden ser objetos
  sprite: string;
  height: number;
  weight: number;
  abilities: string[];  // Ahora abilities es un array de strings directamente
};

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
  stellar: { color: '#b0c4de', icon: 'fas fa-star-of-life' },
};

const PokemonDetail: React.FC = () => {
  const { id } = useParams();
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemonFromStorage = () => {
      const storedPokemons = JSON.parse(localStorage.getItem('pokemons') || '[]');
      const pokemon = storedPokemons.find((p: any) => p.id === Number(id));

      if (pokemon) {
        setPokemonDetail(pokemon);
      } else {
        setError('Pokémon no encontrado en el almacenamiento local.');
      }

      setLoading(false);
    };

    loadPokemonFromStorage();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pokemon-detail">
      <img src={pokemonDetail?.sprite} alt={pokemonDetail?.name} />
      <h2>{pokemonDetail?.name.toUpperCase()}</h2>
      <div className="types">
        {pokemonDetail?.types && pokemonDetail.types.length > 0 ? (
          pokemonDetail?.types.map((type, idx) => {
            // Verificamos si el objeto type tiene 'type' y 'type.name'
            const typeName = typeof type === 'string' ? type : type?.type?.name;
            if (!typeName) return null; // Si typeName es undefined o null, no renderizamos nada.
            const style = typeStyles[typeName];

            return (
              <span key={idx} className="type" style={{ backgroundColor: style?.color || '#ccc' }} title={typeName}>
                <i className={style?.icon || 'fas fa-question'} style={{ marginRight: '0.3rem' }}></i>
                {typeName?.toUpperCase()}
              </span>
            );
          })
        ) : (
          <span>No types available</span>
        )}
      </div>
      <div className="stats">
        <p>Height: {pokemonDetail?.height} decimetres</p>
        <p>Weight: {pokemonDetail?.weight} hectograms</p>
        <p>
          Abilities: 
          {pokemonDetail?.abilities && pokemonDetail.abilities.length > 0 ? (
            pokemonDetail.abilities.map((ability, idx) => {
              return (
                <span key={idx}>
                  {ability}{idx < pokemonDetail.abilities.length - 1 ? ', ' : ''}
                </span>
              );
            })
          ) : (
            'No abilities available'
          )}
        </p>
      </div>
    </div>
  );
};

export default PokemonDetail;
