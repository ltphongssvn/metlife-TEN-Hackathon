# System Architecture
# /metlife-TEN-Hackathon/docs/architecture.md

## Overview
MetLife TEN Hackathon - AI Focus Assistant is a full-stack conversational AI application designed to help immigrants maintain focus on education.

## Architecture Diagram
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Frontend (React)                │
│  - ChatInterface Component          │
│  - API Service (Axios)              │
│  - Port: 3000                       │
└──────┬──────────────────────────────┘
       │ HTTP/REST
       ▼
┌─────────────────────────────────────┐
│   Backend (Node.js/Express)         │
│  - Chat Routes                      │
│  - Dialogflow Integration           │
│  - Port: 3001                       │
└──────┬──────────────────────────────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌────────────┐ ┌──────────┐ ┌─────────────┐
│ Dialogflow │ │  Agents  │ │Google Cloud │
│   Agent    │ │(Python)  │ │   Speech    │
└────────────┘ └────┬─────┘ └─────────────┘
                    │
              ┌─────┴─────┐
              ▼           ▼
        ┌──────────┐ ┌─────────┐
        │  OpenAI  │ │ ChromaDB│
        │   GPT-4  │ │  (RAG)  │
        └──────────┘ └─────────┘
```

## Components

### Frontend (React)
- **Technology**: React 19, Axios
- **Features**:
  - Real-time chat interface
  - Message history
  - Typing indicators
  - Responsive design
- **Port**: 3000

### Backend (Node.js)
- **Technology**: Express.js, Node.js 18+
- **Features**:
  - RESTful API
  - Dialogflow integration
  - Session management
  - CORS, Helmet security
- **Port**: 3001

### Multi-Agent System (Python)
- **Technology**: Python 3.11, LangChain, OpenAI
- **Agents**:
  1. **ConsultationAgent**: GPT-4 powered advice
  2. **KnowledgeAgent**: RAG-based retrieval
  3. **AgentOrchestrator**: Coordinates agents
- **Port**: 8000

### Vector Database
- **Technology**: ChromaDB
- **Purpose**: Store and retrieve knowledge base
- **Features**: Semantic search, embeddings

### Google Cloud Services
- **Dialogflow**: Natural language understanding
- **Speech-to-Text**: Voice input
- **Text-to-Speech**: Voice output

## Data Flow

1. User sends message via React UI
2. Frontend sends HTTP request to Backend
3. Backend processes via Dialogflow
4. Backend queries Multi-Agent System
5. Agents retrieve knowledge via RAG
6. GPT-4 generates response
7. Response flows back through layers
8. UI displays response to user

## Security
- Pre-commit hooks with detect-secrets
- Environment variables for secrets
- HTTPS/TLS encryption
- JWT authentication (planned)
- CORS configuration

## Deployment
- Docker containers for each service
- docker-compose for orchestration
- Google Cloud Run (planned)
- CI/CD via GitHub Actions (planned)
