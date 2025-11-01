# /metlife-TEN-Hackathon/agents/src/agents/knowledge_agent.py
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os

class KnowledgeAgent:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.persist_directory = os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chroma")
        self.vectorstore = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    def load_knowledge_base(self, documents: list):
        """Load documents into vector database"""
        try:
            texts = self.text_splitter.create_documents(documents)
            self.vectorstore = Chroma.from_documents(
                documents=texts,
                embedding=self.embeddings,
                persist_directory=self.persist_directory
            )
            self.vectorstore.persist()
            return True
        except Exception as e:
            print(f"KnowledgeAgent load error: {e}")
            return False
    
    def search(self, query: str, k: int = 3):
        """Search knowledge base"""
        try:
            if not self.vectorstore:
                self.vectorstore = Chroma(
                    persist_directory=self.persist_directory,
                    embedding_function=self.embeddings
                )
            
            results = self.vectorstore.similarity_search(query, k=k)
            return [doc.page_content for doc in results]
        except Exception as e:
            print(f"KnowledgeAgent search error: {e}")
            return []
