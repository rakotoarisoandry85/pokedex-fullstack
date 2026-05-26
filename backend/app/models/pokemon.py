from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Pokemon:
    id: int
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

    @property
    def image_url(self) -> str:
        padded = str(self.id).zfill(3)
        return f"https://assets.pokemon.com/assets/cms2/img/pokedex/full/{padded}.png"

    @property
    def sprite_url(self) -> str:
        return f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{self.id}.png"
    
