import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import Video

router = APIRouter()

def extraer_youtube_id(url: str) -> Optional[str]:
    patterns = [
        r'youtube\.com/watch\?v=([^&]+)',
        r'youtu\.be/([^?]+)',
        r'youtube\.com/embed/([^?]+)',
        r'youtube\.com/shorts/([^?]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def extraer_facebook_id(url: str) -> Optional[str]:
    patterns = [
        r'facebook\.com/watch/?\?v=(\d+)',
        r'facebook\.com/video/(\d+)',
        r'facebook\.com/reel/(\d+)',
        r'fb\.watch/([^/]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

class VideoIn(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    youtube_url: str
    miniatura_url: Optional[str] = None
    plataforma: Optional[str] = "youtube"
    orden: Optional[int] = 0
    visible: Optional[bool] = True

@router.get("/", summary="Listar videos visibles (publico)")
def list_videos(db: Session = Depends(get_db)):
    return db.query(Video).filter(
        Video.visible == True
    ).order_by(Video.orden).all()

@router.get("/admin", summary="Listar todos (requiere auth)")
def list_all(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    return db.query(Video).order_by(Video.orden).all()

@router.post("/", status_code=201, summary="Crear video")
def create(data: VideoIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    plataforma = data.plataforma or "youtube"
    youtube_id = None
    if plataforma == "youtube":
        youtube_id = extraer_youtube_id(data.youtube_url)
        if not youtube_id:
            raise HTTPException(400, "URL de YouTube no válida")
    elif plataforma == "facebook":
        fb_id = extraer_facebook_id(data.youtube_url)
        if fb_id:
            youtube_id = fb_id
    v = Video(
        titulo=data.titulo,
        descripcion=data.descripcion,
        youtube_url=data.youtube_url,
        youtube_id=youtube_id,
        miniatura_url=data.miniatura_url,
        plataforma=plataforma,
        orden=data.orden,
        visible=data.visible,
        updated_by=payload["sub"]
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    return v

@router.put("/{id}", summary="Actualizar video")
def update(id: str, data: VideoIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    v = db.query(Video).filter(Video.id == id).first()
    if not v:
        raise HTTPException(404, "No encontrado")
    plataforma = data.plataforma or "youtube"
    youtube_id = None
    if plataforma == "youtube":
        youtube_id = extraer_youtube_id(data.youtube_url)
    elif plataforma == "facebook":
        youtube_id = extraer_facebook_id(data.youtube_url)
    v.titulo = data.titulo
    v.descripcion = data.descripcion
    v.youtube_url = data.youtube_url
    v.youtube_id = youtube_id
    v.miniatura_url = data.miniatura_url
    v.plataforma = plataforma
    v.orden = data.orden
    v.visible = data.visible
    v.updated_by = payload["sub"]
    db.commit()
    db.refresh(v)
    return v

@router.delete("/{id}", status_code=204, summary="Eliminar video")
def delete(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    v = db.query(Video).filter(Video.id == id).first()
    if not v:
        raise HTTPException(404, "No encontrado")
    db.delete(v)
    db.commit()
