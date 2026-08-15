import re


STATES = [
    "Uttarakhand",
    "Uttar Pradesh",
    "Himachal Pradesh",
    "Delhi",
    "Haryana",
    "Punjab",
    "Rajasthan",
    "Bihar",
    "West Bengal",
    "Maharashtra",
    "Gujarat",
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Telangana",
    "Andhra Pradesh",
]


def extract_income(text: str):
    """
    Detect common income formats such as:
    ₹2 lakh
    2 lakh
    300000
    ₹3,00,000
    3 lakhs
    """

    text_lower = text.lower()

    # lakh format
    lakh_match = re.search(
        r"(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*lakh",
        text_lower
    )

    if lakh_match:
        value = float(lakh_match.group(1))
        return int(value * 100000)

    # Indian comma format
    comma_match = re.search(
        r"(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{2,3})+)",
        text_lower
    )

    if comma_match:
        value = comma_match.group(1).replace(",", "")
        return int(value)

    # plain rupee amount
    number_match = re.search(
        r"(?:₹|rs\.?|inr)\s*(\d+)",
        text_lower
    )

    if number_match:
        return int(number_match.group(1))

    return None


def extract_age(text: str):
    match = re.search(
        r"\b(\d{1,3})\s*(?:years?\s*old|year\s*old|yrs?\s*old)\b",
        text.lower()
    )

    if match:
        return int(match.group(1))

    return None


def extract_state(text: str):
    text_lower = text.lower()

    for state in STATES:
        if state.lower() in text_lower:
            return state

    return None


def extract_education(text: str):
    text_lower = text.lower()

    if any(
        phrase in text_lower
        for phrase in [
            "college",
            "university",
            "graduation",
            "undergraduate",
            "b.tech",
            "btech",
            "degree"
        ]
    ):
        return "college"

    if any(
        phrase in text_lower
        for phrase in [
            "school",
            "class 10",
            "class 12",
            "10th",
            "12th"
        ]
    ):
        return "school"

    return None


def extract_gender(text: str):
    text_lower = text.lower()

    if any(
        word in text_lower
        for word in [
            "daughter",
            "girl",
            "woman",
            "female",
            "mother",
            "wife"
        ]
    ):
        return "female"

    if any(
        word in text_lower
        for word in [
            "son",
            "boy",
            "man",
            "male",
            "father",
            "husband"
        ]
    ):
        return "male"

    return None


def extract_beneficiary(text: str):
    text_lower = text.lower()

    if any(
        phrase in text_lower
        for phrase in [
            "senior citizen",
            "elderly",
            "old parents",
            "elderly parents"
        ]
    ):
        return "senior_citizen"

    if any(
        phrase in text_lower
        for phrase in [
            "farmer",
            "farming",
            "agriculture",
            "agricultural"
        ]
    ):
        return "farmer"

    if any(
        phrase in text_lower
        for phrase in [
            "entrepreneur",
            "start a business",
            "small business",
            "startup",
            "business"
        ]
    ):
        return "entrepreneur"

    if any(
        phrase in text_lower
        for phrase in [
            "student",
            "college",
            "university",
            "daughter is entering college",
            "son is entering college"
        ]
    ):
        return "student"

    if any(
        phrase in text_lower
        for phrase in [
            "woman",
            "women",
            "wife",
            "mother"
        ]
    ):
        return "woman"

    if any(
        phrase in text_lower
        for phrase in [
            "family",
            "household",
            "parents"
        ]
    ):
        return "family"

    return "individual"


def extract_occupation(text: str):
    text_lower = text.lower()

    if any(
        phrase in text_lower
        for phrase in ["farmer", "farming", "agriculture"]
    ):
        return "farmer"

    if any(
        phrase in text_lower
        for phrase in ["student", "college student", "university student"]
    ):
        return "student"

    if any(
        phrase in text_lower
        for phrase in ["entrepreneur", "business owner", "self employed"]
    ):
        return "entrepreneur"

    if any(
        phrase in text_lower
        for phrase in ["job seeker", "looking for a job", "unemployed"]
    ):
        return "job_seeker"

    return None


def extract_need(text: str):
    text_lower = text.lower()

    if any(
        phrase in text_lower
        for phrase in [
            "college",
            "education",
            "school fees",
            "tuition",
            "study",
            "student"
        ]
    ):
        return "education_financial_assistance"

    if any(
        phrase in text_lower
        for phrase in [
            "farmer",
            "farming",
            "agriculture",
            "crop",
            "irrigation"
        ]
    ):
        return "agriculture_support"

    if any(
        phrase in text_lower
        for phrase in [
            "business",
            "startup",
            "entrepreneur",
            "enterprise"
        ]
    ):
        return "entrepreneurship_support"

    if any(
        phrase in text_lower
        for phrase in [
            "health",
            "hospital",
            "medical",
            "treatment"
        ]
    ):
        return "healthcare_support"

    if any(
        phrase in text_lower
        for phrase in [
            "house",
            "housing",
            "home",
            "rent"
        ]
    ):
        return "housing_support"

    if any(
        phrase in text_lower
        for phrase in [
            "skill",
            "training",
            "job"
        ]
    ):
        return "skill_development"

    if any(
        phrase in text_lower
        for phrase in [
            "senior citizen",
            "elderly",
            "pension"
        ]
    ):
        return "social_security"

    return "general_support"


def extract_profile(description: str):
    text = description.strip()

    income = extract_income(text)
    age = extract_age(text)
    state = extract_state(text)

    education_level = extract_education(text)
    gender = extract_gender(text)

    beneficiary = extract_beneficiary(text)
    occupation = extract_occupation(text)
    need = extract_need(text)

    student_status = None

    if beneficiary == "student" or occupation == "student":
        student_status = "yes"
    elif any(
        phrase in text.lower()
        for phrase in [
            "not a student",
            "no longer a student"
        ]
    ):
        student_status = "no"

    family_situation = None

    if any(
        phrase in text.lower()
        for phrase in [
            "low income",
            "low household income",
            "poor family",
            "lower income"
        ]
    ):
        family_situation = "low_income_household"

    return {
        "age": age,
        "state": state,
        "annual_income": income,
        "occupation": occupation,
        "student_status": student_status,
        "education_level": education_level,
        "gender": gender,
        "family_situation": family_situation,
        "beneficiary": beneficiary,
        "need": need,
        "original_description": text
    }