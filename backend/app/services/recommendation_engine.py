def generate_recommendations(results):
    strong_matches = []
    needs_information = []
    not_eligible = []

    for result in results:

        item = {
            "scheme_id": result["scheme_id"],
            "scheme": result["scheme"],
            "score": result["score"],
            "status": result["status"],
            "benefits": result.get("benefits", []),
            "required_documents": result.get(
                "required_documents", []
            ),
        }

        if result["status"] == "eligible":
            strong_matches.append(item)

        elif result["status"] == "missing_information":
            needs_information.append(item)

        elif result["status"] == "partially_eligible":
            needs_information.append(item)

        else:
            not_eligible.append(item)

    return {
        "strong_matches": strong_matches,
        "needs_information": needs_information,
        "not_eligible": not_eligible,
    }