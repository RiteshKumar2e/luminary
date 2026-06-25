from groq import Groq
from typing import Optional, Dict, Any, List
from config.settings import settings
import logging

logger = logging.getLogger(__name__)


class GroqService:
    """Groq LLM integration for fast creative content generation."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self._client: Optional[Groq] = None
        self._available = bool(self.api_key)

    @property
    def client(self) -> Groq:
        if not self._client:
            self._client = Groq(api_key=self.api_key)
        return self._client

    async def generate(
        self,
        prompt: str,
        system_prompt: str = "",
        temperature: float = 0.8,
        max_tokens: int = 2048,
    ) -> Dict[str, Any]:
        if not self._available:
            logger.warning("Groq not configured — returning mock content.")
            return self._mock_response(prompt)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            usage = response.usage
            return {
                "content": content,
                "tokens_used": usage.total_tokens if usage else 0,
                "model": self.model,
                "success": True,
            }
        except Exception as e:
            logger.error(f"Groq generation error: {e}")
            return self._mock_response(prompt)

    async def generate_story(
        self,
        title: str,
        genre: str,
        tone: str,
        length: str,
        prompt: str,
        characters: Optional[List[str]] = None,
        setting: Optional[str] = None,
    ) -> Dict[str, Any]:
        length_map = {"short": "300-500", "medium": "600-900", "long": "1000-1500"}
        word_range = length_map.get(length, "600-900")
        char_info = f"Characters: {', '.join(characters)}" if characters else ""
        setting_info = f"Setting: {setting}" if setting else ""

        system = (
            "You are a world-class creative fiction writer. Write compelling, immersive stories "
            "with vivid descriptions, believable characters, and emotional depth. "
            "Format your output with clear structure: Title, opening hook, body paragraphs, and a satisfying ending."
        )
        user_prompt = f"""Write a {genre} story with a {tone} tone.
Title hint: {title or 'Create an appropriate title'}
{char_info}
{setting_info}
Story premise: {prompt}
Target length: {word_range} words.

Structure: [Title] → [Hook paragraph] → [Rising action] → [Climax] → [Resolution]"""

        return await self.generate(system_prompt=system, prompt=user_prompt, temperature=0.85, max_tokens=2500)

    async def generate_campaign(
        self,
        brand_name: str,
        product: str,
        target_audience: str,
        campaign_goal: str,
        tone: str,
        platforms: Optional[List[str]] = None,
        budget_level: str = "medium",
    ) -> Dict[str, Any]:
        platform_str = ", ".join(platforms) if platforms else "multi-platform"
        system = (
            "You are a senior marketing strategist and creative director with 15 years of experience "
            "at top advertising agencies. Create data-driven, emotionally resonant campaign concepts "
            "that convert. Be specific, actionable, and creative."
        )
        user_prompt = f"""Create a complete marketing campaign for:
Brand: {brand_name}
Product/Service: {product}
Target Audience: {target_audience}
Campaign Goal: {campaign_goal}
Tone: {tone}
Platforms: {platform_str}
Budget Level: {budget_level}

Provide:
1. Campaign Name & Tagline
2. Core Message / Value Proposition
3. Creative Concept (the big idea)
4. Platform-specific content ideas (3-4 ideas per platform)
5. Hook / Opening copy
6. 3 Ad headline variations
7. Call-to-Action options
8. Content calendar suggestion (1 week)
9. KPIs to track"""

        return await self.generate(system_prompt=system, prompt=user_prompt, temperature=0.75, max_tokens=2500)

    async def generate_brand_kit(
        self,
        brand_name: str,
        industry: str,
        brand_personality: str,
        target_audience: str,
        values: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        values_str = ", ".join(values) if values else "not specified"
        system = (
            "You are a brand identity expert and creative strategist. "
            "You build memorable brand systems that stand out and connect with audiences. "
            "Be specific, evocative, and actionable in all recommendations."
        )
        user_prompt = f"""Build a complete brand identity kit for:
