import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from app.core.security import decode_token

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_SIZE_MB = 5

@router.post("/upload", summary="Subir imagen")
async def upload_image(
    file: UploadFile = File(...),
    payload: dict = Depends(decode_token)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Solo se permiten imágenes JPG, PNG o WebP")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"El archivo no puede superar {MAX_SIZE_MB}MB")

    ext = file.filename.split(".")[-1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    return {
        "url": f"/uploads/{filename}",
        "filename": filename,
        "size_kb": len(contents) // 1024
    }

@router.delete("/upload/{filename}", summary="Eliminar imagen")
async def delete_image(filename: str, payload: dict = Depends(decode_token)):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(404, "Archivo no encontrado")
    os.remove(filepath)
    return {"mensaje": "Archivo eliminado"}
