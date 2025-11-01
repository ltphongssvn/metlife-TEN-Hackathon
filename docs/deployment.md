# Deployment Guide
# /metlife-TEN-Hackathon/docs/deployment.md

## Prerequisites

- Docker & Docker Compose installed
- Google Cloud account with Dialogflow setup
- OpenAI API key
- Node.js 18+ (for local development)
- Python 3.11+ with uv (for local development)

## Environment Setup

### 1. Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=production
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
DIALOGFLOW_PROJECT_ID=your_project_id
```

### 2. Agents (.env)
```bash
cd agents
cp .env.example .env
```

Edit `.env`:
```
OPENAI_API_KEY=your_openai_key
DIALOGFLOW_PROJECT_ID=your_project_id
CHROMA_PERSIST_DIRECTORY=./data/chroma
```

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Agents
```bash
cd agents
uv sync
uv run python main.py
```

## Docker Deployment

### Build and Run All Services
```bash
cd infrastructure
docker-compose up --build
```

### Run in Background
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

## Google Cloud Deployment

### 1. Setup Google Cloud Project
```bash
gcloud init
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable APIs
```bash
gcloud services enable dialogflow.googleapis.com
gcloud services enable speech.googleapis.com
gcloud services enable texttospeech.googleapis.com
gcloud services enable run.googleapis.com
```

### 3. Create Service Account
```bash
gcloud iam service-accounts create metlife-app
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:metlife-app@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/dialogflow.client"
```

### 4. Deploy to Cloud Run
```bash
# Backend
gcloud run deploy metlife-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Frontend
gcloud run deploy metlife-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Monitoring

- Check logs: `docker-compose logs -f`
- Health check: `curl http://localhost:3001/health`
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1

## Troubleshooting

### Port Conflicts
```bash
# Check ports in use
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 PID
```

### Docker Issues
```bash
# Clean rebuild
docker-compose down -v
docker-compose up --build --force-recreate
```

### Environment Variables Not Loading
- Verify .env file location
- Check file permissions
- Restart services after changes
