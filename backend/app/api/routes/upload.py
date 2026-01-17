from fastapi import APIRouter, UploadFile, File, HTTPException
from ...services.s3_service import upload_file_to_s3
import uuid

router = APIRouter()


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image to S3"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_types)}"
        )

    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    # Upload to S3
    try:
        file_url = await upload_file_to_s3(file, unique_filename)
        return {
            "url": file_url,
            "filename": unique_filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
