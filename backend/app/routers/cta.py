from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import CtaSection

router = APIRouter()

class CtaIn(BaseModel):
    titulo_linea1: Optional[str] = None
    titulo_linea2: Optional[str] = None
    subtitulo: Optional[str] = None
    btn_primario_label: Optional[str] = None
    btn_primario_url: Optional[str] = None
    btn_secundario_label: Optional[str] = None
    btn_secundario_url: Optional[str] = None
    activo: Optional[bool] = None

@router.get("/", summary="Obtener CTA (publico)")
def get_cta(db: Session = Depends(get_db)):
    c = db.query(CtaSection).filter(CtaSection.activo == True).first()
    if not c:
        raise HTTPException(status_code=404, detail="CTA no configurado")
    return c

@router.put("/", summary="Actualizar CTA")
def update(data: CtaIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    c = db.query(CtaSection).first()
    if not c:
        c = CtaSection()
        db.add(c)
    for f, v in data.dict(exclude_none=True).items():
        setattr(c, f, v)
    c.updated_by = payload["sub"]
    db.commit()
    db.refresh(c)
    return c
