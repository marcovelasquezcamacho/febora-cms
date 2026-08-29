from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import HeroSection, HeroImagen

router = APIRouter()

class HeroIn(BaseModel):
    badge_texto: Optional[str] = None
    badge_color: Optional[str] = None
    titulo_linea1: Optional[str] = None
    titulo_linea2: Optional[str] = None
    titulo_linea3: Optional[str] = None
    color_linea1: Optional[str] = None
    color_linea2: Optional[str] = None
    color_linea3: Optional[str] = None
    subtitulo: Optional[str] = None
    btn_primario_label: Optional[str] = None
    btn_primario_url: Optional[str] = None
    btn_secundario_label: Optional[str] = None
    btn_secundario_url: Optional[str] = None
    imagen_fondo_url: Optional[str] = None
    activo: Optional[bool] = None

class HeroImagenIn(BaseModel):
    imagen_url: str
    orden: Optional[int] = 0
    activo: Optional[bool] = True

@router.get("/", summary="Obtener hero (publico)")
def get_hero(db: Session = Depends(get_db)):
    hero = db.query(HeroSection).filter(HeroSection.activo == True).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero no configurado")
    imagenes = db.query(HeroImagen).filter(
        HeroImagen.activo == True
    ).order_by(HeroImagen.orden).all()
    result = {
        "id": str(hero.id),
        "badge_texto": hero.badge_texto,
        "badge_color": hero.badge_color,
        "titulo_linea1": hero.titulo_linea1,
        "titulo_linea2": hero.titulo_linea2,
        "titulo_linea3": hero.titulo_linea3,
        "color_linea1": hero.color_linea1,
        "color_linea2": hero.color_linea2,
        "color_linea3": hero.color_linea3,
        "subtitulo": hero.subtitulo,
        "btn_primario_label": hero.btn_primario_label,
        "btn_primario_url": hero.btn_primario_url,
        "btn_secundario_label": hero.btn_secundario_label,
        "btn_secundario_url": hero.btn_secundario_url,
        "imagen_fondo_url": hero.imagen_fondo_url,
        "activo": hero.activo,
        "imagenes": [{"id": str(img.id), "imagen_url": img.imagen_url, "orden": img.orden} for img in imagenes]
    }
    return result

@router.put("/", summary="Actualizar hero (requiere auth)")
def update_hero(data: HeroIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    hero = db.query(HeroSection).first()
    if not hero:
        hero = HeroSection()
        db.add(hero)
    for field, value in data.dict(exclude_none=True).items():
        setattr(hero, field, value)
    hero.updated_by = payload["sub"]
    db.commit()
    db.refresh(hero)
    return hero

@router.get("/imagenes", summary="Listar imagenes del hero (admin)")
def list_imagenes(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(HeroImagen).order_by(HeroImagen.orden).all()

@router.post("/imagenes", status_code=201, summary="Agregar imagen al hero")
def add_imagen(data: HeroImagenIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    count = db.query(HeroImagen).filter(HeroImagen.activo == True).count()
    if count >= 5:
        raise HTTPException(status_code=400, detail="Máximo 5 imágenes permitidas")
    img = HeroImagen(**data.dict(), updated_by=payload["sub"])
    db.add(img)
    db.commit()
    db.refresh(img)
    return img

@router.put("/imagenes/{id}", summary="Actualizar imagen del hero")
def update_imagen(id: str, data: HeroImagenIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    img = db.query(HeroImagen).filter(HeroImagen.id == id).first()
    if not img:
        raise HTTPException(status_code=404, detail="No encontrada")
    for f, v in data.dict(exclude_none=True).items():
        setattr(img, f, v)
    db.commit()
    db.refresh(img)
    return img

@router.delete("/imagenes/{id}", status_code=204, summary="Eliminar imagen del hero")
def delete_imagen(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    img = db.query(HeroImagen).filter(HeroImagen.id == id).first()
    if not img:
        raise HTTPException(status_code=404, detail="No encontrada")
    db.delete(img)
    db.commit()