Brand Name: {brand_name}
Industry: {industry}
Brand Personality: {brand_personality}
Target Audience: {target_audience}
Core Values: {values_str}

Deliver:
1. Brand Story (2-3 sentences)
2. Mission Statement
3. Vision Statement
4. Brand Voice & Tone Guidelines (5 adjectives with examples)
5. Tagline options (5 variations)
6. Color Palette Recommendation (primary, secondary, accent) with hex codes and rationale
7. Typography recommendations (heading + body font pairings)
8. Logo concept description (3 directions)
9. Brand Messaging Pillars (3 pillars)
10. Social media bio templates for LinkedIn, Instagram, Twitter
11. Email signature template
12. Brand do's and don'ts (5 each)"""

        return await self.generate(system_prompt=system, prompt=user_prompt, temperature=0.7, max_tokens=3000)

    async def generate_captions(
        self,
        platform: str,
        content_description: str,
        tone: str,
        include_hashtags: bool,
        count: int,
    ) -> Dict[str, Any]:
        platform_guides = {
            "instagram": "engaging, visual-focused, 150-200 chars ideal, storytelling",
            "twitter": "punchy, under 240 chars, conversational, trending",
            "linkedin": "professional, insightful, thought-leadership, 150-300 chars",
            "tiktok": "energetic, Gen-Z friendly, hook-heavy, fun",
            "facebook": "community-focused, shareable, conversational",
        }
        guide = platform_guides.get(platform.lower(), "engaging and relevant")

        system = "You are a top social media copywriter who creates viral content. Each caption must feel authentic, not AI-generated."
        user_prompt = f"""Write {count} unique {platform} captions for:
Content: {content_description}
Tone: {tone}
Platform style: {guide}
{"Include relevant hashtags at the end." if include_hashtags else "No hashtags needed."}

Format each caption as:
Caption [N]:
[caption text]
{"[hashtags]" if include_hashtags else ""}
---"""

        return await self.generate(system_prompt=system, prompt=user_prompt, temperature=0.9, max_tokens=1500)

    async def generate_script(
        self,
        script_type: str,
        topic: str,
        duration_seconds: int,
        tone: str,
        target_audience: Optional[str],
    ) -> Dict[str, Any]:
        words_per_minute = 150
        approx_words = int((duration_seconds / 60) * words_per_minute)
        audience_str = f"Audience: {target_audience}" if target_audience else ""

        system = (
            "You are an Emmy Award-winning scriptwriter. You write compelling, conversational scripts "
            "that hold attention from first second to last. Use natural language, clear structure, and emotional hooks."
        )
        user_prompt = f"""Write a {script_type} script:
Topic: {topic}
Duration: ~{duration_seconds} seconds (~{approx_words} words)
Tone: {tone}
{audience_str}

Format:
[TITLE]
[HOOK - first 5 seconds]
[INTRO]
[MAIN CONTENT - with natural transitions]
[CTA / OUTRO]

Include: [PAUSE], [EMPHASIS], [SFX suggestion] directions where appropriate."""

        return await self.generate(system_prompt=system, prompt=user_prompt, temperature=0.78, max_tokens=2000)

    async def brainstorm_ideas(self, topic: str, category: str, count: int = 10) -> Dict[str, Any]:
        system = "You are a world-class creative director and innovation consultant. Generate bold, original ideas."
        user_prompt = f"""Brainstorm {count} creative ideas for:
Topic: {topic}
Category: {category}

For each idea provide:
- Idea title (catchy)
- One-line description
- Why it works
- Quick execution tip

Number each idea. Be original and specific — no generic suggestions."""

        return await self.generate(system_prompt=system, prompt=user_prompt, temperature=0.92, max_tokens=2000)

    def _mock_response(self, prompt: str) -> Dict[str, Any]:
        return {
            "content": f"[Demo Mode — Groq API key not configured]\n\nThis is a placeholder response for: '{prompt[:80]}...'\n\nConfigure your GROQ_API_KEY in the .env file to enable real AI generation.",
            "tokens_used": 0,
            "model": "demo",
            "success": False,
        }


groq_service = GroqService()
