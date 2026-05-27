from datetime import datetime
from pydantic import BaseModel, Field

class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=10)
    job_text: str = Field(..., min_length=10)


class AnalysisResult(BaseModel):
    candidate_name: str
    technical_skills: str
    experience_years: int = Field(..., ge=0)
    fit_score: int = Field(..., ge=0, le=100)
    summary: str



class AnalysisResponse(BaseModel):
    id: int
    candidate_name: str
    technical_skills: str
    experience_years: int
    fit_score: int
    summary: str
    created_at: datetime

    
class Config:
    from_attributes = True