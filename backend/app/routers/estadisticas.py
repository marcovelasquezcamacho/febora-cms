from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Estadistica

router = APIRouter()


class EstadisticaIn(BaseModel):
    valor: str
    etiqueta: str
    icono: Optional[str] = None
    orden: Optional[int] = 0
    visible: Optional[bool] = True


@router.get("/", summary="Listar estadisticas visibles (publico)")
def list_estadisticas(db: Session = Depends(get_db)):
    return (
        db.query(Estadistica)
        .filter(Estadistica.visible.is_(True))
        .order_by(Estadistica.orden)
        .all()
    )


@router.get("/admin", summary="Listar todas (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Estadistica).order_by(Estadistica.orden).all()


@router.post("/", status_code=201, summary="Crear estadistica")
def create(data: EstadisticaIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    try:
        user_id = UUID(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    est = Estadistica(**data.dict(), updated_by=user_id)
    db.add(est)
    db.commit()
    db.refresh(est)
    return est


@router.put("/{id}", summary="Actualizar estadistica")
def update(id: str, data: EstadisticaIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    est = db.query(Estadistica).filter(Estadistica.id == id).first()
    if not est:
        raise HTTPException(status_code=404, detail="No encontrado")

    for f, v in data.dict(exclude_none=True).items():
        setattr(est, f, v)

    try:
        est.updated_by = UUID(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")
    db.commit()
    db.refresh(est)
    return est


@router.delete("/{id}", status_code=204, summary="Eliminar estadistica")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    est = db.query(Estadistica).filter(Estadistica.id == id).first()
    if not est:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(est)
    db.commit()
