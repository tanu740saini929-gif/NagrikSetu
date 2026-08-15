from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import CitizenProfile
from app.models.scheme import Scheme

from app.schemas.alternative import AlternativeResponse

from app.services.alternative_engine import (
    find_alternatives
)


router = APIRouter(
    prefix="/api/alternatives",
    tags=["Alternative Benefits"]
)


DBSession = Annotated[
    Session,
    Depends(get_db)
]


@router.get(
    "/{profile_id}/{scheme_id}",
    response_model=AlternativeResponse
)
def get_alternatives(
    profile_id: int,
    scheme_id: int,
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

    rejected_scheme = (
        db.query(Scheme)
        .filter(
            Scheme.id == scheme_id
        )
        .first()
    )

    if not rejected_scheme:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found"
        )

    all_schemes = db.query(Scheme).all()

    alternatives = find_alternatives(
        profile,
        rejected_scheme,
        all_schemes
    )

    return {
        "profile_id": profile.id,
        "rejected_scheme_id": rejected_scheme.id,
        "rejected_scheme": rejected_scheme.name,
        "alternatives": alternatives
    }