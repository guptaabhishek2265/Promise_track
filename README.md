# 🏛️ VaadaTrack - Political Manifesto Tracker & AI Assistant

VaadaTrack is an intelligent, full-stack application built to track, analyze, and compare political party manifestos using Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs).

## ✨ Features

- **🤖 AI-Powered "Ask Manifesto" Chat:** Ask complex questions about a specific party's promises and get accurate, context-aware answers.
- **📊 Cross-Party Comparison:** Select multiple political parties and instantly compare their manifestos side-by-side on key issues.
- **🛡️ Secure Admin Dashboard:** Protected routes allowing administrators to upload new manifesto PDFs, extract text, manually manage parties, and track promises.
- **⚡ Multi-Threaded RAG Pipeline:** Uses Node.js `worker_threads` and `@xenova/transformers` for local semantic embeddings.
- **📱 Responsive & Polished UI:** Beautiful, modern interface built with Tailwind CSS and React Markdown.

## 👥 User vs. Admin Experience

### User Dashboard (Public)
- **Browse Parties & Promises:** Track fulfillment status (Fulfilled, Pending, Broken) and see overall statistics.
- **Manifesto Summaries:** Read AI-generated 3-5 paragraph summaries of 100+ page manifestos.
- **Compare Parties:** Select two parties and a topic to generate a side-by-side policy comparison.
- **Ask AI:** Use the chatbot to ask questions about specific manifestos, answered directly from the source text.

### Admin Dashboard (Protected)
- **Manage Parties & Promises:** Manually add, edit, or delete political parties and promises.
- **Extract Promises via AI:** Upload a manifesto PDF and let the AI automatically extract all actionable promises into the database.
- **Verify Promises via AI:** Provide factual evidence texts, and the AI will analyze whether a promise should be marked as Fulfilled, Partially Fulfilled, or Broken.

## 🛠️ Technology Stack

- **Frontend:** React.js, React Router, Tailwind CSS, Axios, React Markdown
- **Backend:** Node.js, Express.js, MongoDB & Mongoose
- **AI & Search:** Groq SDK (LLaMA 3), Xenova Transformers (Local Embeddings), PDF-Parse

## 🚀 Quick Start (Local Development)

### 1. Set up Environment Variables
Create `backend/.env`:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000
```

### 2. Run Locally
Install all dependencies:
```bash
npm run install-all
```
Start backend and frontend together:
```bash
npm run dev
```

### 3. Seed Sample Data
Run these from the `backend` folder after setting up `backend/.env`:
```bash
node utils/seed.js
node utils/seedManifestos.js
```
Default seed admin:
- **Email:** admin@vaadatrack.com
- **Password:** admin123

### 4. Docker (Optional)
```bash
docker-compose up --build
```
The frontend container is served on `http://localhost:3000` and the backend on `http://localhost:8000`.

## 🧠 Note on AI Processing
The AI features (Summary, Extraction, Analysis, Chat) rely completely on the texts provided. When uploading "evidence" to analyze a promise, make sure to paste factual paragraphs or report summaries, as the AI cannot independently click web links or browse the live internet.
