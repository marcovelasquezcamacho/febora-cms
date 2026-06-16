from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Jugador, JugadorLogro

router = APIRouter()


class LogroIn(BaseModel):
    titulo: str
    anio: Optional[str] = None
    descripcion: Optional[str] = None
    orden: Optional[int] = 0


class JugadorIn(BaseModel):
    nombre: str
    apellido: str
    iniciales: Optional[str] = None
    ranking_etiqueta: Optional[str] = None
    ranking_color: Optional[str] = "#F2A900"
    tag_texto: Optional[str] = None
    tag_color: Optional[str] = "red"
    descripcion_corta: Optional[str] = None
    biografia: Optional[str] = None
    foto_url: Optional[str] = None
    nacionalidad: Optional[str] = "Bolivia"
    orden: Optional[int] = 0
    activo: Optional[bool] = True
    logros: Optional[List[LogroIn]] = Field(default_factory=list)


@router.get("/", summary="Listar jugadores activos (publico)")
def list_jugadores(db: Session = Depends(get_db)):
    return db.query(Jugador).filter(Jugador.activo.is_(True)).order_by(Jugador.orden).all()


@router.get("/admin", summary="Listar todos (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Jugador).order_by(Jugador.orden).all()


@router.get("/{id}", summary="Detalle de jugador (publico)")
def get_jugador(id: str, db: Session = Depends(get_db)):
    j = db.query(Jugador).filter(Jugador.id == id, Jugador.activo.is_(True)).first()
    if not j:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return j


@router.post("/", status_code=201, summary="Crear jugador")
def create(data: JugadorIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    logros_data = data.logros or []
    jugador_data = data.dict(exclude={"logros"})
    try:
        user_id = UUID(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    j = Jugador(**jugador_data, created_by=user_id)
    db.add(j)
    db.flush()
    for l in logros_data:
        db.add(JugadorLogro(jugador_id=j.id, **l.dict()))
    db.commit()
    db.refresh(j)
    return j


@router.put("/{id}", summary="Actualizar jugador")
def update(id: str, data: JugadorIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    j = db.query(Jugador).filter(Jugador.id == id).first()
    if not j:
        raise HTTPException(status_code=404, detail="No encontrado")
    for f, v in data.dict(exclude={"logros"}, exclude_none=True).items():
        setattr(j, f, v)
    db.commit()
    db.refresh(j)
    return j


@router.delete("/{id}", status_code=204, summary="Eliminar jugador")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    j = db.query(Jugador).filter(Jugador.id == id).first()
    if not j:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(j)
    db.commit()
