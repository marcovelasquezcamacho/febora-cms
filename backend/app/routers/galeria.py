from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import GaleriaFoto

router = APIRouter()

class FotoIn(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: str
    categoria: Optional[str] = "general"
    orden: Optional[int] = 0
    destacada: Optional[bool] = False
    visible: Optional[bool] = True

@router.get("/", summary="Listar fotos visibles (publico)")
def list_fotos(categoria: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(GaleriaFoto).filter(GaleriaFoto.visible == True)
    if categoria and categoria != "todos":
        q = q.filter(GaleriaFoto.categoria == categoria)
    return q.order_by(GaleriaFoto.destacada.desc(), GaleriaFoto.orden).all()

@router.get("/admin", summary="Listar todas (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(GaleriaFoto).order_by(GaleriaFoto.orden).all()

@router.get("/categorias", summary="Listar categorias disponibles")
def list_categorias(db: Session = Depends(get_db)):
    fotos = db.query(GaleriaFoto.categoria).filter(GaleriaFoto.visible == True).distinct().all()
    return [f[0] for f in fotos if f[0]]

@router.post("/", status_code=201, summary="Crear foto")
def create(data: FotoIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    f = GaleriaFoto(**data.dict(), updated_by=payload["sub"])
    db.add(f)
    db.commit()
    db.refresh(f)
    return f

@router.put("/{id}", summary="Actualizar foto")
def update(id: str, data: FotoIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    f = db.query(GaleriaFoto).filter(GaleriaFoto.id == id).first()
    if not f:
        raise HTTPException(status_code=404, detail="No encontrada")
    for field, val in data.dict(exclude_none=True).items():
        setattr(f, field, val)
    f.updated_by = payload["sub"]
    db.commit()
    db.refresh(f)
    return f

@router.delete("/{id}", status_code=204, summary="Eliminar foto")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    f = db.query(GaleriaFoto).filter(GaleriaFoto.id == id).first()
    if not f:
        raise HTTPException(status_code=404, detail="No encontrada")
    db.delete(f)
    db.commit()
