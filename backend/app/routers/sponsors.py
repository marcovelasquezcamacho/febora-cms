from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Sponsor

router = APIRouter()

class SponsorIn(BaseModel):
    nombre: str
    logo_url: Optional[str] = None
    sitio_web: Optional[str] = None
    categoria: Optional[str] = "general"
    orden: Optional[int] = 0
    visible: Optional[bool] = True

@router.get("/", summary="Listar sponsors visibles (publico)")
def list_sponsors(db: Session = Depends(get_db)):
    return db.query(Sponsor).filter(Sponsor.visible == True).order_by(Sponsor.categoria, Sponsor.orden).all()

@router.get("/admin", summary="Listar todos (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Sponsor).order_by(Sponsor.categoria, Sponsor.orden).all()

@router.post("/", status_code=201, summary="Crear sponsor")
def create(data: SponsorIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    s = Sponsor(**data.dict(), updated_by=payload["sub"])
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

@router.put("/{id}", summary="Actualizar sponsor")
def update(id: str, data: SponsorIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    s = db.query(Sponsor).filter(Sponsor.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="No encontrado")
    for field, val in data.dict(exclude_none=True).items():
        setattr(s, field, val)
    s.updated_by = payload["sub"]
    db.commit()
    db.refresh(s)
    return s

@router.delete("/{id}", status_code=204, summary="Eliminar sponsor")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    s = db.query(Sponsor).filter(Sponsor.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(s)
    db.commit()
