from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class SchemeBase(BaseModel):
    name: str
    description: str
    category: str

    beneficiary_type: list[str] = []
    state_scope: list[str] = []

    income_limit: Optional[int] = None

    age_rules: dict[str, Any] = {}
    gender_rules: list[str] = []
    education_rules: list[str] = []
    occupation_rules: list[str] = []

    other_criteria: list[str] = []

    required_documents: list[str] = []
    benefits: list[str] = []

    official_source: Optional[str] = None
    official_application_url: Optional[str] = None

    last_verified_date: Optional[str] = None


class SchemeCreate(SchemeBase):
    pass


class SchemeResponse(SchemeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)