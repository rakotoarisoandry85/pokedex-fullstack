import json
import math
from dataclasses import asdict
from pathlib import Path
from typing import Optional

from app.models.pokemon import Pokemon


DATA_PATH = Path(__file__).parent.parent / "pokemons.json"


class PokemonRepository:
    """
    In-memory repository backed by a JSON file.
    Acts as a simple data-access layer; swap with SQLAlchemy for production.
    """

    def __init__(self):
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            raw: list[dict] = json.load(f)
        self._store: dict[int, dict] = {item["id"]: item for item in raw}

    # ── Read ──────────────────────────────────────────────────────────────

    def count(self) -> int:
        return len(self._store)

    def find_all(self) -> list[dict]:
        return list(self._store.values())

    def find_by_id(self, pokemon_id: int) -> Optional[dict]:
        return self._store.get(pokemon_id)

    def find_paginated(self, page: int, items: int) -> tuple[list[dict], int]:
        items = min(items, 50)
        max_page = math.ceil(len(self._store) / items)
        current_page = max(1, min(page, max_page))
        start = (current_page - 1) * items
        keys = list(self._store.keys())[start : start + items]
        return [self._store[k] for k in keys], max_page

    def exists(self, pokemon_id: int) -> bool:
        return pokemon_id in self._store

    def get_all_types(self) -> list[str]:
        types: set[str] = set()
        for p in self._store.values():
            types.update(p.get("types", []))
        return sorted(types)

    # ── Write ─────────────────────────────────────────────────────────────

    def create(self, data: dict) -> dict:
        self._store[data["id"]] = data
        return data

    def update(self, pokemon_id: int, data: dict) -> dict:
        self._store[pokemon_id] = data
        return data

    def delete(self, pokemon_id: int) -> dict:
        return self._store.pop(pokemon_id)

    # ── Search ────────────────────────────────────────────────────────────

    def search(
        self,
        types: Optional[str] = None,
        evo: Optional[str] = None,
        totalgt: Optional[int] = None,
        totallt: Optional[int] = None,
        sortby: Optional[str] = None,
        order: Optional[str] = None,
    ) -> list[dict]:
        result = list(self._store.values())

        if types:
            wanted = set(types.split(","))
            result = [p for p in result if wanted.issubset(p.get("types", []))]

        if evo == "true":
            result = [p for p in result if "evolution_id" in p]
        elif evo == "false":
            result = [p for p in result if "evolution_id" not in p]

        if totalgt is not None:
            result = [p for p in result if p["total"] > totalgt]

        if totallt is not None:
            result = [p for p in result if p["total"] < totallt]

        if sortby in ("id", "name", "total"):
            result = sorted(result, key=lambda d: d[sortby], reverse=(order == "desc"))

        return result


# Singleton — shared across the app lifetime
pokemon_repository = PokemonRepository()
