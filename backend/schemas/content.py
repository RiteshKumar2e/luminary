from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, List
from datetime import datetime


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    project_type: str
    tags: Optional[List[str]] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    project_type: str
    status: str
    content: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=5, max_length=2000)
    feature_type: str
    options: Optional[Dict[str, Any]] = None


class StoryRequest(BaseModel):
    title: Optional[str] = None
    genre: str = "general"
    tone: str = "neutral"
    length: str = "medium"  # short, medium, long
    prompt: str = Field(..., min_length=10)
    characters: Optional[List[str]] = None
    setting: Optional[str] = None


class CampaignRequest(BaseModel):
    brand_name: str
    product: str
    target_audience: str
    campaign_goal: str
    tone: str = "professional"
    platforms: Optional[List[str]] = None
    budget_level: str = "medium"


class BrandKitRequest(BaseModel):
    brand_name: str
    industry: str
    brand_personality: str
    target_audience: str
    values: Optional[List[str]] = None


class CaptionRequest(BaseModel):
    platform: str  # instagram, twitter, linkedin, tiktok
    content_description: str
    tone: str = "engaging"
    include_hashtags: bool = True
    count: int = Field(default=3, ge=1, le=10)


class ScriptRequest(BaseModel):
    script_type: str  # ad, youtube, podcast, reel, explainer
    topic: str
    duration_seconds: Optional[int] = 60
    tone: str = "conversational"
    target_audience: Optional[str] = None


class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10)
    analysis_types: Optional[List[str]] = None  # tone, emotion, sentiment, keywords, entities


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_length=1)
    context: Optional[str] = None  # recent generation context to inject


class StoryBranchRequest(BaseModel):
    genre: str = "general"
    tone: str = "neutral"
    characters: Optional[List[str]] = None
    setting: Optional[str] = None
    previous_segments: List[str] = Field(default_factory=list)
    choices_made: List[str] = Field(default_factory=list)
    selected_choice: str = Field(..., min_length=1)


class ABTestRequest(BaseModel):
    campaign_topic: str
    variant_a: str
    variant_b: str
    target_persona: str


class ABGenerateRequest(BaseModel):
    variant_a: str
    tone_or_style: str = "punchy"

