from fastapi import FastAPI
from app.core.database import Base, engine
from app.api import notes as notes_router

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(notes_router.router)