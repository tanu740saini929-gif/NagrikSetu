from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProfileExtractRequest(BaseModel):
    description: str


class ProfileBase(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None

    state: Optional[str] = None
    district: Optional[str] = None

    annual_income: Optional[int] = None

    occupation: Optional[str] = None

    student_status: Optional[str] = None

    education_level: Optional[str] = None

    gender: Optional[str] = None

    family_situation: Optional[str] = None

    beneficiary: Optional[str] = None

    need: Optional[str] = None


class ProfileCreate(ProfileBase):
    original_description: Optional[str] = None


class ProfileResponse(ProfileBase):
    id: int
    original_description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)