# /metlife-TEN-Hackathon/agents/populate_knowledge_base.py
import os
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

def populate_knowledge_base():
    """Load documents and populate ChromaDB"""

    # Configuration
    documents_path = "./data/documents"
    persist_directory = os.getenv("CHROMA_PERSIST_DIRECTORY", "../data/chroma")

    print(f"Loading documents from {documents_path}...")

    # Load documents
    loader = DirectoryLoader(
        documents_path,
        glob="**/*.txt",
        loader_cls=TextLoader
    )
    documents = loader.load()
    print(f"Loaded {len(documents)} document(s)")

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")

    # Create embeddings and store in ChromaDB
    embeddings = OpenAIEmbeddings()

    print(f"Creating embeddings and storing in {persist_directory}...")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory,
        collection_name="langchain"
    )

    print(f"✅ Successfully populated knowledge base with {len(chunks)} chunks")
    print(f"Collection: {vectorstore._collection.name}")
    print(f"Total documents in collection: {vectorstore._collection.count()}")
    vectorstore.persist()

if __name__ == "__main__":
    populate_knowledge_base()