from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routers.scheme_router import router as scheme_router
from app.routers.profile_router import router as profile_router
from app.routers.eligibility_router import router as eligibility_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NagrikSetu API",
    description="Explainable Government Benefit Navigation Platform",
    version="1.0.0",
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTERS
# =========================

app.include_router(scheme_router)
app.include_router(profile_router)
app.include_router(eligibility_router)


# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "NagrikSetu API is running",
        "status": "success",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }