from app.services.eligibility_engine import evaluate_scheme


def normalize(value):
    if value is None:
        return None

    if isinstance(value, str):
        return value.strip().lower()

    return value


def calculate_similarity(profile, rejected_scheme, alternative_scheme):
    score = 0
    reasons = []

    # Same state
    rejected_states = [
        normalize(x)
        for x in (rejected_scheme.state_scope or [])
    ]

    alternative_states = [
        normalize(x)
        for x in (alternative_scheme.state_scope or [])
    ]

    if profile.state:
        state = normalize(profile.state)

        if state in alternative_states:
            score += 30
            reasons.append(
                "Your state matches this scheme."
            )

        elif "all india" in alternative_states:
            score += 25
            reasons.append(
                "This scheme is available across India."
            )

    # Same beneficiary type
    rejected_beneficiaries = [
        normalize(x)
        for x in (rejected_scheme.beneficiary_type or [])
    ]

    alternative_beneficiaries = [
        normalize(x)
        for x in (alternative_scheme.beneficiary_type or [])
    ]

    if profile.beneficiary:
        beneficiary = normalize(profile.beneficiary)

        if beneficiary in alternative_beneficiaries:
            score += 30
            reasons.append(
                "Your beneficiary category matches."
            )

    # Occupation
    alternative_occupations = [
        normalize(x)
        for x in (alternative_scheme.occupation_rules or [])
    ]

    if profile.occupation:
        occupation = normalize(profile.occupation)

        if occupation in alternative_occupations:
            score += 20
            reasons.append(
                "Your occupation matches."
            )

    # Education
    alternative_education = [
        normalize(x)
        for x in (alternative_scheme.education_rules or [])
    ]

    if profile.education_level:
        education = normalize(profile.education_level)

        if education in alternative_education:
            score += 20
            reasons.append(
                "Your education level matches."
            )

    return min(score, 100), reasons


def find_alternatives(
    profile,
    rejected_scheme,
    all_schemes
):
    alternatives = []

    for scheme in all_schemes:

        # Don't recommend the same scheme
        if scheme.id == rejected_scheme.id:
            continue

        # Evaluate the alternative
        evaluation = evaluate_scheme(
            profile,
            scheme
        )

        # Only recommend schemes that are not
        # completely rejected.
        if evaluation["status"] == "not_eligible":
            continue

        similarity_score, reasons = calculate_similarity(
            profile,
            rejected_scheme,
            scheme
        )

        if similarity_score == 0:
            continue

        alternatives.append({
            "scheme_id": scheme.id,
            "scheme": scheme.name,
            "similarity_score": similarity_score,
            "eligibility_status": evaluation["status"],
            "eligibility_score": evaluation["score"],
            "why_recommended": reasons,
            "benefits": scheme.benefits or [],
            "required_documents": (
                scheme.required_documents or []
            ),
        })

    alternatives.sort(
        key=lambda x: (
            -x["similarity_score"],
            -x["eligibility_score"]
        )
    )

    return alternatives[:5]