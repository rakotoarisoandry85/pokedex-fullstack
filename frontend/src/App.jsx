import { useState, useEffect, useCallback, useRef } from "react";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getPokemons, getTypes, searchPokemons } from "./api/pokemon";
import PokemonCard   from "./components/PokemonCard";
import PokemonModal  from "./components/PokemonModal";
import SearchBar     from "./components/SearchBar";
import Pagination    from "./components/Pagination";
import "./App.css";

const ITEMS = 20;

// ─── Query keys ───────────────────────────────────────────────────────────────
const keys = {
  paginated:  (page)         => ["pokemons", "page", page],
  infinite:   ()             => ["pokemons", "infinite"],
  types:      ()             => ["types"],
  search:     (params)       => ["pokemons", "search", params],
};

export default function App() {
  const [page,          setPage]          = useState(1);
  const [selected,      setSelected]      = useState(null);
  const [searchParams,  setSearchParams]  = useState(null);   // null = pas de recherche
  const [mode,          setMode]          = useState("pagination"); // "pagination" | "infinite"

  const queryClient  = useQueryClient();
  const sentinelRef  = useRef(null);   // observé par IntersectionObserver

  // ─── Types ──────────────────────────────────────────────────────────────────
  const { data: types = [] } = useQuery({
    queryKey: keys.types(),
    queryFn:  getTypes,
    staleTime: Infinity,
  });

  // ─── Mode PAGINATION ────────────────────────────────────────────────────────
  const paginationQuery = useQuery({
    queryKey: keys.paginated(page),
    queryFn:  () => getPokemons(page, ITEMS),
    enabled:  mode === "pagination" && !searchParams,
    keepPreviousData: true,    // pas de flash blanc lors du changement de page
    staleTime: 60_000,
  });

  // ─── Mode INFINITE SCROLL ───────────────────────────────────────────────────
  const infiniteQuery = useInfiniteQuery({
    queryKey: keys.infinite(),
    queryFn:  ({ pageParam = 1 }) => getPokemons(pageParam, ITEMS),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.max_page ? lastPage.page + 1 : undefined,
    enabled: mode === "infinite" && !searchParams,
    staleTime: 60_000,
  });

  // ─── Mode RECHERCHE ─────────────────────────────────────────────────────────
  const searchQuery = useQuery({
    queryKey: keys.search(searchParams),
    queryFn:  () => searchPokemons(searchParams),
    enabled:  !!searchParams,
    retry:    false,             // 404 ne doit pas retry
    staleTime: 30_000,
  });

  // ─── IntersectionObserver pour le scroll infini ─────────────────────────────
  useEffect(() => {
    if (mode !== "infinite") return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
          infiniteQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, infiniteQuery]);

  // ─── Switch de mode : reset propre ──────────────────────────────────────────
  const handleToggleMode = () => {
    setMode((prev) => {
      const next = prev === "pagination" ? "infinite" : "pagination";
      setSearchParams(null);
      setPage(1);
      // Invalide les queries du mode qu'on quitte pour forcer un refetch frais
      if (next === "infinite") queryClient.removeQueries({ queryKey: ["pokemons", "page"] });
      else                     queryClient.removeQueries({ queryKey: keys.infinite() });
      return next;
    });
  };

  // ─── Handlers recherche ─────────────────────────────────────────────────────
  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams(null);
    setPage(1);
  }, []);

  // ─── Données à afficher ─────────────────────────────────────────────────────
  const isSearch    = !!searchParams;
  const isInfinite  = mode === "infinite" && !isSearch;

  const displayList = (() => {
    if (isSearch)   return searchQuery.data ?? [];
    if (isInfinite) return infiniteQuery.data?.pages.flatMap((p) => p.data) ?? [];
    return paginationQuery.data?.data ?? [];
  })();

  const total   = paginationQuery.data?.total ?? 0;
  const maxPage = paginationQuery.data?.max_page ?? 1;

  const isLoading = isSearch
    ? searchQuery.isLoading
    : isInfinite
    ? (infiniteQuery.isLoading && displayList.length === 0)
    : paginationQuery.isLoading;

  const error = isSearch
    ? (searchQuery.isError && searchQuery.error?.response?.status !== 404
        ? "Erreur lors de la recherche." : null)
    : isInfinite
    ? (infiniteQuery.isError ? "Erreur de chargement." : null)
    : (paginationQuery.isError ? "Impossible de contacter l'API. Vérifiez que le backend tourne sur le port 8000." : null);

  const searchEmpty = isSearch && searchQuery.isError && searchQuery.error?.response?.status === 404;

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-ball">⬤</span>
            <span className="logo-text">Pokédex</span>
            <span className="logo-gen">Gen I I/II/III/IV</span>
          </div>
          <p className="header-sub">{total > 0 ? `${total} Pokémons • Génération Kanto` : "Génération Kanto"}</p>
        </div>
        <div className="header-scanlines" />
      </header>

      <main className="app-main">

        {/* ── Toolbar : SearchBar + toggle ── */}
        <div className="toolbar">
          <SearchBar types={types} onSearch={handleSearch} onReset={handleReset} />

          <button
            className={`mode-toggle ${mode === "infinite" ? "active" : ""}`}
            onClick={handleToggleMode}
            title="Basculer entre pagination et scroll infini"
          >
            <span className="mode-toggle-track">
              <span className="mode-toggle-thumb" />
            </span>
            <span className="mode-toggle-labels">
              <span className={mode === "pagination" ? "mode-label active" : "mode-label"}>Pagination</span>
              <span className={mode === "infinite"   ? "mode-label active" : "mode-label"}>Scroll ∞</span>
            </span>
          </button>
        </div>

        {/* ── Statut recherche ── */}
        {isSearch && !isLoading && (
          <div className="search-status">
            {searchEmpty
              ? "Aucun Pokémon ne correspond aux critères."
              : searchQuery.data
              ? `${searchQuery.data.length} résultat${searchQuery.data.length > 1 ? "s" : ""} trouvé${searchQuery.data.length > 1 ? "s" : ""}`
              : null}
          </div>
        )}

        {/* ── Erreur ── */}
        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        {/* ── Grille ── */}
        {isLoading ? (
          <div className="loading-grid">
            {Array.from({ length: ITEMS }).map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        ) : (
          <div className="pokemon-grid">
            {displayList.map((p) => (
              <PokemonCard key={`${p.id}-${p.name}`} pokemon={p} onClick={setSelected} />
            ))}
          </div>
        )}

        {/* ── Pagination classique ── */}
        {!isSearch && mode === "pagination" && !isLoading && (
          <Pagination page={page} maxPage={maxPage} onPageChange={setPage} />
        )}

        {/* ── Sentinel scroll infini ── */}
        {isInfinite && (
          <div ref={sentinelRef} className="scroll-sentinel">
            {infiniteQuery.isFetchingNextPage && (
              <div className="loading-more">
                <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
              </div>
            )}
            {!infiniteQuery.hasNextPage && displayList.length > 0 && (
              <p className="end-message">— Tous les Pokémons sont chargés —</p>
            )}
          </div>
        )}

      </main>

      {/* ── Modal ── */}
      {selected && (
        <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
