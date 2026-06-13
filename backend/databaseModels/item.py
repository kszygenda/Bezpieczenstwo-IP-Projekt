from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from database import Base, engine, get_db
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
import os
from databaseModels.user import UserModel

itemsRouter = APIRouter(
    prefix="/items",
    tags=["items"]
)

class ItemModel(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) 
    name = Column(String, index=True)

class ItemCreate(BaseModel):
    name: str
    user_id: int

class ItemResponse(BaseModel):
    id: int
    name: str
    user_id: int

    class Config:
        from_attributes = True


JWT_SECRET = os.getenv("JWT_SECRET", "bwip-demo-jwt-secret")
JWT_ALGORITHM = "HS256"
security = HTTPBearer(auto_error=False)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
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

    return int(subject)

@itemsRouter.post("/", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = ItemModel(name=item.name, user_id=item.user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@itemsRouter.get("/{item_id}", response_model=ItemResponse)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@itemsRouter.get("/owner-standard/{item_id}")
def read_item_owner_standard(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    owner = db.query(UserModel).filter(UserModel.id == db_item.user_id).first()
    return {
        "item": {
            "id": db_item.id,
            "name": db_item.name,
            "user_id": db_item.user_id,
        },
        "owner": {
            "id": owner.id if owner else None,
            "name": owner.name if owner else None,
        },
        "mode": "standard-no-jwt",
    }


@itemsRouter.get("/owner-jwt/{item_id}")
def read_item_owner_jwt(
    item_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    db_item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if db_item.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: token does not match item owner")

    owner = db.query(UserModel).filter(UserModel.id == db_item.user_id).first()
    return {
        "item": {
            "id": db_item.id,
            "name": db_item.name,
            "user_id": db_item.user_id,
        },
        "owner": {
            "id": owner.id if owner else None,
            "name": owner.name if owner else None,
        },
        "mode": "jwt-protected",
    }