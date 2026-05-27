from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String, nullable=False)
    technical_skills = Column(Text, nullable=False)
    experience_years = Column(Integer, nullable=False)
    fit_score = Column(Integer, nullable=False)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

