from pydantic import BaseModel, Field, field_validator
from typing import Optional


class PokemonBase(BaseModel):
    name: str
    types: list[str]
    total: int
    hp: int
    attack: int
    defense: int
    attack_special: int
    defense_special: int
    speed: int
    evolution_id: Optional[int] = None


class PokemonCreate(PokemonBase):
    id: int = Field(ge=1)


class PokemonUpdate(PokemonBase):
    pass


class PokemonResponse(PokemonBase):
    id: int
    image_url: str
    sprite_url: str

    model_config = {"from_attributes": True}


class PokemonListResponse(BaseModel):
    total: int
    page: int
    items: int
    max_page: int
    data: list[PokemonResponse]


class SearchParams(BaseModel):
    types: Optional[str] = None
    evo: Optional[str] = None
    totalgt: Optional[int] = None
    totallt: Optional[int] = None
    sortby: Optional[str] = None
    order: Optional[str] = None
