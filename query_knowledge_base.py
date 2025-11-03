# /metlife-TEN-Hackathon/query_knowledge_base.py
"""
Utility for querying the ChromaDB knowledge base with OpenAI embeddings.
"""

import os
import sys
from typing import List, Dict, Any
from langchain_openai import OpenAIEmbeddings
import chromadb
from chromadb.api.types import EmbeddingFunction
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LangChainEmbeddingWrapper(EmbeddingFunction):
    """Wrapper to make LangChain embeddings compatible with ChromaDB."""
    
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
    
    def __call__(self, input: List[str]) -> List[List[float]]:
        """Generate embeddings for input texts."""
        return self.embeddings.embed_documents(input)

def query_knowledge_base(
    query_text: str, 
    n_results: int = 5,
    persist_directory: str = "./data/chroma",
    collection_name: str = "langchain"
) -> Dict[str, Any]:
    """
    Query the knowledge base for relevant documents.
    
    Args:
        query_text: The search query
        n_results: Number of results to return
        persist_directory: Path to ChromaDB storage
        collection_name: Name of the collection
    
    Returns:
        Dictionary with documents, metadatas, and distances
    """
    # Initialize embedding wrapper
    wrapper = LangChainEmbeddingWrapper()
    
    # Connect to ChromaDB
    client = chromadb.PersistentClient(path=persist_directory)
    collection = client.get_collection(collection_name, embedding_function=wrapper)
    
    # Query the collection
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
    
    return results

def main():
    """Example usage of the query function."""
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = "scholarship help"
    
    print(f"Querying for: '{query}'")
    print("-" * 50)
    
    try:
        results = query_knowledge_base(query, n_results=3)
        
        if results['documents'][0]:
            for i, doc in enumerate(results['documents'][0]):
                print(f"\nResult {i+1}:")
                print(doc[:300] + "..." if len(doc) > 300 else doc)
                if results['distances'][0]:
                    print(f"Distance: {results['distances'][0][i]:.4f}")
        else:
            print("No results found.")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
