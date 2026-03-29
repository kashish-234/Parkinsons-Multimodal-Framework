from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, datasets, models, patients, settings
from app.config import settings

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS = ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(datasets.router)
app.include_router(models.router)
app.include_router(patients.router)
app.include_router(settings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the backend API!"}