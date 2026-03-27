from typing import Optional

from fastapi import APIRouter, Path, Query

from app.schemas.pokemon import PokemonCreate, PokemonResponse, PokemonUpdate
from app.services.pokemon_service import pokemon_service

router = APIRouter(prefix="/api/v1", tags=["pokémons"])


# ── Meta ──────────────────────────────────────────────────────────────────────

@router.get("/total", summary="Nombre total de Pokémons")
def total() -> dict:
    return {"total": pokemon_service.get_total()}


@router.get("/types", summary="Liste des types disponibles")
def types() -> list[str]:
    return pokemon_service.get_types()


# ── Collections ───────────────────────────────────────────────────────────────

@router.get("/pokemons", summary="Tous les Pokémons (sans pagination)")
def all_pokemons() -> list[PokemonResponse]:
    return pokemon_service.get_all()


@router.get("/pokemons/paginated", summary="Pokémons avec pagination")
def paginated(
    page: int = Query(1, ge=1, description="Numéro de page"),
    items: int = Query(20, ge=1, le=50, description="Éléments par page"),
):
    return pokemon_service.get_paginated(page, items)


@router.get("/pokemons/search", summary="Recherche avancée avec filtres")
def search(
    types: Optional[str] = Query(None, description="Filtrer par type(s), ex: Fire,Flying"),
    evo: Optional[str] = Query(None, description="true = avec évolution, false = sans"),
    totalgt: Optional[int] = Query(None, description="Total > valeur"),
    totallt: Optional[int] = Query(None, description="Total < valeur"),
    sortby: Optional[str] = Query(None, description="Trier par: id, name, total"),
    order: Optional[str] = Query(None, description="asc ou desc"),
) -> list[PokemonResponse]:
    return pokemon_service.search(
        types=types, evo=evo, totalgt=totalgt, totallt=totallt,
        sortby=sortby, order=order,
    )


# ── Single resource ───────────────────────────────────────────────────────────

@router.get("/pokemon/{pokemon_id}", summary="Pokémon par ID")
def get_one(pokemon_id: int = Path(ge=1)) -> PokemonResponse:
    return pokemon_service.get_by_id(pokemon_id)


@router.post("/pokemon", status_code=201, summary="Créer un Pokémon")
def create(payload: PokemonCreate) -> PokemonResponse:
    return pokemon_service.create(payload)


@router.put("/pokemon/{pokemon_id}", summary="Mettre à jour un Pokémon")
def update(payload: PokemonUpdate, pokemon_id: int = Path(ge=1)) -> PokemonResponse:
    return pokemon_service.update(pokemon_id, payload)


@router.delete("/pokemon/{pokemon_id}", summary="Supprimer un Pokémon")
def delete(pokemon_id: int = Path(ge=1)) -> PokemonResponse:
    return pokemon_service.delete(pokemon_id)
