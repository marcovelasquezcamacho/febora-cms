from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import FooterConfig, FooterLink

router = APIRouter()

class LinkIn(BaseModel):
    etiqueta: str
    url: str
    orden: Optional[int] = 0
    visible: Optional[bool] = True

class FooterIn(BaseModel):
    texto_copyright: Optional[str] = None
    logo_texto: Optional[str] = None
    links: Optional[List[LinkIn]] = None

@router.get("/", summary="Obtener footer (publico)")
def get_footer(db: Session = Depends(get_db)):
    f = db.query(FooterConfig).first()
    if not f:
        raise HTTPException(status_code=404, detail="Footer no configurado")
    return f

@router.put("/", summary="Actualizar footer")
def update(data: FooterIn, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    f = db.query(FooterConfig).first()
    if not f:
        f = FooterConfig()
        db.add(f)
    for field, val in data.dict(exclude={"links"}, exclude_none=True).items():
        setattr(f, field, val)
    f.updated_by = payload["sub"]
    db.flush()
    if data.links is not None:
        db.query(FooterLink).filter(FooterLink.footer_id == f.id).delete()
        for l in data.links:
            db.add(FooterLink(footer_id=f.id, **l.dict()))
    db.commit()
    db.refresh(f)
    return f
