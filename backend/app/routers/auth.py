from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, decode_token, verify_password
from app.models.models import AdminUser
from app.schemas.auth import MeResponse, TokenOut

router = APIRouter()


@router.post("/login", response_model=TokenOut, summary="Iniciar sesión")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = (
        db.query(AdminUser)
        .filter(AdminUser.email == form.username, AdminUser.activo.is_(True))
        .first()
    )
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )

    user.ultimo_acceso = datetime.utcnow()
    db.commit()

    token = create_access_token(
        {
            "sub": str(user.id),
            "nombre": user.nombre,
            "email": user.email,
            "rol": user.rol,
        }
    )
    return TokenOut(
        access_token=token,
        nombre=user.nombre,
        rol=user.rol,
    )


@router.get("/me", response_model=MeResponse, summary="Perfil del usuario autenticado")
def me(payload: dict = Depends(decode_token), db: Session = Depends(get_db)):
    user = (
        db.query(AdminUser)
        .filter(AdminUser.id == payload.get("sub"), AdminUser.activo.is_(True))
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return MeResponse(
        id=str(user.id),
        nombre=user.nombre,
        email=user.email,
        rol=user.rol,
    )
