import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.core.security import decode_token

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
MAX_SIZE_MB = 5

def get_cloudinary():
    cloudinary.config(
        cloud_name=os.getenv("dthg89way"),
        api_key=os.getenv("362831951512922"),
        api_secret=os.getenv("DwGL0nCaBq_dM1qYQRdsn8oCIMk"),
        secure=True
    )
    return cloudinary

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

    cloud = get_cloudinary()

    try:
        result = cloud.uploader.upload(
            contents,
            folder="febora",
            public_id=f"febora_{uuid.uuid4().hex[:8]}",
            overwrite=True,
            resource_type="image",
            transformation=[
                {"quality": "auto", "fetch_format": "auto"}
            ]
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
        cloud = get_cloudinary()
        cloud.uploader.destroy(f"febora/{public_id}")
        return {"mensaje": "Imagen eliminada"}
    except Exception as e:
        raise HTTPException(500, f"Error al eliminar: {str(e)}")
