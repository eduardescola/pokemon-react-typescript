import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPokemon.css";

const AddPokemon: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [sprite, setSprite] = useState("");
  const [abilities, setAbilities] = useState("");  // Habilidades como string[]
  const [height, setHeight] = useState("");  // Altura en decímetros
  const [weight, setWeight] = useState("");  // Peso en hectogramos
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name || !type || !height || !weight) {
      setError("Nombre, tipo, altura y peso son requeridos");
      return;
    }

    const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");
    const newId = Math.max(...pokemons.map((p: any) => p.id), 0) + 1;

    const abilitiesArray = abilities
      ? abilities.split(',').map((ability: string) => ability.trim())
      : [];

    const updatedList = [
      ...pokemons,
      {
        id: newId,
        name,
        types: [type],
        sprite: sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${newId}.png`,
        abilities: abilitiesArray,
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
      },
    ];

    localStorage.setItem("pokemons", JSON.stringify(updatedList));
    navigate(`/pokemon/${newId}`);
  };

  return (
    <div className="add-page-wrapper">
      <div className="edit-container nes-container is-rounded">
        <h2>Añadir Pokémon</h2>
        {error && <p className="error">{error}</p>}
  
        <label>Nombre:</label>
        <input className="nes-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
  
        <label>Tipo:</label>
        <input className="nes-input" type="text" value={type} onChange={(e) => setType(e.target.value)} />
  
        <label>Habilidades (separadas por coma, opcional):</label>
        <input
          className="nes-input"
          type="text"
          value={abilities}
          onChange={(e) => setAbilities(e.target.value)}
          placeholder="Por ejemplo: levitate, overgrow"
        />
  
        <label>Altura (en decímetros, requerido):</label>
        <input
          className="nes-input"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Por ejemplo: 10"
        />
  
        <label>Peso (en hectogramos, requerido):</label>
        <input
          className="nes-input"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Por ejemplo: 60"
        />
  
        <label>URL de Sprite (opcional):</label>
        <input
          className="nes-input"
          type="text"
          value={sprite}
          onChange={(e) => setSprite(e.target.value)}
        />
        
        <div className="buttons-container">
          <button className="nes-btn is-primary" onClick={handleSubmit}>
            Guardar
          </button>
          <button className="nes-btn" onClick={() => navigate("/")}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );  
};

export default AddPokemon;
