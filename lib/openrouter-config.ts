import { createOpenAI } from "@ai-sdk/openai";

const textModel = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})("openrouter/free");


const embeddingModel = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1/embeddings",
  apiKey: process.env.OPENROUTER_API_KEY,
}).embeddingModel(
  "nvidia/llama-nemotron-embed-vl-1b-v2:free"
);

export { textModel, embeddingModel };