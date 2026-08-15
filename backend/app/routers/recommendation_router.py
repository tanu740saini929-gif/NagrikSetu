from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import CitizenProfile
from app.models.scheme import Scheme
from app.services.eligibility_engine import evaluate_all_schemes
from app.services.recommendation_engine import generate_recommendations
from app.schemas.recommendation import RecommendationResponse


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"]
)


DBSession = Annotated[
    Session,
    Depends(get_db)
]


@router.get(
    "/{profile_id}",
    response_model=RecommendationResponse
)
def get_recommendations(
    profile_id: int,
    db: DBSession
):

    profile = (
        db.query(CitizenProfile)
        .filter(
            CitizenProfile.id == profile_id
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

    eligibility_results = evaluate_all_schemes(
        profile,
        schemes
    )

    recommendations = generate_recommendations(
        eligibility_results
    )

    return {
        "profile_id": profile.id,
        **recommendations
    }