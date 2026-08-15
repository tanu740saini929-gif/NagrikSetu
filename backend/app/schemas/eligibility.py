from typing import Any

from pydantic import BaseModel


class EligibilityRequest(BaseModel):
    profile_id: int


class EligibilityResult(BaseModel):
    scheme_id: int
    scheme: str
    status: str
    score: int

    passed_rules: list[dict[str, Any]]
    failed_rules: list[dict[str, Any]]
    missing_information: list[dict[str, Any]]

    required_documents: list[str]
    benefits: list[str]


class EligibilityResponse(BaseModel):
    profile_id: int
    total_schemes_evaluated: int
    results: list[EligibilityResult]