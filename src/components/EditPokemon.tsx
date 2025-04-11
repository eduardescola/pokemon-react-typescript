import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddPokemon.css";

const EditPokemon: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "new";

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [sprite, setSprite] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew) {
      const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");
      const pokemon = pokemons.find((p: any) => p.id === Number(id));

      if (pokemon) {
        setName(pokemon.name);
        setType(pokemon.types?.[0]?.type?.name || "");
        setSprite(pokemon.sprite);
      } else {
        setError("Pokémon no encontrado en el almacenamiento local.");
      }
    }
  }, [id, isNew]);

  const handleSubmit = () => {
    if (!name || !type) {
      setError("Nombre y tipo son requeridos");
      return;
    }

    const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");
    let updatedList;

    if (isNew) {
      const newId = Math.max(...pokemons.map((p: any) => p.id), 0) + 1;
      updatedList = [
        ...pokemons,
        {
          id: newId,
          name,
          types: [{ type: { name: type } }],
          sprite: sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${newId}.png`,
        },
      ];
      localStorage.setItem("pokemons", JSON.stringify(updatedList));
      navigate(`/pokemon/${newId}`);
    } else {
      updatedList = pokemons.map((p: any) =>
        p.id === Number(id)
          ? { ...p, name, types: [{ type: { name: type } }], sprite }
          : p
      );
      localStorage.setItem("pokemons", JSON.stringify(updatedList));
      navigate(`/pokemon/${id}`);
    }
  };

  return (
    <div className="add-page-wrapper">
      <div className="edit-container nes-container is-rounded">
        <h2>Editar Pokémon</h2>
        {error && <p className="error">{error}</p>}
  
        <label>Nombre:</label>
        <input className="nes-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
  
        <label>Tipo:</label>
        <input className="nes-input" type="text" value={type} onChange={(e) => setType(e.target.value)} />
  
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

export default EditPokemon;
