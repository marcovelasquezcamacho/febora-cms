from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Popup

router = APIRouter()

class PopupIn(BaseModel):
    titulo: str
    contenido: Optional[str] = None
    imagen_url: Optional[str] = None
    btn_label: Optional[str] = None
    btn_url: Optional[str] = None
    tipo: Optional[str] = "info"
    activo: Optional[bool] = True
    mostrar_una_vez: Optional[bool] = False
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None

@router.get("/", summary="Obtener popup activo (publico)")
def get_popup_activo(db: Session = Depends(get_db)):
    ahora = datetime.utcnow()
    popup = db.query(Popup).filter(
        Popup.activo == True,
        (Popup.fecha_inicio == None) | (Popup.fecha_inicio <= ahora),
        (Popup.fecha_fin == None) | (Popup.fecha_fin >= ahora),
    ).order_by(Popup.created_at.desc()).first()
    if not popup:
        raise HTTPException(status_code=404, detail="No hay popup activo")
    return popup

@router.get("/admin", summary="Listar todos los popups (requiere auth)")
def list_popups(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Popup).order_by(Popup.created_at.desc()).all()

@router.post("/", status_code=201, summary="Crear popup")
def create(data: PopupIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    p = Popup(**data.dict(), updated_by=payload["sub"])
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.put("/{id}", summary="Actualizar popup")
def update(id: str, data: PopupIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    p = db.query(Popup).filter(Popup.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="No encontrado")
    for f, v in data.dict(exclude_none=True).items():
        setattr(p, f, v)
    p.updated_by = payload["sub"]
    db.commit()
    db.refresh(p)
    return p

@router.delete("/{id}", status_code=204, summary="Eliminar popup")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    p = db.query(Popup).filter(Popup.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(p)
    db.commit()
