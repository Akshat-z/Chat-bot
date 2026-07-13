import { embeddingModel as model } from "@/lib/openrouter-config";
import { embed, embedMany } from "ai";

export async function generateEmbedding (text: string) {
    const input = text.trim().replace("\n", "");
    const { embedding } = await embed({
      model,
      value: input,
    });
  console.log("Embedding generated:", embedding);
  return embedding;
}

export async function generateEmbeddings (texts: string[]) {
    const input = texts.map((t) => t.trim().replace("\n", ""));
    const { embeddings } = await embedMany({
      model,
      values: input,
    });
  console.log("Embeddings generated:", embeddings);
  return embeddings ;
}