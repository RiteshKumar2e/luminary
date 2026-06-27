from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from database.session import get_db
from schemas.content import (
    StoryRequest,
    CampaignRequest,
    BrandKitRequest,
    CaptionRequest,
    ScriptRequest,
    AnalysisRequest,
    ChatRequest,
    StoryBranchRequest,
    ABTestRequest,
    ABGenerateRequest,
)
from controllers.content_controller import (
    generate_story,
    generate_campaign,
    generate_brand_kit,
    generate_captions,
    generate_script,
    brainstorm,
    analyze_content,
    get_history,
    delete_history_item,
    chat_with_muse,
    get_style_profile,
    get_mood_board,
    generate_story_branch,
    run_ab_test,
    generate_ab_variant,
)
from auth.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/creative", tags=["Creative AI"])


@router.post("/story")
async def story(
    payload: StoryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_story(payload, current_user, db)


@router.post("/campaign")
async def campaign(
    payload: CampaignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_campaign(payload, current_user, db)


@router.post("/brand-kit")
async def brand_kit(
    payload: BrandKitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_brand_kit(payload, current_user, db)


@router.post("/captions")
async def captions(
    payload: CaptionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_captions(payload, current_user, db)


@router.post("/script")
async def script(
    payload: ScriptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_script(payload, current_user, db)


@router.post("/brainstorm")
async def brainstorm_ideas(
    topic: str = Query(..., min_length=3),
    category: str = Query(default="general"),
    count: int = Query(default=8, ge=3, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await brainstorm(topic, category, count, current_user, db)


@router.post("/analyze")
async def analyze(
    payload: AnalysisRequest,
    current_user: User = Depends(get_current_user),
):
    return await analyze_content(payload)


@router.get("/history")
async def history(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    feature_type: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_history(current_user, db, skip, limit, feature_type)


@router.delete("/history/{item_id}")
async def delete_history(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await delete_history_item(item_id, current_user, db)


@router.post("/chat")
async def muse_chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await chat_with_muse(payload, current_user, db)


@router.get("/style-profile")
async def style_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_style_profile(current_user, db)


@router.get("/mood-board")
async def mood_board(
    keywords: str = Query(..., min_length=2),
    current_user: User = Depends(get_current_user),
):
    return await get_mood_board(keywords)


@router.post("/story/branch")
async def story_branch(
    payload: StoryBranchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_story_branch(payload, current_user, db)


@router.post("/campaign/test")
async def campaign_test(
    payload: ABTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await run_ab_test(payload, current_user, db)


@router.post("/campaign/generate-variant")
async def campaign_generate_variant(
    payload: ABGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await generate_ab_variant(payload, current_user, db)

