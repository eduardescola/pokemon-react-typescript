import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPokemon: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [sprite, setSprite] = useState("");
  const [abilities, setAbilities] = useState("");  // Nuevo estado para habilidades
  const [height, setHeight] = useState("");  // Nuevo estado para altura
  const [weight, setWeight] = useState("");  // Nuevo estado para peso
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name || !type || !height || !weight) {
      setError("Nombre, tipo, altura y peso son requeridos");
      return;
    }

    const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");
    const newId = Math.max(...pokemons.map((p: any) => p.id), 0) + 1;

    // Si no se proporciona habilidades, asignamos un valor predeterminado
    const abilitiesArray = abilities
      ? abilities.split(',').map((ability: string) => ({ ability: { name: ability.trim() } }))
      : [];

    // Crear un nuevo Pokémon con los valores proporcionados
    const updatedList = [
      ...pokemons,
      {
        id: newId,
        name,
        types: [type],  // Asegúrate de que `types` sea un arreglo de strings
        sprite: sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${newId}.png`,
        abilities: abilitiesArray, // Asignar las habilidades
        height: parseInt(height, 10), // Convertir altura a número
        weight: parseInt(weight, 10), // Convertir peso a número
      },
    ];

    localStorage.setItem("pokemons", JSON.stringify(updatedList));

    // Redirigir al detalle del Pokémon recién creado
    navigate(`/pokemon/${newId}`);
  };

  return (
    <div className="edit-container">
      <h2>Añadir Pokémon</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <label>Nombre:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      
      <label>Tipo:</label>
      <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
      
      <label>Habilidades (separadas por coma, opcional):</label>
      <input
        type="text"
        value={abilities}
        onChange={(e) => setAbilities(e.target.value)}
        placeholder="Por ejemplo: levitate, overgrow"
      />
      
      <label>Altura (en decímetros, requerido):</label>
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Por ejemplo: 10"
      />
      
      <label>Peso (en hectogramos, requerido):</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Por ejemplo: 60"
      />
      
      <label>URL de Sprite (opcional):</label>
      <input
        type="text"
        value={sprite}
        onChange={(e) => setSprite(e.target.value)}
      />
      <br />
      
      <button className="nes-btn is-primary" onClick={handleSubmit}>
        Guardar
      </button>
      <button className="nes-btn" onClick={() => navigate("/")}>
        Cancelar
      </button>
    </div>
  );
};

export default AddPokemon;
