import { useState, useEffect } from "react";
import { getPrimaryColor, TYPE_COLORS, statMax, statLabel } from "../utils/typeColors";

export default function PokemonModal({ pokemon, onClose }) {
  const [imgError, setImgError] = useState(false);
  const color = getPrimaryColor(pokemon.types);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const stats = [
    { key: "hp", val: pokemon.hp },
    { key: "attack", val: pokemon.attack },
    { key: "defense", val: pokemon.defense },
    { key: "attack_special", val: pokemon.attack_special },
    { key: "defense_special", val: pokemon.defense_special },
    { key: "speed", val: pokemon.speed },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ "--modal-accent": color.bg, "--modal-glow": color.glow }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="modal-img-wrap">
            <div className="modal-img-bg" style={{ background: color.bg }} />
            <img
              src={imgError
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                : pokemon.sprite_url}
              alt={pokemon.name}
              onError={() => setImgError(true)}
            />
          </div>

          <div className="modal-info">
            <p className="modal-id">#{String(pokemon.id).padStart(3, "0")}</p>
            <h2 className="modal-name">{pokemon.name}</h2>
            <div className="card-types">
              {pokemon.types.map((t) => (
                <span
                  key={t}
                  className="type-badge"
                  style={{ background: TYPE_COLORS[t]?.bg, color: TYPE_COLORS[t]?.text }}
                >
                  {t}
                </span>
              ))}
            </div>
            {pokemon.evolution_id && (
              <p className="modal-evo">
                🔁 Évolue vers <strong>#{String(pokemon.evolution_id).padStart(3, "0")}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="modal-stats">
          <h4>Statistiques <span className="total-badge">Total {pokemon.total}</span></h4>
          {stats.map(({ key, val }) => (
            <div className="stat-row" key={key}>
              <span className="stat-label">{statLabel[key]}</span>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${Math.min(100, (val / statMax[key]) * 100)}%`,
                    background: color.bg,
                    boxShadow: `0 0 8px ${color.glow}`,
                  }}
                />
              </div>
              <span className="stat-val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
