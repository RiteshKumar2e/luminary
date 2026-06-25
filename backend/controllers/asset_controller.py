from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
import aiofiles
from models.user import User
from models.asset import Asset
from config.settings import settings

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf", "text/plain", "application/json",
}


async def upload_asset(
    file: UploadFile,
    name: Optional[str],
    category: Optional[str],
    description: Optional[str],
    user: User,
    db: Session,
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")

    content = await file.read()
    size = len(content)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if size > max_bytes:
        raise HTTPException(status_code=413, detail=f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB}MB")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "file")[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    file_type = "image" if file.content_type.startswith("image/") else "document"
    asset = Asset(
        user_id=user.id,
        name=name or file.filename or filename,
        file_type=file_type,
        file_url=f"/uploads/{filename}",
        category=category or "other",
        description=description,
        file_size=size,
        is_ai_generated=False,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


async def create_text_asset(
    name: str,
    content: str,
    category: Optional[str],
    description: Optional[str],
    user: User,
    db: Session,
):
    asset = Asset(
        user_id=user.id,
        name=name,
        file_type="text",
        content=content,
        category=category or "copy",
        description=description,
        is_ai_generated=True,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


async def list_assets(user: User, db: Session, skip: int, limit: int, category: Optional[str]):
    query = db.query(Asset).filter(Asset.user_id == user.id)
    if category:
        query = query.filter(Asset.category == category)
    total = query.count()
    items = query.order_by(Asset.created_at.desc()).offset(skip).limit(limit).all()
    return {"items": items, "total": total}


async def get_asset(asset_id: str, user: User, db: Session):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.user_id == user.id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


async def delete_asset(asset_id: str, user: User, db: Session):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.user_id == user.id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.file_url:
        filepath = asset.file_url.lstrip("/")
        if os.path.exists(filepath):
            os.remove(filepath)
    db.delete(asset)
    db.commit()
    return {"message": "Asset deleted"}
