from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class CitizenProfile(Base):
    __tablename__ = "citizen_profiles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=True)

    age = Column(Integer, nullable=True)

    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)

    annual_income = Column(Integer, nullable=True)

    occupation = Column(String(100), nullable=True)

    student_status = Column(String(50), nullable=True)

    education_level = Column(String(100), nullable=True)

    gender = Column(String(50), nullable=True)

    family_situation = Column(Text, nullable=True)

    beneficiary = Column(String(100), nullable=True)

    need = Column(String(150), nullable=True)

    original_description = Column(Text, nullable=True)