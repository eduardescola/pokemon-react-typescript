import React from "react"
import "./PokemonCard.css"

type Pokemon = {
  id: number
  name: string
  types: ({ type: { name: string } } | string)[]
}

type Props = Pokemon & {
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

const typeStyles: Record<string, { color: string; icon: string }> = {
  normal: { color: "#A8A878", icon: "fas fa-paw" },
  fire: { color: "#F08030", icon: "fas fa-fire" },
  water: { color: "#6890F0", icon: "fas fa-tint" },
  electric: { color: "#F8D030", icon: "fas fa-bolt" },
  grass: { color: "#78C850", icon: "fas fa-leaf" },
  ice: { color: "#98D8D8", icon: "fas fa-snowflake" },
  fighting: { color: "#C03028", icon: "fas fa-dumbbell" },
  poison: { color: "#A040A0", icon: "fas fa-skull-crossbones" },
  ground: { color: "#E0C068", icon: "fas fa-mountain" },
  flying: { color: "#A890F0", icon: "fas fa-feather" },
  psychic: { color: "#F85888", icon: "fas fa-brain" },
  bug: { color: "#A8B820", icon: "fas fa-bug" },
  rock: { color: "#B8A038", icon: "fas fa-gem" },
  ghost: { color: "#705898", icon: "fas fa-ghost" },
  dragon: { color: "#7038F8", icon: "fas fa-dragon" },
  dark: { color: "#705848", icon: "fas fa-moon" },
  steel: { color: "#B8B8D0", icon: "fas fa-cogs" },
  fairy: { color: "#EE99AC", icon: "fas fa-star" },
  stellar: { color: "#b0c4de", icon: "fas fa-star-of-life" },
}

const PokemonCard: React.FC<Props> = ({ id, name, types, onEdit, onDelete }) => {
  return (
    <div className="pokemon-card nes-container is-rounded">
      <div className="pokemon-actions-top">
        <button className="edit-btn" onClick={() => onEdit?.(id)}>
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button className="delete-btn" onClick={() => onDelete?.(id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
        alt={name}
        className="sprite"
      />
      <h3>{name.toUpperCase()}</h3>
      <div className="types">
        {types.map((t, idx) => {
          const typeName = typeof t === "string" ? t : t?.type?.name
          if (!typeName) return null
          const style = typeStyles[typeName]
          return (
            <span
              key={idx}
              className="type"
              style={{ backgroundColor: style?.color || "#ccc" }}
              title={typeName}
            >
              <i className={style?.icon || "fas fa-question"} style={{ marginRight: "0.3rem" }}></i>
              {typeName.toUpperCase()}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default PokemonCard
