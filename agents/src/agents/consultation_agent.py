# /metlife-TEN-Hackathon/agents/src/agents/consultation_agent.py
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import SystemMessage
import os

class ConsultationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=float(os.getenv("AGENT_TEMPERATURE", 0.7)),
            max_tokens=int(os.getenv("MAX_TOKENS", 2000))
        )
        
        self.system_message = """You are a supportive AI consultant helping immigrants in the USA 
        maintain focus on their education despite financial and cultural pressures. 
        
        Your role is to:
        - Provide encouragement and long-term vision
        - Offer practical advice for staying focused
        - Remind users of the value of education
        - Help counter negative influences
        - Be empathetic but firm about long-term goals
        
        Always respond with compassion, understanding, and actionable advice."""
        
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=self.system_message),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
    
    async def process(self, user_input: str, chat_history: list = None):
        try:
            response = await self.llm.ainvoke(
                self.prompt.format_messages(
                    input=user_input,
                    chat_history=chat_history or [],
                    agent_scratchpad=[]
                )
            )
            return response.content
        except Exception as e:
            print(f"ConsultationAgent error: {e}")
            return "I'm here to support you. Please try asking again."
