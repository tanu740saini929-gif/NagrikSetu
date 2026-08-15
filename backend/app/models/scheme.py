from sqlalchemy import Column, Integer, String, Text, JSON
from app.database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    category = Column(String(100), nullable=False)

    beneficiary_type = Column(JSON, default=list)
    state_scope = Column(JSON, default=list)

    income_limit = Column(Integer, nullable=True)

    age_rules = Column(JSON, default=dict)
    gender_rules = Column(JSON, default=list)
    education_rules = Column(JSON, default=list)
    occupation_rules = Column(JSON, default=list)

    other_criteria = Column(JSON, default=list)

    required_documents = Column(JSON, default=list)
    benefits = Column(JSON, default=list)

    official_source = Column(String(500), nullable=True)
    official_application_url = Column(String(500), nullable=True)

    last_verified_date = Column(String(50), nullable=True)