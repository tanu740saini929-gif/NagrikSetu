from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, SessionLocal

from app.routers.scheme_router import router as scheme_router
from app.routers.profile_router import router as profile_router
from app.routers.eligibility_router import router as eligibility_router

from app.services.seed_service import seed_schemes


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# SEED SCHEMES
# ==========================================

def initialize_database():
    db = SessionLocal()

    try:
        result = seed_schemes(db)
        print(
            f"Database initialization completed: "
            f"{result['added']} schemes added, "
            f"{result['total']} schemes total."
        )
    except Exception as e:
        print(f"Database seeding failed: {e}")
    finally:
        db.close()


initialize_database()


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="NagrikSetu API",
    description="Explainable Government Benefit Navigation Platform",
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",

        # Production frontend
        "https://nagriksetu-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROUTERS
# ==========================================

app.include_router(scheme_router)
app.include_router(profile_router)
app.include_router(eligibility_router)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "NagrikSetu API is running",
        "status": "success",
    }


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }