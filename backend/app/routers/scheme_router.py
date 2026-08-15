from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeResponse


router = APIRouter(
    prefix="/api/schemes",
    tags=["Schemes"]
)


# Database dependency
DBSession = Annotated[Session, Depends(get_db)]


@router.get(
    "/",
    response_model=list[SchemeResponse]
)
def get_schemes(db: DBSession):
    return db.query(Scheme).all()


@router.get(
    "/{scheme_id}",
    response_model=SchemeResponse,
    responses={
        404: {
            "description": "Scheme not found"
        }
    }
)
def get_scheme(
    scheme_id: int,
    db: DBSession
):
    scheme = (
        db.query(Scheme)
        .filter(Scheme.id == scheme_id)
        .first()
    )

    if not scheme:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found"
        )

    return scheme