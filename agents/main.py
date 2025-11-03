# /metlife-TEN-Hackathon/agents/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv
from src.agents.orchestrator import AgentOrchestrator

load_dotenv()

app = FastAPI(
    title="AI Focus Assistant - Agent System",
    description="Multi-agent system with RAG for educational focus assistance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = AgentOrchestrator()

class ChatMessage(BaseModel):
    message: str
    userId: Optional[str] = "default-user"
    chat_history: Optional[List[dict]] = None
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    response: str
    sources: int
    status: str = "success"

@app.get("/")
async def root():
    return {
        "service": "AI Focus Assistant - Agent System",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "agents": {
            "consultation": "active",
            "knowledge": "active",
            "orchestrator": "active"
        }
    }

@app.post("/api/v1/query", response_model=ChatResponse)
async def process_query(chat_message: ChatMessage):
    """Process user query through multi-agent system"""
    try:
        # Add language instruction to the message
        language_map = {
            'en': 'English',
            'es': 'Spanish',
            'vi': 'Vietnamese'
        }
        response_language = language_map.get(chat_message.language, 'English')

        # Prepend language instruction if not English
        if chat_message.language != 'en':
            message_with_lang = f"Please respond in {response_language}. {chat_message.message}"
        else:
            message_with_lang = chat_message.message

        result = await orchestrator.process_query(
            user_input=message_with_lang,
            chat_history=chat_message.chat_history
        )

        return ChatResponse(
            response=result["response"],
            sources=result["sources"],
            status="success"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )

@app.post("/api/v1/knowledge/load")
async def load_knowledge(documents: List[str]):
    """Load documents into knowledge base"""
    try:
        success = orchestrator.knowledge_agent.load_knowledge_base(documents)
        if success:
            return {"status": "success", "message": "Knowledge base updated"}
        else:
            raise HTTPException(status_code=500, detail="Failed to load knowledge base")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AGENT_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )