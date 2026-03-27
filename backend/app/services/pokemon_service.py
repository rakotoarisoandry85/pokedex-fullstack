from dataclasses import asdict
from typing import Optional

from fastapi import HTTPException

from app.models.pokemon import Pokemon
from app.repositories.pokemon_repository import pokemon_repository
from app.schemas.pokemon import PokemonCreate, PokemonResponse, PokemonUpdate


def _to_response(raw: dict) -> PokemonResponse:
    pokemon = Pokemon(**raw)
    return PokemonResponse(
        **asdict(pokemon),
        image_url=pokemon.image_url,
        sprite_url=pokemon.sprite_url,
    )


class PokemonService:

    # ── Queries ───────────────────────────────────────────────────────────

    def get_total(self) -> int:
        return pokemon_repository.count()

    def get_all(self) -> list[PokemonResponse]:
        return [_to_response(p) for p in pokemon_repository.find_all()]

    def get_by_id(self, pokemon_id: int) -> PokemonResponse:
        raw = pokemon_repository.find_by_id(pokemon_id)
        if raw is None:
            raise HTTPException(status_code=404, detail=f"Pokémon #{pokemon_id} introuvable.")
        return _to_response(raw)

    def get_paginated(self, page: int, items: int):
        data, max_page = pokemon_repository.find_paginated(page, items)
        return {
            "total": pokemon_repository.count(),
            "page": page,
            "items": items,
            "max_page": max_page,
            "data": [_to_response(p) for p in data],
        }

    def get_types(self) -> list[str]:
        return pokemon_repository.get_all_types()

    def search(self, **kwargs) -> list[PokemonResponse]:
        results = pokemon_repository.search(**kwargs)
        if not results:
            raise HTTPException(status_code=404, detail="Aucun Pokémon ne correspond aux critères.")
        return [_to_response(p) for p in results]

    # ── Commands ──────────────────────────────────────────────────────────

    def create(self, payload: PokemonCreate) -> PokemonResponse:
        if pokemon_repository.exists(payload.id):
            raise HTTPException(status_code=409, detail=f"Le Pokémon #{payload.id} existe déjà.")
        raw = payload.model_dump()
        return _to_response(pokemon_repository.create(raw))

    def update(self, pokemon_id: int, payload: PokemonUpdate) -> PokemonResponse:
        if not pokemon_repository.exists(pokemon_id):
            raise HTTPException(status_code=404, detail=f"Pokémon #{pokemon_id} introuvable.")
        raw = {"id": pokemon_id, **payload.model_dump()}
        return _to_response(pokemon_repository.update(pokemon_id, raw))

    def delete(self, pokemon_id: int) -> PokemonResponse:
        if not pokemon_repository.exists(pokemon_id):
            raise HTTPException(status_code=404, detail=f"Pokémon #{pokemon_id} introuvable.")
        return _to_response(pokemon_repository.delete(pokemon_id))


pokemon_service = PokemonService()
