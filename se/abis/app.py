from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from langchain_ollama import OllamaLLM
import faiss
import numpy as np

app = Flask(__name__)
CORS(app)

# Load FAISS index
index = faiss.read_index("faiss_index")

# Load documents
with open("documents.txt", "r", encoding="utf-8") as f:
    documents = f.readlines()

# Load embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Define LLaMA 3 model
model = OllamaLLM(model="llama3")

# ✅ Renamed the route function to avoid name collision
@app.route('/')
def home():
    return 'Server is running.'

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json['user_input']
    print("User input:", user_input)
    
    # Retrieve context from FAISS
    query_embedding = embedder.encode([user_input])
    _, idx = index.search(np.array(query_embedding), k=1)
    retrieved_text = documents[idx[0][0]].strip()
    print("Retrieved context:", retrieved_text)

    # Generate response
    prompt = f"""
    Use the following context to answer the question:
    Context: {retrieved_text}
    Question: {user_input}
    Answer:
    """
    response = model.invoke(prompt)  # Correct method for langchain_ollama
    print("Model response:", response)
    
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
