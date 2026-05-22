import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { getPrimaryColor, TYPE_COLORS, statMax, statLabel } from "../utils/typeColors";

export default function PokemonModal({ pokemon, onClose }) {
  const [imgError, setImgError] = useState(false);
  const color = getPrimaryColor(pokemon.types);

  useEffect(() => {
    // Bloque le scroll du body quand le modal est ouvert
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const stats = [
    { key: "hp",              val: pokemon.hp },
    { key: "attack",          val: pokemon.attack },
    { key: "defense",         val: pokemon.defense },
    { key: "attack_special",  val: pokemon.attack_special },
    { key: "defense_special", val: pokemon.defense_special },
    { key: "speed",           val: pokemon.speed },
  ];

  const radarOption = {
    backgroundColor: "transparent",
    radar: {
      shape: "polygon",
      indicator: [
        { name: "HP",     max: statMax.hp },
        { name: "ATK",    max: statMax.attack },
        { name: "DEF",    max: statMax.defense },
        { name: "SP.ATK", max: statMax.attack_special },
        { name: "SP.DEF", max: statMax.defense_special },
        { name: "SPD",    max: statMax.speed },
      ],
      center: ["50%", "50%"],
      radius: "60%",
      splitNumber: 4,
      axisName: {
        color: "#aaa",
        fontSize: 10,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
      },
      splitLine:  { lineStyle: { color: "rgba(255,255,255,0.08)", width: 1 } },
      splitArea:  { areaStyle: { color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"] } },
      axisLine:   { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    series: [{
      type: "radar",
      data: [{
        value: [
          pokemon.hp, pokemon.attack, pokemon.defense,
          pokemon.attack_special, pokemon.defense_special, pokemon.speed,
        ],
        name: pokemon.name,
        areaStyle:  { color: color.bg, opacity: 0.22 },
        lineStyle:  { color: color.bg, width: 2, shadowColor: color.glow, shadowBlur: 12 },
        itemStyle:  { color: color.bg, borderColor: "#fff", borderWidth: 1.5 },
        symbol: "circle",
        symbolSize: 4,
      }],
      animation: true,
      animationDuration: 700,
      animationEasing: "cubicOut",
    }],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ "--modal-accent": color.bg, "--modal-glow": color.glow }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Bande colorée en haut + image flottante ── */}
        <div className="modal-hero" style={{ background: color.bg }}>
          <div className="modal-hero-scanlines" />
          <button className="modal-close" onClick={onClose}>✕</button>
          <img
            className="modal-hero-img"
            src={imgError
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
              : pokemon.sprite_url}
            alt={pokemon.name}
            onError={() => setImgError(true)}
          />
        </div>

        {/* ── Contenu scrollable ── */}
        <div className="modal-scroll">

          {/* Identité */}
          <div className="modal-identity">
            <span className="modal-id">#{String(pokemon.id).padStart(3, "0")}</span>
            <h2 className="modal-name">{pokemon.name}</h2>
            <div className="modal-types">
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

          {/* Radar */}
          <div className="modal-section">
            <h4 className="modal-section-title">
              Radar
              <span className="total-badge">Total {pokemon.total}</span>
            </h4>
            <div className="modal-radar">
              <ReactECharts
                option={radarOption}
                style={{ width: "100%", height: "220px" }}
                opts={{ renderer: "svg" }}
              />
            </div>
          </div>

          {/* Barres de stats */}
          <div className="modal-section">
            <h4 className="modal-section-title">Statistiques</h4>
            <div className="modal-stats-list">
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

        </div>{/* fin modal-scroll */}
      </div>
    </div>
  );
}