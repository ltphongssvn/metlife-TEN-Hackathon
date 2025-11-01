# /metlife-TEN-Hackathon/agents/src/agents/orchestrator.py
from .consultation_agent import ConsultationAgent
from .knowledge_agent import KnowledgeAgent
import asyncio

class AgentOrchestrator:
    def __init__(self):
        self.consultation_agent = ConsultationAgent()
        self.knowledge_agent = KnowledgeAgent()
    
    async def process_query(self, user_input: str, chat_history: list = None):
        """Process user query through multi-agent system"""
        try:
            # Search knowledge base
            knowledge_results = self.knowledge_agent.search(user_input)
            
            # Enhance prompt with knowledge
            enhanced_input = user_input
            if knowledge_results:
                context = "\n\nRelevant information:\n" + "\n".join(knowledge_results)
                enhanced_input = user_input + context
            
            # Get consultation response
            response = await self.consultation_agent.process(
                enhanced_input, 
                chat_history
            )
            
            return {
                "response": response,
                "sources": len(knowledge_results)
            }
        except Exception as e:
            print(f"Orchestrator error: {e}")
            return {
                "response": "I'm here to help. Please try again.",
                "sources": 0
            }
