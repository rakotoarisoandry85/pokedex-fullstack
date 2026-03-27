import { useState } from "react";
import { getPrimaryColor, TYPE_COLORS } from "../utils/typeColors";

export default function PokemonCard({ pokemon, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const color = getPrimaryColor(pokemon.types);

  return (
    <div
      className="pokemon-card"
      style={{ "--card-glow": color.glow, "--card-accent": color.bg }}
      onClick={() => onClick(pokemon)}
    >
      <div className="card-id">#{String(pokemon.id).padStart(3, "0")}</div>

      <div className="card-img-wrap">
        {!loaded && <div className="img-skeleton" />}
        <img
          src={imgError ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` : pokemon.sprite_url}
          alt={pokemon.name}
          onLoad={() => setLoaded(true)}
          onError={() => setImgError(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>

      <h3 className="card-name">{pokemon.name}</h3>

      <div className="card-types">
        {pokemon.types.map((t) => (
          <span
            key={t}
            className="type-badge"
            style={{
              background: TYPE_COLORS[t]?.bg || "#555",
              color: TYPE_COLORS[t]?.text || "#fff",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="card-total">
        <span>Total</span>
        <strong>{pokemon.total}</strong>
      </div>
    </div>
  );
}
