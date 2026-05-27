from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import models
from app.database import Base, SessionLocal, engine
from app.repositories.analysis_repository import create_analysis, list_analyses
from app.schemas import AnalysisRequest, AnalysisResponse
from app.services.analysis_service import analyze_resume

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Triador API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def health_check():
    return {"message": "API do Triador rodando"}


@app.post("/analyses", response_model=AnalysisResponse)
def create_analysis_route(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    analysis_result = analyze_resume(
        resume_text=request.resume_text,
        job_text=request.job_text
    )

    analysis = create_analysis(
        db=db,
        candidate_name=analysis_result.candidate_name,
        technical_skills=analysis_result.technical_skills,
        experience_years=analysis_result.experience_years,
        fit_score=analysis_result.fit_score,
        summary=analysis_result.summary
    )

    return analysis


@app.get("/analyses", response_model=list[AnalysisResponse])
def list_analyses_route(db: Session = Depends(get_db)):
    return list_analyses(db)