from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, UserUpdate, ChangePasswordRequest
from controllers.auth_controller import (
    register_user,
    login_user,
    get_profile,
    update_profile,
    change_password,
)
from auth.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: Session = Depends(get_db)):
    return await register_user(payload, db)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: Session = Depends(get_db)):
    return await login_user(payload, db)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await update_profile(current_user, payload, db)


@router.put("/me/password")
async def change_pwd(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await change_password(current_user, payload, db)
