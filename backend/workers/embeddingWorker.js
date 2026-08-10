const { parentPort } = require('worker_threads');

let pipelineInstance = null;

const getPipeline = async () => {
  if (!pipelineInstance) {
    const { pipeline } = await import('@xenova/transformers');
    pipelineInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return pipelineInstance;
};

// Start loading the pipeline immediately to save time
getPipeline().catch(err => console.error("Worker failed to load pipeline:", err));

parentPort.on('message', async (message) => {
  const { id, type, payload } = message;
  
  try {
    const extractor = await getPipeline();
    
    if (type === 'EMBED_CHUNKS') {
      const chunks = payload;
      const embeddedChunks = [];
      for (const chunk of chunks) {
        const output = await extractor(chunk.text, { pooling: 'mean', normalize: true });
        embeddedChunks.push({ ...chunk, embedding: Array.from(output.data) });
      }
      parentPort.postMessage({ id, success: true, data: embeddedChunks });
    } 
    else if (type === 'EMBED_QUERY') {
      const query = payload;
      const output = await extractor(query, { pooling: 'mean', normalize: true });
      parentPort.postMessage({ id, success: true, data: Array.from(output.data) });
    }
    else {
      parentPort.postMessage({ id, success: false, error: `Unknown message type: ${type}` });
    }
  } catch (error) {
    parentPort.postMessage({ id, success: false, error: error.message });
  }
});
