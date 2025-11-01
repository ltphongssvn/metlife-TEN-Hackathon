# Multi-Agent System
# /metlife-TEN-Hackathon/agents/README.md

## Overview
Multi-agent architecture with RAG (Retrieval Augmented Generation) for providing personalized focus and motivation advice.

## Agents
- **Consultation Agent**: Provides personalized advice and encouragement
- **Knowledge Agent**: RAG-based retrieval from trusted sources
- **Context Agent**: Maintains conversation context and user history
- **Sentiment Agent**: Analyzes user emotional state

## Tech Stack
- Python 3.10+
- LangChain
- Vector database (Pinecone/Chroma)
- OpenAI/Google PaLM API
- Dialogflow integration

## Setup
```bash
pip install -r requirements.txt
python main.py
```

## Environment Variables
```
OPENAI_API_KEY=your_key
DIALOGFLOW_PROJECT_ID=your_project_id
VECTOR_DB_URL=your_vector_db_url
```
