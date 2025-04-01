import { useEffect, useState } from "react";

type Pokemon = {
  name: string;
  url: string;
  id: number;
  types: { type: { name: string } }[];
};

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

function App() {
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
      
      <input
        type="text"
        placeholder="Search Pokémon"
        className="input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        {types.map((type) => (
          <button
            key={type.name}
            className="type-button"
            style={{ backgroundColor: typeColors[type.name] || "gray" }}
            onClick={() => handleTypeFilter(type.name)}
          >
            {type.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="card">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
              className="sprite"
            />
            <h3>{pokemon.name.toUpperCase()}</h3>
            <div className="types">
              {pokemon.types.map((t, idx) => (
                <span key={idx} className="type" style={{ backgroundColor: typeColors[t.type.name] }}>
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 0} className="button">Prev</button>
        <button onClick={() => setPage(page + 1)} className="button">Next</button>
      </div>
    </div>
  );
}

export default App;