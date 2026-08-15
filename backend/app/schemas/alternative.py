from pydantic import BaseModel


class AlternativeItem(BaseModel):
    scheme_id: int
    scheme: str

    similarity_score: int
    eligibility_status: str
    eligibility_score: int

    why_recommended: list[str]

    benefits: list[str]
    required_documents: list[str]


class AlternativeResponse(BaseModel):
    profile_id: int
    rejected_scheme_id: int
    rejected_scheme: str

    alternatives: list[AlternativeItem]