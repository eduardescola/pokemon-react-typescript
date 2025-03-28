import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

interface Pokemon {
  name: string;
  url: string;
  id?: number;
  sprites?: {
    front_default: string;
  };
  types?: { type: { name: string } }[];
}

const Pokedex: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${page * 20}`)
      .then((response) => response.json())
      .then(async (data) => {
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );
        setPokemons(detailedPokemons);
      });
  }, [page]);

  useEffect(() => {
    if (search.length > 1) {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
        .then((response) => response.json())
        .then((data) => {
          const filtered = data.results
            .map((p: Pokemon) => p.name)
            .filter((name: string) => name.includes(search.toLowerCase()));
          setSuggestions(filtered.slice(0, 5));
        });
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handleSearch = () => {
    navigate(`/pokemon/${search.toLowerCase()}`);
  };

  return (
    <div>
      <h1>Pokédex</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Pokémon"
      />
      <button onClick={handleSearch}>Search</button>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s) => (
            <li key={s} onClick={() => setSearch(s)}>{s}</li>
          ))}
        </ul>
      )}
      <select onChange={(e) => setFilterType(e.target.value)}>
        <option value="">All Types</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
      </select>
      <div className="grid">
        {pokemons
          .filter((p) =>
            filterType ? p.types?.some((t) => t.type.name === filterType) : true
          )
          .map((pokemon) => (
            <div key={pokemon.id} className="card" onClick={() => navigate(`/pokemon/${pokemon.name}`)}>
              <h2>{pokemon.name}</h2>
              <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
            </div>
          ))}
      </div>
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

const PokemonDetail: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const pokemonName = pathname.split("/").pop() || "";

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data));
  }, [pokemonName]);

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      {pokemon ? (
        <div>
          <h1>{pokemon.name}</h1>
          <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
          <h3>Types:</h3>
          <ul>
            {pokemon.types?.map((t, index) => (
              <li key={index}>{t.type.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
