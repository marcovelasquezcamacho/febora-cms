from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import MensajeContacto

router = APIRouter()

class ContactoIn(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = None
    asunto: Optional[str] = None
    mensaje: str

@router.post("/", status_code=201, summary="Enviar mensaje de contacto (publico)")
def enviar_mensaje(data: ContactoIn, db: Session = Depends(get_db)):
    msg = MensajeContacto(**data.dict())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"mensaje": "Mensaje enviado correctamente", "id": str(msg.id)}

@router.get("/", summary="Listar mensajes (requiere auth)")
def list_mensajes(
    leido: Optional[bool] = None,
    payload: dict = Depends(decode_token),
    db: Session = Depends(get_db)
):
    q = db.query(MensajeContacto)
    if leido is not None:
        q = q.filter(MensajeContacto.leido == leido)
    return q.order_by(MensajeContacto.created_at.desc()).all()

@router.put("/{id}/leido", summary="Marcar como leido")
def marcar_leido(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    msg = db.query(MensajeContacto).filter(MensajeContacto.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    msg.leido = True
    db.commit()
    return {"mensaje": "Marcado como leido"}

@router.delete("/{id}", status_code=204, summary="Eliminar mensaje")
def delete_mensaje(id: str, payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    msg = db.query(MensajeContacto).filter(MensajeContacto.id == id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    db.delete(msg)
    db.commit()
