from pydantic import BaseModel


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nombre: str
    rol: str


class MeResponse(BaseModel):
    id: str
    nombre: str
    email: str
    rol: str
