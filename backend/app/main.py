from fastapi import FastAPI

from app.core.database import Base, engine
from app.models import user, note
from app.api import auth as auth_router
from app.api import notes as notes_router

app = FastAPI(title="InsightSync API")

# Create tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router.router)
app.include_router(notes_router.router)