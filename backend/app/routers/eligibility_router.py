from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import CitizenProfile
from app.models.scheme import Scheme
from app.schemas.eligibility import (
    EligibilityRequest,
    EligibilityResponse,
)
from app.services.eligibility_engine import evaluate_all_schemes


router = APIRouter(
    prefix="/api/eligibility",
    tags=["Eligibility"]
)


DBSession = Annotated[Session, Depends(get_db)]


@router.post(
    "/evaluate",
    response_model=EligibilityResponse
)
def evaluate_eligibility(
    request: EligibilityRequest,
    db: DBSession
):
    profile = (
        db.query(CitizenProfile)
        .filter(
            CitizenProfile.id == request.profile_id
        )
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Citizen profile not found"
        )

    schemes = db.query(Scheme).all()

    if not schemes:
        raise HTTPException(
            status_code=404,
            detail="No schemes available"
        )

    results = evaluate_all_schemes(
        profile,
        schemes
    )

    return {
        "profile_id": profile.id,
        "total_schemes_evaluated": len(schemes),
        "results": results
    }