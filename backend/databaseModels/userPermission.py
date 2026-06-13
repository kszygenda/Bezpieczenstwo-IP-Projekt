from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session
from database import Base, get_db

permissionsRouter = APIRouter(
    prefix="/permissions",
    tags=["permissions"]
)

class UserPermissionModel(Base):
    __tablename__ = "UserPermissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    permission = Column(Integer, index=True)

class UserPermissionCreate(BaseModel):
    permission: int
    user_id: int

class UserPermissionResponse(BaseModel):
    id: int
    permission: int
    user_id: int

    class Config:
        from_attributes = True

@permissionsRouter.post("/", response_model=UserPermissionResponse)
def create_permission(permission: UserPermissionCreate, db: Session = Depends(get_db)):
    db_permission = UserPermissionModel(
        permission=permission.permission, 
        user_id=permission.user_id
    )
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

@permissionsRouter.get("/{permission_id}", response_model=UserPermissionResponse)
def read_permission(permission_id: int, db: Session = Depends(get_db)):
    db_permission = db.query(UserPermissionModel).filter(UserPermissionModel.id == permission_id).first()
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    return db_permission