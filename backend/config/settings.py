from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Luminary AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    # No default — must be set in .env
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    DATABASE_URL: str = "sqlite:///./luminary.db"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-70b-8192"

    WATSON_NLU_API_KEY: str = ""
    WATSON_NLU_URL: str = ""
    WATSON_TONE_API_KEY: str = ""
    WATSON_TONE_URL: str = ""

    MAX_UPLOAD_SIZE_MB: int = 10
    UPLOAD_DIR: str = "uploads"

    PEXELS_API_KEY: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
