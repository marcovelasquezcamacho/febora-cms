from datetime import datetime
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import HeroSection

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


@router.get("/", summary="Obtener hero (publico)")
def get_hero(db: Session = Depends(get_db)):
    hero = db.query(HeroSection).filter(HeroSection.activo.is_(True)).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero no configurado")
    return hero


@router.put("/", summary="Actualizar hero (requiere auth)")
def update_hero(
    data: HeroIn,
    payload: dict = Depends(decode_token),
    db: Session = Depends(get_db),
):
    hero = db.query(HeroSection).first()
    if not hero:
        hero = HeroSection()
        db.add(hero)

    for field, value in data.dict(exclude_none=True).items():
        setattr(hero, field, value)

    try:
        hero.updated_by = UUID(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")
    hero.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(hero)
    return hero
