import base64
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session
from database import Base, get_db

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

@usersRouter.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
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