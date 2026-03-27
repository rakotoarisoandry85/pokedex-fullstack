# 🎮 Pokédex — Full-Stack App

Application full-stack de consultation des Pokémons Génération I.

---

## 🏗️ Architecture

```
pokedex/
├── backend/
│   ├── app/
│   │   ├── main.py                  ← Entrypoint FastAPI + CORS
│   │   ├── routers/
│   │   │   └── pokemon_router.py    ← Couche HTTP (routes)
│   │   ├── services/
│   │   │   └── pokemon_service.py   ← Logique métier
│   │   ├── repositories/
│   │   │   └── pokemon_repository.py ← Accès données (in-memory JSON)
│   │   ├── models/
│   │   │   └── pokemon.py           ← Dataclass + image_url calculée
│   │   ├── schemas/
│   │   │   └── pokemon.py           ← Schémas Pydantic v2 (validation I/O)
│   │   └── pokemons.json
│   └── requirements.txt
│
└── frontend-app/
    ├── src/
    │   ├── api/pokemon.js           ← Client Axios
    │   ├── components/
    │   │   ├── PokemonCard.jsx
    │   │   ├── PokemonModal.jsx     ← Détail + stats animées
    │   │   ├── SearchBar.jsx        ← Filtres avancés
    │   │   └── Pagination.jsx
    │   ├── utils/typeColors.js      ← Mapping type → couleur
    │   ├── App.jsx
    │   └── App.css                  ← Design system complet
    └── package.json
```

---

## 🚀 Démarrage

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API disponible sur : http://localhost:8000  
Documentation interactive : http://localhost:8000/docs

### Frontend

```bash
cd frontend-app
npm install
npm run dev
```

App disponible sur : http://localhost:5173

---

## 🔌 Endpoints API

| Méthode | Route                    | Description                     |
|---------|--------------------------|----------------------------------|
| GET     | `/api/v1/total`          | Nombre total de Pokémons         |
| GET     | `/api/v1/types`          | Liste des types                  |
| GET     | `/api/v1/pokemons`       | Tous les Pokémons                |
| GET     | `/api/v1/pokemons/paginated` | Avec pagination (`page`, `items`) |
| GET     | `/api/v1/pokemons/search`   | Filtres avancés                 |
| GET     | `/api/v1/pokemon/{id}`   | Un Pokémon par ID               |
| POST    | `/api/v1/pokemon`        | Créer un Pokémon                |
| PUT     | `/api/v1/pokemon/{id}`   | Mettre à jour                   |
| DELETE  | `/api/v1/pokemon/{id}`   | Supprimer                       |

### Paramètres de recherche

```
GET /api/v1/pokemons/search?types=Fire,Flying&evo=false&totalgt=500&sortby=total&order=desc
```

| Param    | Description                          |
|----------|--------------------------------------|
| `types`  | Types séparés par virgule            |
| `evo`    | `true` / `false`                     |
| `totalgt`| Total strictement supérieur à        |
| `totallt`| Total strictement inférieur à        |
| `sortby` | `id`, `name`, ou `total`             |
| `order`  | `asc` ou `desc`                      |

---

## 🎨 Features Frontend

- **Images** depuis PokeAPI (official artwork HD)
- **Recherche & filtres** : type, évolution, total min/max, tri
- **Pagination** 20 Pokémons/page
- **Modal détail** avec barres de stats animées
- **Design rétro-futuriste** sombre (Press Start 2P + Nunito)
- **Skeleton loading** pendant le chargement
- **Responsive** mobile/desktop

---

## 🔧 Évolution suggérée

Pour une version production, remplacer le `PokemonRepository` in-memory par :

```python
# SQLAlchemy + PostgreSQL
from sqlalchemy.orm import Session

class PokemonRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def find_by_id(self, pokemon_id: int):
        return self.db.query(PokemonModel).filter_by(id=pokemon_id).first()
```

Seule la couche repository change — services et routers restent intacts.
