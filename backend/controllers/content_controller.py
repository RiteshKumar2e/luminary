from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from models.user import User
from models.history import GenerationHistory
from schemas.content import (
    StoryRequest,
    CampaignRequest,
    BrandKitRequest,
    CaptionRequest,
    ScriptRequest,
    AnalysisRequest,
)
from ai_services.groq_service import groq_service
from ai_services.watson_service import watson_nlu
import json


async def _save_history(
    db: Session,
    user_id: str,
    feature_type: str,
    prompt: str,
    result: str,
    watson_analysis: Optional[dict],
    tokens_used: int,
    model_used: str,
):
    entry = GenerationHistory(
        user_id=user_id,
        feature_type=feature_type,
        prompt=prompt[:500],
        result=result,
        watson_analysis=watson_analysis,
        tokens_used=tokens_used,
        model_used=model_used,
    )
    db.add(entry)
    db.commit()
    return entry


async def generate_story(payload: StoryRequest, user: User, db: Session):
    result = await groq_service.generate_story(
        title=payload.title or "",
        genre=payload.genre,
        tone=payload.tone,
        length=payload.length,
        prompt=payload.prompt,
        characters=payload.characters,
        setting=payload.setting,
    )
    content = result["content"]
    watson = await watson_nlu.analyze_tone(content[:3000])

    await _save_history(
        db, user.id, "story", payload.prompt, content,
        watson, result.get("tokens_used", 0), result.get("model", ""),
    )
    return {"content": content, "analysis": watson, "tokens_used": result.get("tokens_used", 0)}


async def generate_campaign(payload: CampaignRequest, user: User, db: Session):
    result = await groq_service.generate_campaign(
        brand_name=payload.brand_name,
        product=payload.product,
        target_audience=payload.target_audience,
        campaign_goal=payload.campaign_goal,
        tone=payload.tone,
        platforms=payload.platforms,
        budget_level=payload.budget_level,
    )
    content = result["content"]
    watson = await watson_nlu.analyze_tone(content[:3000])

    await _save_history(
        db, user.id, "campaign", payload.campaign_goal, content,
        watson, result.get("tokens_used", 0), result.get("model", ""),
    )
    return {"content": content, "analysis": watson, "tokens_used": result.get("tokens_used", 0)}


async def generate_brand_kit(payload: BrandKitRequest, user: User, db: Session):
    result = await groq_service.generate_brand_kit(
        brand_name=payload.brand_name,
        industry=payload.industry,
        brand_personality=payload.brand_personality,
        target_audience=payload.target_audience,
        values=payload.values,
    )
    content = result["content"]
    watson = await watson_nlu.analyze_content_quality(content[:3000])

    await _save_history(
        db, user.id, "brand_kit", payload.brand_name, content,
        watson, result.get("tokens_used", 0), result.get("model", ""),
    )
    return {"content": content, "analysis": watson, "tokens_used": result.get("tokens_used", 0)}


async def generate_captions(payload: CaptionRequest, user: User, db: Session):
    result = await groq_service.generate_captions(
        platform=payload.platform,
        content_description=payload.content_description,
        tone=payload.tone,
        include_hashtags=payload.include_hashtags,
        count=payload.count,
    )
    content = result["content"]
    await _save_history(
        db, user.id, "caption", payload.content_description, content,
        None, result.get("tokens_used", 0), result.get("model", ""),
    )
    return {"content": content, "tokens_used": result.get("tokens_used", 0)}


async def generate_script(payload: ScriptRequest, user: User, db: Session):
    result = await groq_service.generate_script(
        script_type=payload.script_type,
        topic=payload.topic,
        duration_seconds=payload.duration_seconds or 60,
        tone=payload.tone,
        target_audience=payload.target_audience,
    )
    content = result["content"]
    watson = await watson_nlu.analyze_tone(content[:3000])

    await _save_history(
        db, user.id, "script", payload.topic, content,
        watson, result.get("tokens_used", 0), result.get("model", ""),
    )
    return {"content": content, "analysis": watson, "tokens_used": result.get("tokens_used", 0)}


async def brainstorm(topic: str, category: str, count: int, user: User, db: Session):
    result = await groq_service.brainstorm_ideas(topic=topic, category=category, count=count)
    content = result["content"]
    await _save_history(
        db, user.id, "brainstorm", topic, content,
        None, result.get("tokens_used", 0), result.get("model", ""),
    )
    return {"content": content, "tokens_used": result.get("tokens_used", 0)}


async def analyze_content(payload: AnalysisRequest):
    report = await watson_nlu.analyze_content_quality(payload.text)
    return {"analysis": report}


async def get_history(user: User, db: Session, skip: int, limit: int, feature_type: Optional[str]):
    query = db.query(GenerationHistory).filter(GenerationHistory.user_id == user.id)
    if feature_type:
        query = query.filter(GenerationHistory.feature_type == feature_type)
    total = query.count()
    items = query.order_by(GenerationHistory.created_at.desc()).offset(skip).limit(limit).all()
    return {"items": items, "total": total, "skip": skip, "limit": limit}


async def delete_history_item(item_id: str, user: User, db: Session):
    item = db.query(GenerationHistory).filter(
        GenerationHistory.id == item_id,
        GenerationHistory.user_id == user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="History item not found")
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}
