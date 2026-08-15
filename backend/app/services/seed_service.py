import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.scheme import Scheme


BASE_DIR = Path(__file__).resolve().parents[2]
SEED_FILE = BASE_DIR / "seed" / "schemes.json"


def seed_schemes(db: Session):
    """
    Add missing demo schemes to the database.
    Existing schemes are preserved.
    """

    with open(SEED_FILE, "r", encoding="utf-8") as file:
        schemes = json.load(file)

    added = 0

    for scheme_data in schemes:
        existing = (
            db.query(Scheme)
            .filter(Scheme.name == scheme_data["name"])
            .first()
        )

        if existing:
            continue

        scheme = Scheme(**scheme_data)
        db.add(scheme)
        added += 1

    db.commit()

    total = db.query(Scheme).count()

    return {
        "message": "Scheme seeding completed",
        "added": added,
        "total": total
    }