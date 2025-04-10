import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./Home"
import PokemonDetail from "./components/PokemonDetail"
import EditPokemon from "./components/EditPokemon"

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:id" element={<PokemonDetail />} />
      <Route path="/pokemon/" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/edit/:id" element={<EditPokemon />} />
    </Routes>
  )
}

export default App
