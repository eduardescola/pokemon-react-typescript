// App.tsx
import React, { useEffect, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import TypeFilter from "./components/TypeFilter";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";

type Pokemon = {
  name: string;
  url: string;
  id: number;
  types: { type: { name: string } }[];
};

type Type = {
  name: string;
};

const App: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page * 20}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Pokémon List:', data);
        const promises = data.results.map((pokemon: { name: string; url: string }) => 
          fetch(pokemon.url).then((res) => res.json())
        );
        return Promise.all(promises);
      })
      .then((pokemonData) => {
        setPokemonList(pokemonData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => setTypes(data.results))
      .catch((err) => console.error(err));
  }, []);

  const handleTypeFilter = (type: string) => {
    setFilteredType(type === filteredType ? null : type);
  };

  const filteredPokemon = pokemonList.filter((pokemon) =>
    (!filteredType || pokemon.types.some((t) => t.type.name === filteredType)) &&
    pokemon.name.includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Pokémon List</h1>
      <SearchBar search={search} onSearchChange={setSearch} />
      <TypeFilter types={types} filteredType={filteredType} onTypeFilter={handleTypeFilter} />
      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} {...pokemon} />
        ))}
      </div>
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
};

export default App;
