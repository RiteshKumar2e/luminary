# Luminary AI Backend

## Quick Start

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys

# Start server
uvicorn main:app --reload --port 8000
```

## API Docs
Open http://localhost:8000/docs after starting the server.

## Environment Variables
| Key | Description |
|-----|-------------|
| `SECRET_KEY` | JWT signing secret (min 32 chars) |
| `GROQ_API_KEY` | Get from https://console.groq.com |
| `WATSON_NLU_API_KEY` | IBM Watson NLU API key |
| `WATSON_NLU_URL` | IBM Watson NLU service URL |
| `DATABASE_URL` | SQLite (default) or PostgreSQL URL |
