import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PokemonCard from "./components/PokemonCard"
import TypeFilter from "./components/TypeFilter"
import Pagination from "./components/Pagination"
import SearchBar from "./components/SearchBar"
import Carga from "./components/Carga"
import "./Home.css"

const ITEMS_PER_PAGE = 20
const LOADING_DURATION = 3000 // 3 seconds in milliseconds

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<any[]>([])
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set()) // Cambié esto a un Set para soporte de selección múltiple
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [dataLoaded, setDataLoaded] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const startTime = Date.now()

    // Start loading data
    loadPokemons().then(() => {
      setDataLoaded(true)

      // Calculate remaining time to complete 3 seconds
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, LOADING_DURATION - elapsedTime)

      // Keep showing loading screen until 3 seconds have passed
      setTimeout(() => {
        setLoading(false)
      }, remainingTime)
    })
  }, [])

  const loadPokemons = async () => {
    try {
      const pokemons = await getPokemonsFromStorage()
      setPokemonList(pokemons)
      return pokemons
    } catch (err) {
      console.error("Error loading Pokémon:", err)
      setError("No se pudieron cargar los Pokémon")
    }
  }

  const getPokemonsFromStorage = async () => {
    try {
      const storedPokemons = localStorage.getItem("pokemons")

      if (storedPokemons) {
        return JSON.parse(storedPokemons)
      } else {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
        if (!response.ok) throw new Error(`API error: ${response.status}`)
        const data = await response.json()
        const pokemonData = data.results

        const pokemonDetailsPromises = pokemonData.map((pokemon: any) =>
          fetch(pokemon.url).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch ${pokemon.name}`)
            return res.json()
          }),
        )

        const pokemonDetails = await Promise.all(pokemonDetailsPromises)

        const detailedPokemons = pokemonData.map((pokemon: any, index: number) => ({
          ...pokemon,
          id: pokemonDetails[index].id,
          sprite: pokemonDetails[index].sprites.front_default,
          types: pokemonDetails[index].types.map((type: any) => type.type.name),
          abilities: pokemonDetails[index].abilities.map((ability: any) => ability.ability.name),
        }))

        localStorage.setItem("pokemons", JSON.stringify(detailedPokemons))
        return detailedPokemons
      }
    } catch (error) {
      console.error("Error in getPokemonsFromStorage:", error)
      throw error
    }
  }

  const handleRestoreOriginals = async () => {
    const confirmed = confirm(
      "¿Estás seguro de que quieres restaurar la lista original desde la API? Se perderán los cambios.",
    )
    if (!confirmed) return

    setLoading(true)
    const startTime = Date.now()

    localStorage.removeItem("pokemons")
    await loadPokemons()

    // Calculate remaining time to complete 3 seconds
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, LOADING_DURATION - elapsedTime)

    // Keep showing loading screen until 3 seconds have passed
    setTimeout(() => {
      setLoading(false)
    }, remainingTime)
  }

  const handleTypeFilter = (type: string) => {
    const newFilteredTypes = new Set(filteredTypes);
  
    if (type === "") {
      // "ALL" se ha seleccionado, limpiamos todos los filtros.
      newFilteredTypes.clear();
    } else if (newFilteredTypes.has(type)) {
      // Si el tipo ya está marcado, lo desmarcamos.
      newFilteredTypes.delete(type);
    } else {
      // Si el tipo no está marcado, lo marcamos.
      newFilteredTypes.add(type);
    }
  
    setFilteredTypes(newFilteredTypes);
    setPage(0);
  };  

  const filteredPokemon = pokemonList.filter(
    (pokemon) =>
      (filteredTypes.size === 0 || pokemon.types?.some((t: any) =>
        filteredTypes.has(typeof t === "string" ? t : t?.type?.name),
      )) &&
      pokemon.name?.toLowerCase().includes(search.toLowerCase()),
  )

  const paginatedPokemon = filteredPokemon.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
  const pageCount = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPage(newPage)
    }
  }

  const getRandomPokemon = () => {
    const randomIndex = Math.floor(Math.random() * filteredPokemon.length)
    const randomPokemon = filteredPokemon[randomIndex]
    if (randomPokemon) {
      navigate(`/pokemon/${randomPokemon.id}`)
    }
  }

  const allTypes: { name: string }[] = Array.from(
    new Set(pokemonList.flatMap((p) => p.types?.map((t: any) => (typeof t === "string" ? t : t?.type?.name)))),
  )
    .filter(Boolean)
    .map((name) => ({ name }))

  const handlePokemonAddedOrEdited = (updatedList: any[]) => {
    setPokemonList(updatedList)
    localStorage.setItem("pokemons", JSON.stringify(updatedList))
  }

  if (loading) return <Carga />
  if (error) return <div className="error">{error}</div>

  return (
    <div className="container">
      <div className="header-controls">
        <h1 className="title">Lista de Pokémon</h1>
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          allPokemonNames={pokemonList.map((p) => p.name)}
        />
        <TypeFilter
          types={allTypes}
          filteredType={Array.from(filteredTypes)}
          onTypeFilter={(type) => handleTypeFilter(type === "" ? "" : type)}  // Enviar "" cuando se hace clic en "ALL"
        />
      </div>
      <div className="pokemon-grid">
        {paginatedPokemon.map((pokemon) => (
          <div key={pokemon.id} className="card-wrapper" onClick={() => navigate(`/pokemon/${pokemon.id}`)}>
            <div className="card-link">
              <PokemonCard
                {...pokemon}
                onEdit={(id) => {
                  navigate(`/edit/${id}`)
                }}
                onDelete={(id) => {
                  const confirmed = confirm("¿Estás seguro de que quieres eliminar este Pokémon?")
                  if (confirmed) {
                    const updatedList = pokemonList.filter((p) => p.id !== id)
                    handlePokemonAddedOrEdited(updatedList)
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Contenedor para la paginación y botones */}
      <div className="bottom-controls">
        <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
        <div className="buttons">
          <button className="nes-btn is-primary" onClick={getRandomPokemon}>
            Random Pokémon
          </button>
          <button className="nes-btn is-success" onClick={() => navigate("/add/new")}>
            Añadir Pokémon
          </button>
          <button className="nes-btn is-warning" onClick={handleRestoreOriginals}>
            <i className="fas fa-sync-alt"></i> Restaurar desde API
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
