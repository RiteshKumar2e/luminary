from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.session import Base
import uuid


class GenerationHistory(Base):
    __tablename__ = "generation_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    feature_type = Column(String, nullable=False)  # story, campaign, brand_kit, caption, script
    prompt = Column(Text, nullable=False)
    result = Column(Text, nullable=True)
    watson_analysis = Column(JSON, nullable=True)
    tokens_used = Column(Integer, default=0)
    model_used = Column(String, nullable=True)
    status = Column(String, default="success")  # success, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="history")
