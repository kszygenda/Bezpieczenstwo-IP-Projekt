from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from databaseModels.item import itemsRouter, ItemModel
from databaseModels.sqli import sqliRouter
from databaseModels.user import usersRouter, UserModel
from databaseModels.userPermission import permissionsRouter, UserPermissionModel

Base.metadata.create_all(bind=engine)

def initialize_db_data():
    db = SessionLocal()
    try:
        if db.query(UserModel).first() is not None:
            return

        admin = UserModel(name="admin", password="admin_password")
        test = UserModel(name="test", password="test_password")
        user = UserModel(name="user", password="user_password")
        
        db.add_all([admin, test, user])
        db.commit()
        
        db.refresh(admin)
        db.refresh(test)
        db.refresh(user)

        perm_admin = UserPermissionModel(user_id=admin.id, permission=1)
        perm_test = UserPermissionModel(user_id=test.id, permission=2)
        perm_user = UserPermissionModel(user_id=user.id, permission=3)
        
        item_1 = ItemModel(name="Przedmiot testowy 1", user_id=user.id)
        item_2 = ItemModel(name="Przedmiot testowy 2", user_id=test.id)

        db.add_all([perm_admin, perm_test, perm_user, item_1, item_2])
        db.commit()
    finally:
        db.close()

initialize_db_data()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://127.0.0.1",
        "http://127.0.0.1:80",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(itemsRouter)
app.include_router(usersRouter)
app.include_router(permissionsRouter)
app.include_router(sqliRouter)

@app.get("/health")
def health_check():
    return {"status": "healthy"}