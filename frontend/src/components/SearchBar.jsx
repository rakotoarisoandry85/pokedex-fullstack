import { useState } from "react";
import { TYPE_COLORS } from "../utils/typeColors";

export default function SearchBar({ types, onSearch, onReset }) {
  const [name, setName]       = useState("");
  const [selType, setSelType] = useState("");
  const [evo, setEvo]         = useState("");
  const [totalgt, setTotalgt] = useState("");
  const [totallt, setTotallt] = useState("");
  const [sortby, setSortby]   = useState("");
  const [order, setOrder]     = useState("asc");

  const handleSearch = () => {
    onSearch({
      types: selType || undefined,
      evo: evo || undefined,
      totalgt: totalgt ? Number(totalgt) : undefined,
      totallt: totallt ? Number(totallt) : undefined,
      sortby: sortby || undefined,
      order: sortby ? order : undefined,
    });
  };

  const handleReset = () => {
    setName(""); setSelType(""); setEvo("");
    setTotalgt(""); setTotallt(""); setSortby(""); setOrder("asc");
    onReset();
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        <div className="search-group">
          <label>Type</label>
          <select value={selType} onChange={(e) => setSelType(e.target.value)}>
            <option value="">Tous</option>
            {types.map((t) => (
              <option key={t} value={t} style={{ background: TYPE_COLORS[t]?.bg }}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <label>Évolution</label>
          <select value={evo} onChange={(e) => setEvo(e.target.value)}>
            <option value="">Tous</option>
            <option value="true">Avec évolution</option>
            <option value="false">Sans évolution</option>
          </select>
        </div>

        <div className="search-group">
          <label>Total min</label>
          <input
            type="number" placeholder="ex: 300"
            value={totalgt} onChange={(e) => setTotalgt(e.target.value)}
          />
        </div>

        <div className="search-group">
          <label>Total max</label>
          <input
            type="number" placeholder="ex: 600"
            value={totallt} onChange={(e) => setTotallt(e.target.value)}
          />
        </div>

        <div className="search-group">
          <label>Trier par</label>
          <select value={sortby} onChange={(e) => setSortby(e.target.value)}>
            <option value="">—</option>
            <option value="id">ID</option>
            <option value="name">Nom</option>
            <option value="total">Total</option>
          </select>
        </div>

        {sortby && (
          <div className="search-group">
            <label>Ordre</label>
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="asc">↑ Croissant</option>
              <option value="desc">↓ Décroissant</option>
            </select>
          </div>
        )}
      </div>

      <div className="search-actions">
        <button className="btn-search" onClick={handleSearch}>Rechercher</button>
        <button className="btn-reset" onClick={handleReset}>Réinitialiser</button>
      </div>
    </div>
  );
}
