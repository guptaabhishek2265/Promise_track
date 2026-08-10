# 🏛️ VaadaTrack - Political Manifesto Tracker & AI Assistant

![VaadaTrack Banner](./docs/images/banner.png)

> An intelligent, full-stack application built to track, analyze, and compare political party manifestos using Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs).

## ✨ Features

- **🤖 AI-Powered "Ask Manifesto" Chat:** Ask complex questions about a specific party's promises and get accurate, context-aware answers powered by Groq and LLaMA 3.
- **📊 Cross-Party Comparison:** Select multiple political parties and instantly compare their manifestos side-by-side on key issues like Healthcare, Economy, and Education.
- **🛡️ Secure Admin Dashboard:** Protected routes allowing administrators to upload new manifesto PDFs, extract text, generate semantic embeddings, and sync them to the database.
- **⚡ Multi-Threaded RAG Pipeline:** Uses Node.js `worker_threads` and `@xenova/transformers` (`all-MiniLM-L6-v2`) for local, zero-cost, and non-blocking semantic embeddings.
- **📱 Responsive & Polished UI:** Beautiful, modern glass-morphic interface built with Tailwind CSS and React Markdown.

## 📸 Screenshots

*(Please replace these placeholder paths with actual screenshots of your application!)*

| Home Dashboard | AI Chat Interface |
|:---:|:---:|
| <img src="./docs/images/home.png" width="400"/> | <img src="./docs/images/chat.png" width="400"/> |
| **Manifesto Comparison** | **Admin PDF Upload** |
| <img src="./docs/images/compare.png" width="400"/> | <img src="./docs/images/admin.png" width="400"/> |

## 🛠️ Technology Stack

**Frontend:**
- React.js
- Tailwind CSS (with `@tailwindcss/typography` for markdown)
- Axios & React Router

**Backend:**
- Node.js & Express.js (Worker Threads for background processing)
- MongoDB & Mongoose (Database & Vector storage)
- PDF-Parse (Document extraction)
- Groq SDK (LLM inference)
- Xenova/Transformers (Local AI Embeddings)
- JSON Web Tokens (JWT Auth)

**Deployment:**
- Docker & Docker Compose (Containerization)
- Nginx (Reverse Proxy)
- Vercel (Frontend Hosting)
- Render.com (Backend API Hosting)

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/VaadaTrack.git
cd VaadaTrack
```

### 2. Set up Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=vaada-track-ten.vercel.app
```

### 3. Run with Docker (Recommended)
You can spin up the entire stack using Docker Compose:
```bash
docker-compose up --build
```
The app will be available at `vaada-track-ten.vercel.app`.

### 4. Run Manually without Docker
**Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm install
npm start
```
The app will be available at `http://vaada-track-ten.vercel.app`.

## 🧠 How the AI (RAG) Works
1. **Ingestion:** Admins upload a PDF manifesto. The backend parses the PDF into raw text and generates an AI summary and category list asynchronously.
2. **Chunking & Threaded Embeddings:** The text is split into semantic 100-word chunks. We send these chunks to a background **Worker Thread** running the `all-MiniLM-L6-v2` neural network locally via Xenova. This keeps the main Node.js event loop completely unblocked. The vectors are saved directly in the MongoDB manifesto document.
3. **Retrieval:** When a user asks a question, the user's query is also embedded by the worker thread. We calculate cosine similarity between the query vector and the manifesto chunks, pulling the top 5 most relevant sections.
4. **Generation:** The relevant context is injected into a prompt and sent to Groq's LLaMA 3 model to generate a highly accurate, hallucination-free response.

## 📄 License
This project is licensed under the MIT License.
