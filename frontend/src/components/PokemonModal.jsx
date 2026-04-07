import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
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
    { key: "hp",              val: pokemon.hp },
    { key: "attack",          val: pokemon.attack },
    { key: "defense",         val: pokemon.defense },
    { key: "attack_special",  val: pokemon.attack_special },
    { key: "defense_special", val: pokemon.defense_special },
    { key: "speed",           val: pokemon.speed },
  ];

  const radarOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const values = params.data.value;
        return [
          `<strong>${params.name}</strong>`,
          `HP: ${values[0]}`,
          `ATK: ${values[1]}`,
          `DEF: ${values[2]}`,
          `SP.ATK: ${values[3]}`,
          `SP.DEF: ${values[4]}`,
          `SPD: ${values[5]}`,
        ].join("<br/>");
      },
    },
    radar: {
      shape: "polygon",
      indicator: [
        { name: "HP",      max: statMax.hp },
        { name: "ATK",     max: statMax.attack },
        { name: "DEF",     max: statMax.defense },
        { name: "SP.ATK",  max: statMax.attack_special },
        { name: "SP.DEF",  max: statMax.defense_special },
        { name: "SPD",     max: statMax.speed },
      ],
      center: ["50%", "50%"],
      radius: "65%",
      splitNumber: 4,
      axisName: {
        color: "#aaa",
        fontSize: 11,
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
        symbolSize: 5,
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      //tooltip: {value:pokemon.name}
    }],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ "--modal-accent": color.bg, "--modal-glow": color.glow }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* ── Header : image + infos ── */}
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

        {/* ── Corps : radar + barres côte à côte ── */}
        <div className="modal-body">

          {/* Radar ECharts */}
          <div className="modal-radar">
            <ReactECharts
              option={radarOption}
              style={{ width: "100%", height: "220px" }}
              opts={{ renderer: "svg" }}
            />
          </div>

          {/* Barres de stats */}
          <div className="modal-stats">
            <h4>Stats <span className="total-badge">Total {pokemon.total}</span></h4>
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
    </div>
  );
}
