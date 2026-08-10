/**
 * RAG Service - Neural Embeddings using Xenova/transformers (via Worker Thread)
 */

const { Worker } = require('worker_threads');
const path = require('path');

let worker = null;
let messageIdCounter = 0;
const pendingRequests = new Map();

const getWorker = () => {
  if (!worker) {
    worker = new Worker(path.join(__dirname, '../workers/embeddingWorker.js'));
    worker.on('message', (response) => {
      const { id, success, data, error } = response;
      if (pendingRequests.has(id)) {
        const { resolve, reject } = pendingRequests.get(id);
        pendingRequests.delete(id);
        if (success) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }
    });
    worker.on('error', (error) => {
      console.error('Worker error:', error);
    });
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      worker = null; // Recreate if it dies
    });
  }
  return worker;
};

// Word-based chunking
const chunkText = (text, chunkSize = 100, overlap = 20) => {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const chunks = [];

  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunkWords = words.slice(i, i + chunkSize);
    const chunkText = chunkWords.join(' ').trim();
    if (chunkText.length > 80) {
      chunks.push({
        text: chunkText,
        chunkIndex: chunks.length,
        category: detectCategory(chunkText)
      });
    }
  }

  return chunks;
};

const detectCategory = (text) => {
  const lower = text.toLowerCase();
  const map = {
    'Agriculture': ['farmer', 'kisan', 'crop', 'agriculture', 'irrigation', 'msp', 'fertilizer', 'farm', 'paddy', 'wheat', 'sugarcane', 'agricultural'],
    'Economy': ['gdp', 'economy', 'growth', 'inflation', 'budget', 'fiscal', 'trade', 'investment', 'manufacturing', 'economic', 'industry'],
    'Defence': ['defence', 'defense', 'military', 'army', 'security', 'border', 'armed'],
    'Education': ['education', 'school', 'university', 'student', 'scholarship', 'teacher', 'college', 'iit', 'iim', 'literacy', 'skill'],
    'Health': ['health', 'hospital', 'medical', 'doctor', 'ayushman', 'medicine', 'clinic', 'healthcare', 'aiims', 'dialysis'],
    'Infrastructure': ['road', 'highway', 'railway', 'airport', 'metro', 'expressway', 'bridge', 'infrastructure'],
    'Employment': ['job', 'employment', 'youth', 'startup', 'rozgar', 'unemploy', 'recruit', 'vacancy', 'work'],
    'Environment': ['environment', 'climate', 'forest', 'pollution', 'renewable', 'solar', 'clean', 'green', 'tree'],
    'Social Welfare': ['welfare', 'pension', 'subsidy', 'bpl', 'ration', 'housing', 'awas', 'poor', 'women', 'ujjwala'],
    'Governance': ['governance', 'corruption', 'transparency', 'digital', 'police', 'law', 'court', 'order'],
    'Technology': ['technology', 'digital', 'internet', '5g', 'broadband', 'cyber', 'artificial intelligence', 'ai'],
    'Taxation': ['tax', 'gst', 'income tax', 'revenue', 'duty'],
  };

  for (const [cat, kws] of Object.entries(map)) {
    if (kws.some(kw => lower.includes(kw))) return cat;
  }
  return 'Other';
};

// Generate neural embeddings for an array of chunks using the Worker Thread
const embedChunks = async (chunks) => {
  if (!chunks.length) return [];
  const w = getWorker();
  const id = ++messageIdCounter;
  
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    w.postMessage({ id, type: 'EMBED_CHUNKS', payload: chunks });
  });
};

// Calculate cosine similarity between two dense vectors
const cosineSimilarity = (a, b) => {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
};

// Retrieve relevant chunks by sending the query to the worker
const retrieveRelevantChunks = async (query, chunks, topK = 5) => {
  if (!chunks || chunks.length === 0) return [];
  
  const w = getWorker();
  const id = ++messageIdCounter;
  
  const qVec = await new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    w.postMessage({ id, type: 'EMBED_QUERY', payload: query });
  });

  return chunks
    .map(c => {
      const plainChunk = c.toObject ? c.toObject() : c;
      return { 
        ...plainChunk, 
        score: cosineSimilarity(qVec, plainChunk.embedding || []) 
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};

module.exports = { chunkText, embedChunks, retrieveRelevantChunks, detectCategory };