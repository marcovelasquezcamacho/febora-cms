from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token, require_superadmin, hash_password
from app.models.models import AdminUser

router = APIRouter()

class UsuarioOut(BaseModel):
    id: str
    nombre: str
    email: str
    rol: str
    activo: bool

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol: str = "editor"

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None
    password: Optional[str] = None

@router.get("/", summary="Listar usuarios (solo superadmin)")
def list_usuarios(payload: dict = Depends(require_superadmin), db: Session = Depends(get_db)):
    users = db.query(AdminUser).order_by(AdminUser.created_at).all()
    return [{"id": str(u.id), "nombre": u.nombre, "email": u.email, "rol": u.rol, "activo": u.activo} for u in users]

@router.post("/", status_code=201, summary="Crear usuario (solo superadmin)")
def create_usuario(data: UsuarioCreate, payload: dict = Depends(require_superadmin), db: Session = Depends(get_db)):
    if db.query(AdminUser).filter(AdminUser.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email ya registrado")
    if data.rol not in ["superadmin", "editor"]:
        raise HTTPException(status_code=400, detail="Rol invalido")
    user = AdminUser(nombre=data.nombre, email=data.email, password_hash=hash_password(data.password), rol=data.rol)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": str(user.id), "nombre": user.nombre, "email": user.email, "rol": user.rol, "activo": user.activo}

@router.put("/{id}", summary="Actualizar usuario (solo superadmin)")
def update_usuario(id: str, data: UsuarioUpdate, payload: dict = Depends(require_superadmin), db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if str(user.id) == payload["sub"] and data.activo is False:
        raise HTTPException(status_code=400, detail="No puedes desactivar tu propia cuenta")
    if str(user.id) == payload["sub"] and data.rol == "editor":
        raise HTTPException(status_code=400, detail="No puedes quitarte tu propio rol de superadmin")

    if data.nombre is not None:
        user.nombre = data.nombre
    if data.rol is not None:
        if data.rol not in ["superadmin", "editor"]:
            raise HTTPException(status_code=400, detail="Rol invalido")
        user.rol = data.rol
    if data.activo is not None:
        user.activo = data.activo
    if data.password:
        user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)
    return {"id": str(user.id), "nombre": user.nombre, "email": user.email, "rol": user.rol, "activo": user.activo}

@router.delete("/{id}", status_code=204, summary="Eliminar usuario (solo superadmin)")
def delete_usuario(id: str, payload: dict = Depends(require_superadmin), db: Session = Depends(get_db)):
    if id == payload["sub"]:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
    user = db.query(AdminUser).filter(AdminUser.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
