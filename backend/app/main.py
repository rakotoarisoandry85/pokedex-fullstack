from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.pokemon_router import router

app = FastAPI(
    title="Pokédex API",
    description="API RESTful pour consulter et gérer les Pokémons de la 1ère génération.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["root"])
def root():
    return {"message": "Pokédex API v1 — voir /docs pour la documentation."}
