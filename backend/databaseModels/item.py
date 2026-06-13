from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String
from database import Base, engine, get_db
from fastapi import APIRouter, Depends, HTTPException

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