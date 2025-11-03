# /metlife-TEN-Hackathon/agents/src/agents/consultation_agent.py
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
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
        - Address psychological aspects of dealing with external pressures
        
        If asked questions unrelated to education, motivation, psychology, or immigrant experiences:
        - Politely explain that you're specifically designed to help with educational focus and motivation
        - Redirect the conversation to how you can help with maintaining focus on education
        
        Always respond with compassion, understanding, and actionable advice."""

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_message),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("user", "{input}"),
        ])

    def _convert_history(self, chat_history: list) -> list:
        """Convert chat history from {role, content} format to LangChain Message objects"""
        if not chat_history:
            return []

        messages = []
        for msg in chat_history:
            if msg.get('role') == 'user':
                messages.append(HumanMessage(content=msg.get('content', '')))
            elif msg.get('role') == 'assistant':
                messages.append(AIMessage(content=msg.get('content', '')))

        return messages

    async def process(self, user_input: str, chat_history: list = None):
        try:
            # Convert history format
            converted_history = self._convert_history(chat_history) if chat_history else []

            messages = self.prompt.format_messages(
                input=user_input,
                chat_history=converted_history
            )

            response = await self.llm.ainvoke(messages)
            return response.content

        except Exception as e:
            print(f"ConsultationAgent error: {e}")
            return "I'm here to support you on your educational journey. Could you please rephrase your question or tell me what specific challenge you're facing with your studies?"