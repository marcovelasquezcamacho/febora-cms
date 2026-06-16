from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Logro

router = APIRouter()

class LogroIn(BaseModel):
    icono: Optional[str] = None
    numero: str
    descripcion: Optional[str] = None
    color_acento: Optional[str] = "rojo"
    numero_orden: Optional[int] = 0
    visible: Optional[bool] = True

@router.get("/", summary="Logros visibles (publico)")
def list_logros(db: Session = Depends(get_db)):
    return db.query(Logro).filter(Logro.visible == True).order_by(Logro.numero_orden).all()

@router.get("/admin", summary="Todos los logros (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Logro).order_by(Logro.numero_orden).all()

@router.post("/", status_code=201, summary="Crear logro")
def create(data: LogroIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    l = Logro(**data.dict(), updated_by=payload["sub"])
    db.add(l)
    db.commit()
    db.refresh(l)
    return l

@router.put("/{id}", summary="Actualizar logro")
def update(id: str, data: LogroIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    l = db.query(Logro).filter(Logro.id == id).first()
    if not l:
        raise HTTPException(status_code=404, detail="No encontrado")
    for f, v in data.dict(exclude_none=True).items():
        setattr(l, f, v)
    db.commit()
    db.refresh(l)
    return l

@router.delete("/{id}", status_code=204, summary="Eliminar logro")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    l = db.query(Logro).filter(Logro.id == id).first()
    if not l:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(l)
    db.commit()
