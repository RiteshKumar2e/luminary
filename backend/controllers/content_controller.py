from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from models.user import User
from models.history import GenerationHistory
from schemas.content import (
    StoryRequest,
    CampaignRequest,
    BrandKitRequest,
    CaptionRequest,
    ScriptRequest,
    AnalysisRequest,
    ChatRequest,
)
from ai_services.groq_service import groq_service
from ai_services.watson_service import watson_nlu
from config.settings import settings
import json
import httpx
import logging

logger = logging.getLogger(__name__)


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


async def chat_with_muse(payload: ChatRequest, user: User, db: Session):
    # Optionally inject recent generation context so the Muse knows what this user creates
    context = payload.context
    if not context:
        recent = (
            db.query(GenerationHistory)
            .filter(GenerationHistory.user_id == user.id)
            .order_by(GenerationHistory.created_at.desc())
            .limit(3)
            .all()
        )
        if recent:
            snippets = [f"- {r.feature_type}: {r.prompt[:80]}" for r in recent]
            context = "Recent creations:\n" + "\n".join(snippets)

    messages = [{"role": m.role, "content": m.content} for m in payload.messages]
    result = await groq_service.generate_chat(messages=messages, context=context)
    return {"reply": result["content"], "tokens_used": result.get("tokens_used", 0)}


async def get_style_profile(user: User, db: Session):
    items = (
        db.query(GenerationHistory)
        .filter(
            GenerationHistory.user_id == user.id,
            GenerationHistory.watson_analysis.isnot(None),
        )
        .order_by(GenerationHistory.created_at.desc())
        .limit(20)
        .all()
    )

    if not items:
        return {"has_data": False, "message": "Generate some content first to build your Creative DNA."}

    emotion_totals: Dict[str, float] = {}
    sentiment_counts: Dict[str, int] = {"positive": 0, "negative": 0, "neutral": 0}
    all_keywords: List[str] = []
    feature_counts: Dict[str, int] = {}

    for item in items:
        wa = item.watson_analysis or {}
        emotions = wa.get("emotions", {})
        for emotion, score in emotions.items():
            emotion_totals[emotion] = emotion_totals.get(emotion, 0) + score

        sentiment = wa.get("sentiment", {}).get("document", {}).get("label", "neutral")
        sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1

        keywords = wa.get("top_keywords", [])
        all_keywords.extend(keywords[:5])

        ft = item.feature_type
        feature_counts[ft] = feature_counts.get(ft, 0) + 1

    n = len(items)
    emotion_avg = {e: round(v / n, 3) for e, v in emotion_totals.items()}
    dominant_emotion = max(emotion_avg, key=emotion_avg.get) if emotion_avg else "joy"

    # Deduplicate keywords by frequency
    kw_freq: Dict[str, int] = {}
    for kw in all_keywords:
        kw_freq[kw] = kw_freq.get(kw, 0) + 1
    top_keywords = sorted(kw_freq, key=kw_freq.get, reverse=True)[:8]

    dominant_tool = max(feature_counts, key=feature_counts.get) if feature_counts else "story"

    emotion_labels = {
        "joy": "Joyful Visionary",
        "sadness": "Depth Seeker",
        "anger": "Passionate Disruptor",
        "fear": "Tension Weaver",
        "disgust": "Bold Challenger",
    }
    signature = emotion_labels.get(dominant_emotion, "Creative Explorer")

    return {
        "has_data": True,
        "total_analyzed": n,
        "dominant_emotion": dominant_emotion,
        "emotion_profile": emotion_avg,
        "sentiment_breakdown": sentiment_counts,
        "top_keywords": top_keywords,
        "feature_counts": feature_counts,
        "dominant_tool": dominant_tool,
        "creative_signature": signature,
    }


async def get_mood_board(keywords: str):
    photos = []

    if settings.PEXELS_API_KEY:
        try:
            query = keywords.replace(",", " ").strip()[:100]
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    "https://api.pexels.com/v1/search",
                    headers={"Authorization": settings.PEXELS_API_KEY},
                    params={"query": query, "per_page": 9, "orientation": "landscape"},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for p in data.get("photos", []):
                        photos.append({
                            "url": p["src"]["medium"],
                            "large_url": p["src"]["large"],
                            "photographer": p["photographer"],
                            "alt": p.get("alt", query),
                            "pexels_url": p["url"],
                        })
        except Exception as e:
            logger.warning(f"Pexels API error: {e}")

    if not photos:
        # Curated fallback using Unsplash's public CDN (no auth needed for direct image URLs)
        fallback_ids = [
            ("1551434678-e076c223a692", "Creative workspace"),
            ("1454165804606-c3d57bc86b40", "Brainstorming"),
            ("1493612276216-ee3925520721", "Colors and design"),
            ("1541746972996-4e0b0f43e02a", "Brand identity"),
            ("1508921912186-1d1a45ebb3c1", "Storytelling"),
            ("1542626991-cbc4e32524cc", "Campaign planning"),
            ("1486312338219-ce68d2c6f44d", "Digital creation"),
            ("1519389950473-47ba0277781c", "Creative team"),
            ("1500462918059-b1a0cb512f1d", "Art and imagination"),
        ]
        for img_id, alt in fallback_ids:
            photos.append({
                "url": f"https://images.unsplash.com/photo-{img_id}?w=400&q=80",
                "large_url": f"https://images.unsplash.com/photo-{img_id}?w=1200&q=85",
                "photographer": "Unsplash",
                "alt": alt,
                "pexels_url": "",
            })

    return {"photos": photos, "query": keywords}
