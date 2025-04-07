// App.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import PokemonCard from './components/PokemonCard';
import TypeFilter from './components/TypeFilter';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import './App.css';

const ITEMS_PER_PAGE = 20;

const App: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getPokemonsFromStorage()
      .then((pokemons) => {
        setPokemonList(pokemons);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los Pokémon');
        setLoading(false);
      });
  }, []);

  const filteredPokemon = pokemonList.filter((pokemon) =>
    (!filteredType ||
      pokemon.types?.some((t: any) =>
        typeof t === 'string'
          ? t === filteredType
          : t?.type?.name === filteredType
      )) &&
    pokemon.name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedPokemon = filteredPokemon.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const pageCount = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPage(newPage);
    }
  };

  const getPokemonsFromStorage = async () => {
    const storedPokemons = localStorage.getItem('pokemons');

    if (storedPokemons) {
      return JSON.parse(storedPokemons);
    } else {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      const pokemonData = data.results;

      const pokemonDetailsPromises = pokemonData.map((pokemon: any) =>
        fetch(pokemon.url).then((res) => res.json())
      );

      const pokemonDetails = await Promise.all(pokemonDetailsPromises);

      const detailedPokemons = pokemonData.map((pokemon: any, index: number) => ({
        ...pokemon,
        id: pokemonDetails[index].id,
        sprite: pokemonDetails[index].sprites.front_default,
        types: pokemonDetails[index].types,
      }));

      localStorage.setItem('pokemons', JSON.stringify(detailedPokemons));

      return detailedPokemons;
    }
  };

  const handleTypeFilter = (type: string) => {
    setFilteredType(type === filteredType ? null : type);
    setPage(0);
  };

  const allTypes: { name: string }[] = Array.from(
    new Set(
      pokemonList.flatMap((p) =>
        p.types?.map((t: any) =>
          typeof t === 'string' ? t : t?.type?.name
        )
      )
    )
  )
    .filter(Boolean)
    .map((name) => ({ name }));

  const getRandomPokemon = () => {
    const randomIndex = Math.floor(Math.random() * filteredPokemon.length);
    const randomPokemon = filteredPokemon[randomIndex];
    if (randomPokemon) {
      navigate(`/pokemon/${randomPokemon.id}`);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Lista de Pokémon</h1>
      <SearchBar search={search} onSearchChange={setSearch} allPokemonNames={pokemonList.map((p) => p.name)} />
      <TypeFilter types={allTypes} filteredType={filteredType} onTypeFilter={handleTypeFilter} />
      <div className="pokemon-grid">
        {paginatedPokemon.map((pokemon) => (
          // Asegúrate de que `Link` rodea solo el contenido de la card (sin envolver el <a> dentro del Link)
          <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`}>
            <PokemonCard {...pokemon} />
          </Link>
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
      <button className="nes-btn is-primary" onClick={getRandomPokemon}>
        Random Pokémon
      </button>
    </div>
  );
};

export default App;
