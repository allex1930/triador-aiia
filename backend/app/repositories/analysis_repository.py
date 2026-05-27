from sqlalchemy.orm import Session

from app.models import Analysis


def create_analysis(
        db: Session,
        candidate_name: str,
        technical_skills: str,
        experience_years: int,
        fit_score: int,
        summary: str
):
    analysis = Analysis(
        candidate_name=candidate_name,
        technical_skills=technical_skills,
        experience_years=experience_years,
        fit_score=fit_score,
        summary=summary
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


def list_analyses(db: Session):
    return db.query(Analysis).order_by(Analysis.created_at.desc()).all()