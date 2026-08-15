def normalize(value):
    if value is None:
        return None

    if isinstance(value, str):
        return value.strip().lower()

    return value


# =========================================================
# AGE
# =========================================================

def evaluate_age(profile, scheme):
    rules = scheme.age_rules or {}

    if not rules:
        return {
            "status": "pass",
            "message": "No age restriction specified."
        }

    age = profile.age

    if age is None:
        return {
            "status": "missing",
            "message": "Age information is required."
        }

    minimum = rules.get("min")
    maximum = rules.get("max")

    if minimum is not None and age < minimum:
        return {
            "status": "fail",
            "message": f"Age must be at least {minimum}."
        }

    if maximum is not None and age > maximum:
        return {
            "status": "fail",
            "message": f"Age must not exceed {maximum}."
        }

    return {
        "status": "pass",
        "message": "Age requirement satisfied."
    }


# =========================================================
# INCOME
# =========================================================

def evaluate_income(profile, scheme):
    limit = scheme.income_limit

    if limit is None:
        return {
            "status": "pass",
            "message": "No income limit specified."
        }

    income = profile.annual_income

    if income is None:
        return {
            "status": "missing",
            "message": "Annual household income is required."
        }

    if income <= limit:
        return {
            "status": "pass",
            "message": f"Income is within the ₹{limit:,} limit."
        }

    return {
        "status": "fail",
        "message": f"Income exceeds the ₹{limit:,} limit."
    }


# =========================================================
# STATE
# =========================================================

def evaluate_state(profile, scheme):
    allowed_states = scheme.state_scope or []

    if not allowed_states:
        return {
            "status": "pass",
            "message": "No state restriction specified."
        }

    if not profile.state:
        return {
            "status": "missing",
            "message": "State information is required."
        }

    profile_state = normalize(profile.state)

    normalized_states = [
        normalize(state)
        for state in allowed_states
    ]

    if "all india" in normalized_states:
        return {
            "status": "pass",
            "message": "Scheme is available across India."
        }

    if profile_state in normalized_states:
        return {
            "status": "pass",
            "message": f"State requirement satisfied: {profile.state}."
        }

    return {
        "status": "fail",
        "message": "The citizen's state is outside the scheme scope."
    }


# =========================================================
# OCCUPATION
# =========================================================

def evaluate_occupation(profile, scheme):
    rules = scheme.occupation_rules or []

    if not rules:
        return {
            "status": "pass",
            "message": "No occupation restriction specified."
        }

    if not profile.occupation:
        return {
            "status": "missing",
            "message": "Occupation information is required."
        }

    occupation = normalize(profile.occupation)

    allowed = [
        normalize(item)
        for item in rules
    ]

    if occupation in allowed:
        return {
            "status": "pass",
            "message": "Occupation requirement satisfied."
        }

    return {
        "status": "fail",
        "message": "Occupation does not match the scheme requirement."
    }


# =========================================================
# EDUCATION
# =========================================================

def evaluate_student(profile, scheme):
    rules = scheme.education_rules or []

    if not rules:
        return {
            "status": "pass",
            "message": "No education restriction specified."
        }

    education = normalize(profile.education_level)

    if not education:
        return {
            "status": "missing",
            "message": "Education level is required."
        }

    allowed = [
        normalize(item)
        for item in rules
    ]

    if education in allowed:
        return {
            "status": "pass",
            "message": "Education requirement satisfied."
        }

    return {
        "status": "fail",
        "message": "Education level does not match."
    }


# =========================================================
# STUDENT STATUS
# =========================================================

def evaluate_student_status(profile, scheme):
    """
    Evaluates whether the citizen's student status
    matches the scheme's student requirement.

    This is optional because the current Scheme model
    may not have a dedicated student_status_rules field.

    If the scheme does not define such a field,
    this check automatically passes.
    """

    rules = getattr(
        scheme,
        "student_status_rules",
        None
    )

    rules = rules or []

    if not rules:
        return {
            "status": "pass",
            "message": "No student-status restriction specified."
        }

    if not profile.student_status:
        return {
            "status": "missing",
            "message": "Student status is required."
        }

    student_status = normalize(
        profile.student_status
    )

    allowed = [
        normalize(item)
        for item in rules
    ]

    if student_status in allowed:
        return {
            "status": "pass",
            "message": "Student status requirement satisfied."
        }

    return {
        "status": "fail",
        "message": "Student status does not match."
    }


# =========================================================
# GENDER
# =========================================================

def evaluate_gender(profile, scheme):
    rules = scheme.gender_rules or []

    if not rules:
        return {
            "status": "pass",
            "message": "No gender restriction specified."
        }

    if not profile.gender:
        return {
            "status": "missing",
            "message": "Gender information is required."
        }

    gender = normalize(profile.gender)

    allowed = [
        normalize(item)
        for item in rules
    ]

    if gender in allowed:
        return {
            "status": "pass",
            "message": "Gender requirement satisfied."
        }

    return {
        "status": "fail",
        "message": "Gender requirement does not match."
    }


