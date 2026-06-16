import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Noticia

router = APIRouter()

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[áàä]','a', re.sub(r'[éèë]','e', re.sub(r'[íìï]','i',
           re.sub(r'[óòö]','o', re.sub(r'[úùü]','u', text)))))
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

class NoticiaIn(BaseModel):
    titulo: str
    categoria: Optional[str] = None
    categoria_color: Optional[str] = "red"
    resumen: Optional[str] = None
    contenido: Optional[str] = None
    imagen_url: Optional[str] = None
    destacada: Optional[bool] = False
    publicada: Optional[bool] = False

@router.get("/", summary="Listar noticias publicadas (publico)")
def list_noticias(
    destacada: Optional[bool] = None,
    limite: int = Query(10, le=50),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    q = db.query(Noticia).filter(Noticia.publicada == True)
    if destacada is not None:
        q = q.filter(Noticia.destacada == destacada)
    return q.order_by(Noticia.fecha_publicacion.desc()).offset(offset).limit(limite).all()

@router.get("/admin", summary="Listar todas (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Noticia).order_by(Noticia.created_at.desc()).all()

@router.get("/{slug}", summary="Detalle por slug (publico)")
def get_by_slug(slug: str, db: Session = Depends(get_db)):
    n = db.query(Noticia).filter(Noticia.slug == slug, Noticia.publicada == True).first()
    if not n:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return n

@router.post("/", status_code=201, summary="Crear noticia")
def create(data: NoticiaIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    slug = slugify(data.titulo)
    if db.query(Noticia).filter(Noticia.slug == slug).first():
        slug = slug + "-" + str(int(datetime.utcnow().timestamp()))
    n = Noticia(**data.dict(), slug=slug, autor_id=payload["sub"])
    if data.publicada:
        n.fecha_publicacion = datetime.utcnow()
    db.add(n)
    db.commit()
    db.refresh(n)
    return n

@router.put("/{id}", summary="Actualizar noticia")
def update(id: str, data: NoticiaIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    n = db.query(Noticia).filter(Noticia.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail="No encontrada")
    was_draft = not n.publicada
    for f, v in data.dict(exclude_none=True).items():
        setattr(n, f, v)
    if was_draft and data.publicada:
        n.fecha_publicacion = datetime.utcnow()
    db.commit()
    db.refresh(n)
    return n

@router.delete("/{id}", status_code=204, summary="Eliminar noticia")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    n = db.query(Noticia).filter(Noticia.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail="No encontrada")
    db.delete(n)
    db.commit()
