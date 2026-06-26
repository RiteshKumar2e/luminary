<div align="center">

# ✦ Luminary AI

### *The AI Creative Intelligence Platform*

**Transform how you imagine, produce, and experience creative work.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203-F55036?style=flat-square&logo=meta&logoColor=white)](https://groq.com)
[![IBM Watson](https://img.shields.io/badge/IBM-Watson%20NLU-052FAD?style=flat-square&logo=ibm&logoColor=white)](https://www.ibm.com/watson)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

Luminary AI is a full-stack creative intelligence platform that empowers creators, marketers, and storytellers to produce professional-quality content at speed. Powered by **Groq's LLaMA 3** for ultra-fast generation and **IBM Watson NLU** for deep linguistic analysis, Luminary acts as a true creative partner — not just a content generator.

> Built for the **AI & IBM Challenge** — demonstrating how AI can expand creative potential, redefine workflows, and bridge the gap between imagination and execution.

---

## Key Features

### 🤖 Creative Muse — AI Chat Partner
A conversational AI creative partner for real back-and-forth ideation. Ask for feedback, iterate on concepts, brainstorm together, and develop ideas through genuine dialogue. Automatically injects context from your recent work so the Muse knows what you create.

### 📖 Story Generator
Craft compelling fiction with full control over genre, tone, length, characters, and setting. Powered by Groq LLaMA 3 with IBM Watson NLU sentiment and emotion analysis on every generated story.

### 📣 Campaign Planner
Generate complete multi-platform marketing campaigns — including tagline, big creative idea, platform-specific content, ad headlines, CTAs, and a 1-week content calendar.

### 🎨 Brand Kit Generator
Build full brand identity systems: brand story, mission/vision, voice guidelines, taglines, color palettes (with hex codes), typography recommendations, logo concepts, and social media bios — with an auto-generated **Visual Mood Board** sourced from Pexels.

### ✨ Creative Studio
Four tools in one:
- **Caption Generator** — platform-optimized social media copy (Instagram, TikTok, LinkedIn, Twitter, Facebook)
- **Script Writer** — video, podcast, ad, and reel scripts with production notes
- **Brainstorm Engine** — structured ideation with rationale and execution tips per idea
- **Content Analyzer** — deep IBM Watson NLU analysis (sentiment, emotions, keywords, entities, quality score)

### 🧬 Creative DNA
A personalized style fingerprint derived from Watson NLU analysis of your generation history. Reveals your dominant emotional signature, creative vocabulary, sentiment distribution, and a named archetype (e.g. *Joyful Visionary*, *Tension Weaver*).

### 🖼️ Visual Mood Board
Automatically fetches relevant visual inspiration images via the Pexels API after Brand Kit generation — bridging text-based creative output to visual direction.

### 📚 Asset Library & History
Organize generated content and uploaded assets with tags, categories, and search. Full paginated generation history with filtering by content type.

---

## Architecture

```
luminary/
├── backend/                    # Python · FastAPI
│   ├── ai_services/
│   │   ├── groq_service.py     # LLaMA 3 · 30-model fallback chain
│   │   └── watson_service.py   # IBM Watson NLU analysis
│   ├── auth/                   # JWT · bcrypt
│   ├── controllers/            # Business logic layer
│   ├── models/                 # SQLAlchemy ORM (users, history, assets, projects)
│   ├── routes/                 # FastAPI routers
│   ├── schemas/                # Pydantic validation
│   └── main.py
│
└── frontend/                   # React 18 · TypeScript · Vite
    └── src/
        ├── pages/              # 11 route pages
        ├── components/         # Reusable UI components
        ├── services/           # Axios API layer
        ├── context/            # Auth state (React Context)
        ├── hooks/              # Custom hooks
        └── styles/             # Pure CSS modules
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Framer Motion, React Hook Form + Zod |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic v2 |
| **AI — Generation** | Groq SDK · LLaMA 3.3 70B (30-model auto-fallback chain) |
| **AI — Analysis** | IBM Watson Natural Language Understanding |
| **Visual** | Pexels API (mood board image sourcing) |
| **Auth** | JWT (python-jose) · bcrypt (passlib) |
| **Database** | SQLite (dev) · PostgreSQL-compatible (prod) |
| **HTTP Client** | httpx (async) · Axios (frontend) |

---

## Groq Model Fallback Chain

Luminary uses an automatic 30-model fallback chain. If the primary model is unavailable or decommissioned, it seamlessly tries the next model — zero downtime, zero manual intervention.

```
llama-3.3-70b-versatile → llama-3.1-70b-versatile → llama-3.1-8b-instant
→ llama-3.2-90b-vision-preview → mixtral-8x7b-32768 → gemma2-9b-it
→ qwen-qwq-32b → deepseek-r1-distill-llama-70b → ... (30 models total)
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com) (free tier available)
- IBM Watson NLU credentials (optional — mock analysis available without it)
- Pexels API key (optional — curated fallback images available without it)

### 1 — Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key-min-32-chars

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile

WATSON_NLU_API_KEY=your-watson-nlu-key
WATSON_NLU_URL=https://api.xx.natural-language-understanding.watson.cloud.ibm.com

PEXELS_API_KEY=your-pexels-key

DATABASE_URL=sqlite:///./luminary.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

```bash
uvicorn main:app --reload --port 8000
# API docs → http://localhost:8000/docs
```

### 2 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App → http://localhost:5174
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive JWT |
| `GET` | `/api/v1/auth/me` | Get current user profile |
| `POST` | `/api/v1/creative/chat` | AI Creative Muse chat |
| `POST` | `/api/v1/creative/story` | Generate a story |
| `POST` | `/api/v1/creative/campaign` | Generate a marketing campaign |
| `POST` | `/api/v1/creative/brand-kit` | Generate a brand identity kit |
| `POST` | `/api/v1/creative/captions` | Generate social media captions |
| `POST` | `/api/v1/creative/script` | Generate a script |
| `POST` | `/api/v1/creative/brainstorm` | Brainstorm ideas |
| `POST` | `/api/v1/creative/analyze` | Analyze text with Watson NLU |
| `GET` | `/api/v1/creative/style-profile` | Get your Creative DNA profile |
| `GET` | `/api/v1/creative/mood-board` | Fetch visual mood board images |
| `GET` | `/api/v1/creative/history` | Paginated generation history |

Full interactive API docs available at `/docs` (Swagger UI) when the backend is running.

---

## IBM Watson NLU Integration

Every piece of generated content is analyzed through IBM Watson NLU, returning:

| Signal | Description |
|--------|-------------|
| **Sentiment** | Document-level positive / negative / neutral score |
| **Emotions** | Joy, Sadness, Anger, Fear, Disgust — with confidence scores |
| **Keywords** | Top 15 keywords with relevance ranking |
| **Entities** | Named entity extraction with context |
| **Concepts** | High-level conceptual categories |
| **Quality Score** | 0–99 composite readability + content quality metric |
| **Creative DNA** | Aggregated style fingerprint across your generation history |

---

## Hackathon Challenge Alignment

| Challenge Criteria | How Luminary Delivers |
|---|---|
| **AI Creative Partners** | Creative Muse — multi-turn conversational AI that thinks *with* you |
| **Storytelling Tools** | Story Generator with genre, tone, character, and setting control |
| **Multimodal Experiences** | Visual Mood Board bridges text generation to visual creative direction |
| **Creative Ideation Platforms** | Brainstorm Engine with structured idea development |
| **Personalized Assistants** | Creative DNA profile — adapts to your unique creative signature |
| **AI-Powered Design Tools** | Brand Kit with color palettes, typography, and logo concept directions |
| **IBM Technology** | Watson NLU powers all content analysis and the Creative DNA feature |
| **Real-World Impact** | Replaces hours of agency creative work in minutes |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | JWT signing secret (min 32 characters) |
| `GROQ_API_KEY` | ✅ | Groq API key for LLM generation |
| `GROQ_MODEL` | ➖ | Primary model (defaults to `llama-3.3-70b-versatile`) |
| `WATSON_NLU_API_KEY` | ➖ | IBM Watson NLU key (mock analysis if omitted) |
| `WATSON_NLU_URL` | ➖ | Watson NLU service URL |
| `PEXELS_API_KEY` | ➖ | Pexels key for mood boards (curated fallback if omitted) |
| `DATABASE_URL` | ➖ | Database URL (defaults to `sqlite:///./luminary.db`) |
| `ALLOWED_ORIGINS` | ➖ | Comma-separated CORS origins |

---

## License

MIT © 2026 Luminary AI

---

<div align="center">

Built with Groq · IBM Watson · React · FastAPI

*Luminary AI — Where imagination meets execution.*

</div>
