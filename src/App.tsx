"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./Home"
import PokemonDetail from "./components/PokemonDetail"
import EditPokemon from "./components/EditPokemon"
import AddPokemon from "./components/AddPokemon"

export default function App() {
  // Este useEffect eliminará el cursor de Mickey Mouse y hará el cursor de pokeball más pequeño
  useEffect(() => {
    // Crear un estilo que sobrescriba el cursor de Mickey Mouse con un cursor de pokeball más pequeño
    const styleElement = document.createElement("style")
    styleElement.innerHTML = `
      html, body, *, *::before, *::after {
        cursor: url("/public/poke32.png") 16 16, auto !important;
      }
    `
    // Añadir el estilo al final del <head> para que tenga mayor prioridad
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
      <Route path="/pokemon/" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/edit/:id" element={<EditPokemon />} />
      <Route path="/add/new" element={<AddPokemon />} />
    </Routes>
  )
}
