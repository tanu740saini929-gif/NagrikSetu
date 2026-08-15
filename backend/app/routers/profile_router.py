from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import CitizenProfile
from app.schemas.profile import ProfileCreate, ProfileResponse


router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)

DBSession = Annotated[Session, Depends(get_db)]


@router.post("/", response_model=ProfileResponse)
def create_profile(
    profile: ProfileCreate,
    db: DBSession
):
    try:
        new_profile = CitizenProfile(
            name=profile.name,
            age=profile.age,
            state=profile.state,
            district=profile.district,
            annual_income=profile.annual_income,
            occupation=profile.occupation,
            student_status=profile.student_status,
            education_level=profile.education_level,
            gender=profile.gender,
            family_situation=profile.family_situation,
            beneficiary=profile.beneficiary,
            need=profile.need,
            original_description=profile.original_description,
        )

        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)

        return new_profile

    except Exception as e:
        db.rollback()

        print("PROFILE CREATION ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Profile creation failed: {str(e)}"
        )


@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(
    profile_id: int,
    db: DBSession
):
    profile = (
        db.query(CitizenProfile)
        .filter(CitizenProfile.id == profile_id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Citizen profile not found"
        )

    return profile