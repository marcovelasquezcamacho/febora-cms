import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.core.security import decode_token

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_SIZE_MB = 5

@router.post("/upload", summary="Subir imagen a Cloudinary")
async def upload_image(
    file: UploadFile = File(...),
    payload: dict = Depends(decode_token)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Solo se permiten imagenes JPG, PNG o WebP")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"El archivo no puede superar {MAX_SIZE_MB}MB")

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if not cloud_name or not api_key or not api_secret:
        raise HTTPException(500, "Variables de Cloudinary no configuradas")

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )

    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="febora",
            public_id=f"febora_{uuid.uuid4().hex[:8]}",
            overwrite=True,
            resource_type="image",
        )
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "filename": result["public_id"],
            "size_kb": result.get("bytes", 0) // 1024
        }
    except Exception as e:
        raise HTTPException(500, f"Error al subir imagen: {str(e)}")

@router.delete("/upload/{public_id}", summary="Eliminar imagen de Cloudinary")
async def delete_image(public_id: str, payload: dict = Depends(decode_token)):
    try:
        cloudinary.uploader.destroy(f"febora/{public_id}")
        return {"mensaje": "Imagen eliminada"}
    except Exception as e:
        raise HTTPException(500, f"Error al eliminar: {str(e)}")
