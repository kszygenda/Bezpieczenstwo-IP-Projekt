import base64
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session
from database import Base, get_db
from databaseModels.userPermission import UserPermissionModel

usersRouter = APIRouter(
    prefix="/users",
    tags=["users"]
)

class UserModel(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    password = Column(String, index=True)

class UserCreate(BaseModel):
    name: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    password: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


JWT_SECRET = os.getenv("JWT_SECRET", "bwip-demo-jwt-secret")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60
security = HTTPBearer(auto_error=False)


def create_access_token(payload: dict, expires_delta: timedelta | None = None):
    expires = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode = {**payload, "exp": expires}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Missing JWT token")

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid JWT token") from exc

    subject = payload.get("sub")
    if subject is None:
        raise HTTPException(status_code=401, detail="Invalid JWT payload")

    user = db.query(UserModel).filter(UserModel.id == int(subject)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@usersRouter.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.name == user.name).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
        
    db_user = UserModel(name=user.name, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@usersRouter.get("/usernameConstraint")
def check_username_constraint(name: str, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.name == name).first()
    return {"available": existing_user is None}

@usersRouter.post("/login")
def login(user_data: UserCreate, response: Response, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(
        UserModel.name == user_data.name,
        UserModel.password == user_data.password
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    reversed_name = user.name[::-1]
    hex_encoded = reversed_name.encode("utf-8").hex()
    base64_encoded = base64.b64encode(hex_encoded.encode("utf-8")).decode("utf-8")

    response.set_cookie(key="auth_token", value=base64_encoded)
    return {"message": "Login successful"}


@usersRouter.post("/token", response_model=TokenResponse)
def create_jwt_token(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(
        UserModel.name == user_data.name,
        UserModel.password == user_data.password,
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "name": user.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": JWT_EXPIRE_MINUTES * 60,
    }


@usersRouter.get("/sensitive-standard/{user_id}")
def read_sensitive_user_standard(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    permissions = db.query(UserPermissionModel).filter(UserPermissionModel.user_id == user_id).all()
    return {
        "id": user.id,
        "name": user.name,
        "password": user.password,
        "permissions": [
            {
                "id": permission.id,
                "permission": permission.permission,
            }
            for permission in permissions
        ],
        "mode": "standard-no-jwt",
    }


@usersRouter.get("/sensitive-jwt")
def read_sensitive_user_jwt(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    permissions = db.query(UserPermissionModel).filter(UserPermissionModel.user_id == current_user.id).all()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "password": current_user.password,
        "permissions": [
            {
                "id": permission.id,
                "permission": permission.permission,
            }
            for permission in permissions
        ],
        "mode": "jwt-protected",
    }


@usersRouter.get("/sensitive-jwt/{user_id}")
def read_sensitive_user_jwt_by_id(
    user_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: token does not match requested user")

    permissions = db.query(UserPermissionModel).filter(UserPermissionModel.user_id == current_user.id).all()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "password": current_user.password,
        "permissions": [
            {
                "id": permission.id,
                "permission": permission.permission,
            }
            for permission in permissions
        ],
        "mode": "jwt-protected",
    }


@usersRouter.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user