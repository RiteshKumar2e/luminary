import httpx
import json
from typing import Optional, Dict, Any
from config.settings import settings
import logging

logger = logging.getLogger(__name__)


class WatsonNLUService:
    """IBM Watson Natural Language Understanding integration."""

    def __init__(self):
        self.api_key = settings.WATSON_NLU_API_KEY
        self.url = settings.WATSON_NLU_URL.rstrip("/")
        self.version = "2022-04-07"
        self._available = bool(self.api_key and self.url)

    async def analyze(
        self,
        text: str,
        features: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if not self._available:
            logger.warning("Watson NLU not configured — returning mock analysis.")
            return self._mock_analysis(text)

        if features is None:
            features = {
                "sentiment": {"targets": []},
                "emotion": {"targets": []},
                "keywords": {"limit": 10},
                "entities": {"limit": 10},
                "categories": {"limit": 5},
                "concepts": {"limit": 5},
            }

        payload = {"text": text, "features": features, "language": "en"}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.url}/v1/analyze",
                    params={"version": self.version},
                    json=payload,
                    auth=("apikey", self.api_key),
                    timeout=30.0,
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Watson NLU HTTP error: {e.response.status_code} - {e.response.text}")
            return self._mock_analysis(text)
        except Exception as e:
            logger.error(f"Watson NLU error: {e}")
            return self._mock_analysis(text)

    async def analyze_tone(self, text: str) -> Dict[str, Any]:
        """Analyze emotional tone using Watson NLU emotion features."""
        features = {
            "emotion": {"document": True},
            "sentiment": {"document": True},
            "keywords": {"limit": 8},
        }
        return await self.analyze(text, features)

    async def analyze_content_quality(self, text: str) -> Dict[str, Any]:
        """Full analysis for content quality scoring."""
        features = {
            "sentiment": {"document": True},
            "emotion": {"document": True},
            "keywords": {"limit": 15},
            "entities": {"limit": 10, "sentiment": True, "emotion": True},
            "categories": {"limit": 5},
            "concepts": {"limit": 8},
        }
        raw = await self.analyze(text, features)
        return self._build_quality_report(raw, text)

    def _build_quality_report(self, raw: Dict[str, Any], text: str) -> Dict[str, Any]:
        word_count = len(text.split())
        sentence_count = text.count(".") + text.count("!") + text.count("?") or 1
        avg_sentence_length = word_count / sentence_count

        # Readability heuristic
        readability = "excellent" if avg_sentence_length < 15 else "good" if avg_sentence_length < 22 else "complex"

        sentiment = raw.get("sentiment", {}).get("document", {})
        emotion = raw.get("emotion", {}).get("document", {}).get("emotion", {})
        keywords = [k.get("text", "") for k in raw.get("keywords", [])]
        entities = [e.get("text", "") for e in raw.get("entities", [])]

        dominant_emotion = max(emotion, key=emotion.get) if emotion else "neutral"

        return {
            "word_count": word_count,
            "sentence_count": sentence_count,
            "avg_sentence_length": round(avg_sentence_length, 1),
            "readability": readability,
            "sentiment": sentiment,
            "dominant_emotion": dominant_emotion,
            "emotions": emotion,
            "top_keywords": keywords[:8],
            "entities": entities[:6],
            "categories": raw.get("categories", []),
            "concepts": [c.get("text", "") for c in raw.get("concepts", [])],
            "quality_score": self._compute_quality_score(sentiment, emotion, word_count),
        }

    def _compute_quality_score(self, sentiment: dict, emotion: dict, word_count: int) -> int:
        score = 50
        if sentiment.get("label") == "positive":
            score += 20
        elif sentiment.get("label") == "negative":
            score -= 10
        confidence = abs(sentiment.get("score", 0))
        score += int(confidence * 15)
        if word_count > 50:
            score += 10
        if word_count > 200:
            score += 5
        return min(max(score, 10), 99)

    def _mock_analysis(self, text: str) -> Dict[str, Any]:
        word_count = len(text.split())
        return {
            "sentiment": {"document": {"label": "positive", "score": 0.72}},
            "emotion": {
                "document": {
                    "emotion": {
                        "joy": 0.65,
                        "sadness": 0.08,
                        "anger": 0.04,
                        "fear": 0.06,
                        "disgust": 0.03,
                    }
                }
            },
            "keywords": [
                {"text": "creative", "relevance": 0.95},
                {"text": "innovation", "relevance": 0.88},
                {"text": "storytelling", "relevance": 0.82},
            ],
            "entities": [],
            "categories": [{"label": "/arts and entertainment", "score": 0.89}],
            "concepts": [{"text": "Creativity"}, {"text": "Branding"}],
            "word_count": word_count,
            "quality_score": 78,
            "dominant_emotion": "joy",
        }


watson_nlu = WatsonNLUService()
