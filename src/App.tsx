"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import PokemonCard from "./components/PokemonCard"
import PokemonDetail from "./components/PokemonDetail"
import TypeFilter from "./components/TypeFilter"
import Pagination from "./components/Pagination"
import SearchBar from "./components/SearchBar"
import "./App.css"

const ITEMS_PER_PAGE = 20

// Create a Home component for the Pokemon list
const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<any[]>([])
  const [filteredType, setFilteredType] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    getPokemonsFromStorage()
      .then((pokemons) => {
        setPokemonList(pokemons)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading Pokemon:", err)
        setError("No se pudieron cargar los Pokémon")
        setLoading(false)
      })
  }, [])

  const filteredPokemon = pokemonList.filter(
    (pokemon) =>
      (!filteredType ||
        pokemon.types?.some((t: any) =>
          typeof t === "string" ? t === filteredType : t?.type?.name === filteredType,
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

  const getPokemonsFromStorage = async () => {
    try {
      const storedPokemons = localStorage.getItem("pokemons")

      if (storedPokemons) {
        return JSON.parse(storedPokemons)
      } else {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
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

  const handleTypeFilter = (type: string) => {
    setFilteredType(type === filteredType ? null : type)
    setPage(0)
  }

  const allTypes: { name: string }[] = Array.from(
    new Set(pokemonList.flatMap((p) => p.types?.map((t: any) => (typeof t === "string" ? t : t?.type?.name)))),
  )
    .filter(Boolean)
    .map((name) => ({ name }))

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
              <PokemonCard {...pokemon} />
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
      <button className="nes-btn is-primary" onClick={getRandomPokemon}>
        Random Pokémon
      </button>
    </div>
  )
}

// Main App component with Routes
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
      {/* Redirect /pokemon/ (without ID) to home */}
      <Route path="/pokemon/" element={<Navigate to="/" replace />} />
      {/* Catch-all route for any other unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
