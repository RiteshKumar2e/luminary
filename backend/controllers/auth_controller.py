from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserLogin, UserUpdate, ChangePasswordRequest
from auth.jwt import create_access_token, hash_password, verify_password


async def register_user(payload: UserCreate, db: Session):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")

    user = User(
        email=payload.email,
        username=payload.username,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        industry=payload.industry,
        is_verified=True,  # auto-verify for MVP
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user": user}


async def login_user(payload: UserLogin, db: Session):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user": user}


async def get_profile(user: User):
    return user


async def update_profile(user: User, payload: UserUpdate, db: Session):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


async def change_password(user: User, payload: ChangePasswordRequest, db: Session):
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
