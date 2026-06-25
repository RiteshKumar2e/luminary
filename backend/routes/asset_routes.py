from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Form
from sqlalchemy.orm import Session
from typing import Optional
from database.session import get_db
from controllers.asset_controller import (
    upload_asset,
    list_assets,
    get_asset,
    delete_asset,
    create_text_asset,
)
from auth.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/assets", tags=["Asset Library"])


@router.get("/")
async def list_user_assets(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=24, ge=1, le=100),
    category: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await list_assets(current_user, db, skip, limit, category)


@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    name: Optional[str] = Form(default=None),
    category: Optional[str] = Form(default=None),
    description: Optional[str] = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await upload_asset(file, name, category, description, current_user, db)


@router.post("/text")
async def create_text(
    name: str = Form(...),
    content: str = Form(...),
    category: Optional[str] = Form(default="copy"),
    description: Optional[str] = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await create_text_asset(name, content, category, description, current_user, db)


@router.get("/{asset_id}")
async def get_one(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_asset(asset_id, current_user, db)


@router.delete("/{asset_id}")
async def delete(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await delete_asset(asset_id, current_user, db)
