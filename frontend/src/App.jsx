import { useState, useEffect, useCallback } from "react";
import { getPokemons, getTypes, searchPokemons } from "./api/pokemon";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import "./App.css";

export default function App() {
  const [pokemons, setPokemons]         = useState([]);
  const [types, setTypes]               = useState([]);
  const [selected, setSelected]         = useState(null);
  const [page, setPage]                 = useState(1);
  const [maxPage, setMaxPage]           = useState(1);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const ITEMS = 20;

  const loadPage = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPokemons(p, ITEMS);
      setPokemons(data.data);
      setMaxPage(data.max_page);
      setTotal(data.total);
      setPage(p);
    } catch {
      setError("Impossible de contacter l'API. Vérifiez que le backend tourne sur le port 8000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
    getTypes().then(setTypes).catch(() => {});
  }, [loadPage]);

  const handleSearch = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchPokemons(params);
      setSearchResults(results);
      setIsSearchMode(true);
    } catch (e) {
      if (e.response?.status === 404) {
        setSearchResults([]);
        setIsSearchMode(true);
      } else {
        setError("Erreur lors de la recherche.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSearchMode(false);
    setSearchResults([]);
    loadPage(1);
  };

  const displayList = isSearchMode ? searchResults : pokemons;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-ball">⬤</span>
            <span className="logo-text">Pokédex</span>
            <span className="logo-gen">Gen I</span>
          </div>
          <p className="header-sub">{total} Pokémons • Génération Kanto</p>
        </div>
        <div className="header-scanlines" />
      </header>

      <main className="app-main">
        <SearchBar types={types} onSearch={handleSearch} onReset={handleReset} />

        {isSearchMode && (
          <div className="search-status">
            {searchResults.length > 0
              ? `${searchResults.length} résultat${searchResults.length > 1 ? "s" : ""} trouvé${searchResults.length > 1 ? "s" : ""}`
              : "Aucun Pokémon ne correspond aux critères."}
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: ITEMS }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : (
          <div className="pokemon-grid">
            {displayList.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onClick={setSelected} />
            ))}
          </div>
        )}

        {!isSearchMode && !loading && (
          <Pagination page={page} maxPage={maxPage} onPageChange={loadPage} />
        )}
      </main>

      {selected && (
        <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
