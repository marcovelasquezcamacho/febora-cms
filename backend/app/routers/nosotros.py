from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import SeccionNosotros, NosotrosPill

router = APIRouter()

class PillIn(BaseModel):
    texto: str
    orden: Optional[int] = 0
    visible: Optional[bool] = True

class NosotrosIn(BaseModel):
    tag_texto: Optional[str] = None
    titulo_linea1: Optional[str] = None
    titulo_linea2: Optional[str] = None
    titulo_linea3: Optional[str] = None
    titulo_color: Optional[str] = None
    parrafo1: Optional[str] = None
    parrafo2: Optional[str] = None
    imagen_escudo_url: Optional[str] = None
    pills: Optional[List[PillIn]] = None

@router.get("/", summary="Obtener seccion nosotros (publico)")
def get_nosotros(db: Session = Depends(get_db)):
    s = db.query(SeccionNosotros).first()
    if not s:
        raise HTTPException(status_code=404, detail="Seccion no configurada")
    return s

@router.put("/", summary="Actualizar seccion nosotros")
def update(data: NosotrosIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    s = db.query(SeccionNosotros).first()
    if not s:
        s = SeccionNosotros()
        db.add(s)
    for f, v in data.dict(exclude={"pills"}, exclude_none=True).items():
        setattr(s, f, v)
    s.updated_by = payload["sub"]
    db.flush()
    if data.pills is not None:
        db.query(NosotrosPill).filter(NosotrosPill.seccion_id == s.id).delete()
        for p in data.pills:
            db.add(NosotrosPill(seccion_id=s.id, **p.dict()))
    db.commit()
    db.refresh(s)
    return s
