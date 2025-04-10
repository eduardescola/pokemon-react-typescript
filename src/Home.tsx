import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PokemonCard from "./components/PokemonCard"
import TypeFilter from "./components/TypeFilter"
import Pagination from "./components/Pagination"
import SearchBar from "./components/SearchBar"
import "./Home.css"

const ITEMS_PER_PAGE = 20

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<any[]>([])
  const [filteredType, setFilteredType] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    loadPokemons()
  }, [])

  const loadPokemons = async () => {
    setLoading(true)
    try {
      const pokemons = await getPokemonsFromStorage()
      setPokemonList(pokemons)
    } catch (err) {
      console.error("Error loading Pokémon:", err)
      setError("No se pudieron cargar los Pokémon")
    } finally {
      setLoading(false)
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
          })
        )

        const pokemonDetails = await Promise.all(pokemonDetailsPromises)

        const detailedPokemons = pokemonData.map((pokemon: any, index: number) => ({
          ...pokemon,
          id: pokemonDetails[index].id,
          sprite: pokemonDetails[index].sprites.front_default,
          types: pokemonDetails[index].types,
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
    const confirmed = confirm("¿Estás seguro de que quieres restaurar la lista original desde la API? Se perderán los cambios.")
    if (!confirmed) return

    localStorage.removeItem("pokemons")
    await loadPokemons()
  }

  const handleTypeFilter = (type: string) => {
    setFilteredType(type === filteredType ? null : type)
    setPage(0)
  }

  const filteredPokemon = pokemonList.filter(
    (pokemon) =>
      (!filteredType ||
        pokemon.types?.some((t: any) =>
          typeof t === "string" ? t === filteredType : t?.type?.name === filteredType
        )) &&
      pokemon.name?.toLowerCase().includes(search.toLowerCase())
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

  const handleCardClick = (id: number) => {
    if (id) {
      navigate(`/pokemon/${id}`)
    } else {
      console.error("Invalid Pokemon ID")
    }
  }

  const allTypes: { name: string }[] = Array.from(
    new Set(pokemonList.flatMap((p) => p.types?.map((t: any) => (typeof t === "string" ? t : t?.type?.name))))
  )
    .filter(Boolean)
    .map((name) => ({ name }))

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="container">
      <h1 className="title">Lista de Pokémon</h1>
      <SearchBar search={search} onSearchChange={setSearch} allPokemonNames={pokemonList.map((p) => p.name)} />
      <TypeFilter types={allTypes} filteredType={filteredType} onTypeFilter={handleTypeFilter} />
      <div className="pokemon-grid">
        {paginatedPokemon.map((pokemon) => (
          <div key={pokemon.id} className="card-wrapper" onClick={() => handleCardClick(pokemon.id)}>
            <div className="card-link">
              <PokemonCard
                {...pokemon}
                onEdit={(id) => {
                  const newName = prompt("Nuevo nombre del Pokémon:")
                  if (newName) {
                    const updatedList = pokemonList.map((p) => (p.id === id ? { ...p, name: newName } : p))
                    setPokemonList(updatedList)
                    localStorage.setItem("pokemons", JSON.stringify(updatedList))
                  }
                }}
                onDelete={(id) => {
                  const confirmed = confirm("¿Estás seguro de que quieres eliminar este Pokémon?")
                  if (confirmed) {
                    const updatedList = pokemonList.filter((p) => p.id !== id)
                    setPokemonList(updatedList)
                    localStorage.setItem("pokemons", JSON.stringify(updatedList))
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
      <button className="nes-btn is-primary" onClick={getRandomPokemon}>
        Random Pokémon
      </button>
      <button className="nes-btn is-success" onClick={() => navigate("/edit/new")}>
        Añadir Pokémon
      </button>
      <button className="nes-btn is-warning" onClick={handleRestoreOriginals}>
        <i className="fas fa-sync-alt"></i> Restaurar desde API
      </button>
    </div>
  )
}

export default Home
