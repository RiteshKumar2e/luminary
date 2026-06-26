from groq import Groq
from typing import Optional, Dict, Any, List
from config.settings import settings
import logging

logger = logging.getLogger(__name__)


GROQ_MODEL_FALLBACKS: List[str] = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama3-70b-8192",
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "llama-3.2-90b-vision-preview",
    "llama-3.2-11b-vision-preview",
    "llama-3.2-3b-preview",
    "llama-3.2-1b-preview",
    "llama-guard-3-8b",
    "llama3-groq-70b-8192-tool-use-preview",
    "llama3-groq-8b-8192-tool-use-preview",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
    "gemma-7b-it",
    "whisper-large-v3",
    "whisper-large-v3-turbo",
    "distil-whisper-large-v3-en",
    "llava-v1.5-7b-4096-preview",
    "playai-tts",
    "playai-tts-arabic",
    "qwen-qwq-32b",
    "qwen-2.5-coder-32b",
    "qwen-2.5-32b",
    "deepseek-r1-distill-llama-70b",
    "deepseek-r1-distill-qwen-32b",
    "mistral-saba-24b",
    "allam-2-7b",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
]


class GroqService:
    """Groq LLM integration with automatic model fallback chain."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        # Prefer the configured model; prepend it so it's tried first
        configured = settings.GROQ_MODEL
        if configured and configured not in GROQ_MODEL_FALLBACKS:
            self._model_queue = [configured] + GROQ_MODEL_FALLBACKS
        else:
            # Move configured model to front if present in list
            others = [m for m in GROQ_MODEL_FALLBACKS if m != configured]
            self._model_queue = ([configured] if configured else []) + others
        self.model = self._model_queue[0]  # active model (updated on fallback)
        self._client: Optional[Groq] = None
        self._available = bool(self.api_key)

    @property
    def client(self) -> Groq:
        if not self._client:
            self._client = Groq(api_key=self.api_key)
        return self._client

    def _is_model_error(self, error: Exception) -> bool:
        msg = str(error).lower()
        return any(k in msg for k in ("decommissioned", "model_not_found", "does not exist", "invalid model", "no longer supported"))

    async def _call_with_fallback(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
    ) -> Dict[str, Any]:
        """Try each model in the fallback chain until one succeeds."""
        for model in self._model_queue:
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
                if model != self.model:
                    logger.info(f"Groq fallback succeeded with model: {model}")
                    self.model = model  # remember working model for logs
                content = response.choices[0].message.content
                usage = response.usage
                return {
                    "content": content,
                    "tokens_used": usage.total_tokens if usage else 0,
                    "model": model,
                    "success": True,
                }
            except Exception as e:
                if self._is_model_error(e):
                    logger.warning(f"Model '{model}' unavailable, trying next fallback. ({e})")
                    continue
                # Non-model error (rate limit, network, etc.) — bail immediately
                logger.error(f"Groq error with model '{model}': {e}")
                break

        return self._mock_response("fallback exhausted")

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

        messages: List[Dict[str, str]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        return await self._call_with_fallback(messages, temperature, max_tokens)

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

    async def generate_chat(
        self,
        messages: List[Dict[str, str]],
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        system = (
            "You are the Creative Muse — an imaginative, warm, and perceptive AI creative partner. "
            "You help creators brainstorm ideas, develop stories, refine concepts, give honest creative feedback, "
            "and spark inspiration. You ask thoughtful follow-up questions to understand their vision. "
            "You are collaborative, not prescriptive — you expand possibilities rather than dictate answers. "
            "Keep responses conversational and engaging, typically 2–4 paragraphs unless the user asks for something longer."
        )
        if context:
            system += f"\n\nContext about this user's recent creative work:\n{context}"

        full_messages = [{"role": "system", "content": system}] + messages

        if not self._available:
            return self._mock_chat_response(messages[-1]["content"] if messages else "")

        result = await self._call_with_fallback(full_messages, temperature=0.88, max_tokens=1024)
        if not result["success"]:
            return self._mock_chat_response(messages[-1]["content"] if messages else "")
        return result

    def _mock_chat_response(self, last_message: str) -> Dict[str, Any]:
        return {
            "content": "[Demo Mode — Groq API key not configured]\n\nYour Creative Muse is ready once you add your GROQ_API_KEY. For now, here's a placeholder reply to: " + last_message[:60],
            "tokens_used": 0,
            "model": "demo",
            "success": False,
        }

    def _mock_response(self, prompt: str) -> Dict[str, Any]:
        return {
            "content": f"[Demo Mode — Groq API key not configured]\n\nThis is a placeholder response for: '{prompt[:80]}...'\n\nConfigure your GROQ_API_KEY in the .env file to enable real AI generation.",
            "tokens_used": 0,
            "model": "demo",
            "success": False,
        }


groq_service = GroqService()
