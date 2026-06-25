from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.session import Base
import uuid


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # image, document, text, generated
    file_url = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # logo, copy, script, visual, other
    file_size = Column(Integer, default=0)
    is_ai_generated = Column(Boolean, default=False)
    tags = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="assets")
