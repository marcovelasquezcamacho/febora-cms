import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.database import Base, engine
from app.models import models
from app.routers import auth, hero, estadisticas, jugadores, noticias, logros, nosotros, cta, footer, media, popups, galeria, sponsors, usuarios, contacto, videos

Base.metadata.create_all(bind=engine)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="FEBORA CMS API",
    description="API de administracion de la landing page de FEBORA",
    version="1.0.0",
)

origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router,         prefix="/api/auth",         tags=["Auth"])
app.include_router(hero.router,         prefix="/api/hero",         tags=["Hero"])
app.include_router(estadisticas.router, prefix="/api/estadisticas", tags=["Estadisticas"])
app.include_router(jugadores.router,    prefix="/api/jugadores",    tags=["Jugadores"])
app.include_router(noticias.router,     prefix="/api/noticias",     tags=["Noticias"])
app.include_router(logros.router,       prefix="/api/logros",       tags=["Logros"])
app.include_router(nosotros.router,     prefix="/api/nosotros",     tags=["Nosotros"])
app.include_router(cta.router,          prefix="/api/cta",          tags=["CTA"])
app.include_router(footer.router,       prefix="/api/footer",       tags=["Footer"])
app.include_router(media.router,        prefix="/api/media",        tags=["Media"])
app.include_router(popups.router,       prefix="/api/popups",       tags=["Popups"])
app.include_router(galeria.router,      prefix="/api/galeria",      tags=["Galeria"])
app.include_router(sponsors.router,     prefix="/api/sponsors",     tags=["Sponsors"])
app.include_router(usuarios.router,     prefix="/api/usuarios",     tags=["Usuarios"])
app.include_router(contacto.router,     prefix="/api/contacto",     tags=["Contacto"])
app.include_router(videos.router,       prefix="/api/videos",       tags=["Videos"])

@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "proyecto": "FEBORA CMS API", "version": "1.0.0"}