# =========================================================
# BENEFICIARY
# =========================================================

def evaluate_beneficiary(profile, scheme):
    rules = scheme.beneficiary_type or []

    if not rules:
        return {
            "status": "pass",
            "message": "No beneficiary restriction specified."
        }

    if not profile.beneficiary:
        return {
            "status": "missing",
            "message": "Beneficiary type is required."
        }

    beneficiary = normalize(
        profile.beneficiary
    )

    allowed = [
        normalize(item)
        for item in rules
    ]

    if beneficiary in allowed:
        return {
            "status": "pass",
            "message": "Beneficiary requirement satisfied."
        }

    return {
        "status": "fail",
        "message": "Beneficiary type does not match."
    }


# =========================================================
# FAMILY SITUATION
# =========================================================

def evaluate_family_situation(profile, scheme):
    """
    Evaluates family situation only if the Scheme model
    contains family_situation_rules.

    This keeps the engine compatible with your current
    database model.
    """

    rules = getattr(
        scheme,
        "family_situation_rules",
        None
    )

    rules = rules or []

    if not rules:
        return {
            "status": "pass",
            "message": "No family-situation restriction specified."
        }

    if not profile.family_situation:
        return {
            "status": "missing",
            "message": "Family situation is required."
        }

    situation = normalize(
        profile.family_situation
    )

    allowed = [
        normalize(item)
        for item in rules
    ]

    if situation in allowed:
        return {
            "status": "pass",
            "message": "Family situation requirement satisfied."
        }

    return {
        "status": "fail",
        "message": "Family situation does not match."
    }


# =========================================================
# NEED
# =========================================================

def evaluate_need(profile, scheme):
    """
    Evaluates the citizen's requested need.

    Uses a scheme field called need_types if available.
    """

    rules = getattr(
        scheme,
        "need_types",
        None
    )

    rules = rules or []

    if not rules:
        return {
            "status": "pass",
            "message": "No specific need restriction specified."
        }

    if not profile.need:
        return {
            "status": "missing",
            "message": "Citizen's need is required."
        }

    need = normalize(profile.need)

    allowed = [
        normalize(item)
        for item in rules
    ]

    if need in allowed:
        return {
            "status": "pass",
            "message": "Benefit category matches the citizen's need."
        }

    return {
        "status": "fail",
        "message": "The scheme does not address the selected need."
    }


# =========================================================
# EVALUATE ONE SCHEME
# =========================================================

def evaluate_scheme(profile, scheme):
    """
    Deterministically evaluates a citizen profile
    against one government scheme.
    """

    checks = {
        "age": evaluate_age(
            profile,
            scheme
        ),

        "income": evaluate_income(
            profile,
            scheme
        ),

        "state": evaluate_state(
            profile,
            scheme
        ),

        "occupation": evaluate_occupation(
            profile,
            scheme
        ),

        "education": evaluate_student(
            profile,
            scheme
        ),

        "student_status": evaluate_student_status(
            profile,
            scheme
        ),

        "gender": evaluate_gender(
            profile,
            scheme
        ),

        "beneficiary": evaluate_beneficiary(
            profile,
            scheme
        ),

        "family_situation": evaluate_family_situation(
            profile,
            scheme
        ),

        "need": evaluate_need(
            profile,
            scheme
        ),
    }

    passed_rules = []
    failed_rules = []
    missing_information = []

    for rule_name, result in checks.items():

        if result["status"] == "pass":

            passed_rules.append({
                "rule": rule_name,
                "message": result["message"]
            })

        elif result["status"] == "fail":

            failed_rules.append({
                "rule": rule_name,
                "message": result["message"]
            })

        elif result["status"] == "missing":

            missing_information.append({
                "rule": rule_name,
                "message": result["message"]
            })

    total_rules = len(checks)

    passed_count = len(
        passed_rules
    )

    score = round(
        (passed_count / total_rules) * 100
    )

    # -----------------------------------------
    # FINAL STATUS
    # -----------------------------------------

    if failed_rules:

        status = "not_eligible"

    elif missing_information:

        status = "missing_information"

    elif passed_count == total_rules:

        status = "eligible"

    else:

        status = "partially_eligible"

    return {
        "scheme_id": scheme.id,

        "scheme": scheme.name,

        "status": status,

        "score": score,

        "passed_rules": passed_rules,

        "failed_rules": failed_rules,

        "missing_information": missing_information,

        "required_documents":
            scheme.required_documents or [],

        "benefits":
            scheme.benefits or [],
    }


# =========================================================
# EVALUATE ALL SCHEMES
# =========================================================

def evaluate_all_schemes(profile, schemes):

    results = []

    for scheme in schemes:

        result = evaluate_scheme(
            profile,
            scheme
        )

        results.append(result)

    status_order = {
        "eligible": 0,
        "partially_eligible": 1,
        "missing_information": 2,
        "not_eligible": 3,
    }

    results.sort(
        key=lambda item: (
            status_order[item["status"]],
            -item["score"]
        )
    )

    return results