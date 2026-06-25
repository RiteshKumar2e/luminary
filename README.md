# Luminary AI — Creative Intelligence Platform

**Reimagine creative work with AI.** Generate stories, campaigns, brand kits, captions, and scripts using Groq LLM for generation and IBM Watson NLU for analysis.

---

## Project Structure

```
luminary/
├── backend/          # FastAPI Python backend
└── frontend/         # React + TypeScript + Vite frontend
```

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — add your GROQ_API_KEY and WATSON keys

# Start server
uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## AI Integrations

| Service | Purpose |
|---------|---------|
| **Groq LLaMA 3** | Story generation, campaign planning, brand kits, captions, scripts, brainstorming |
| **IBM Watson NLU** | Tone analysis, emotion detection, sentiment scoring, content quality, keywords |

### Get API Keys

- **Groq**: https://console.groq.com → free tier available
- **IBM Watson NLU**: https://cloud.ibm.com/catalog/services/natural-language-understanding

---

## Features

| Page | Description |
|------|-------------|
| Landing Page | Professional marketing landing with navbar, hero, features, how-it-works, about, CTA |
| Dashboard | Activity overview, quick tools, recent generations |
| Creative Studio | Brainstorm, captions, scripts, Watson text analysis — tabbed interface |
| Story Generator | Genre/tone/length picker, full AI story with Watson emotional analysis |
| Campaign Planner | Brand + platform selector, full campaign strategy with KPIs |
| Brand Kit | Identity system: mission, voice, colors, typography, taglines |
| Asset Library | Upload + store generated assets with grid/list toggle |
| History | Paginated, filterable generation history with expandable previews |
| Settings | Profile management, password change, account info |
| Contact | Professional contact form |

---

## Tech Stack

### Backend
- **FastAPI** + Uvicorn
- **SQLAlchemy** + SQLite (swappable to PostgreSQL)
- **JWT** authentication via `python-jose`
- **Passlib bcrypt** password hashing
- **Groq Python SDK** for LLM calls
- **IBM Watson SDK / httpx** for NLU

### Frontend
- **React 18** + **TypeScript**
- **Vite** for bundling
- **React Router v6** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hook Form** + **Zod** for form validation
- **React Hot Toast** for notifications
- Pure CSS (no Tailwind, no inline styles)
