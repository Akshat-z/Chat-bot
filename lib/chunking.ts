import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
  separators: [" "],
});

export async function chunkText(text: string): Promise<string[]> {
  const chunks = await textSplitter.splitText(text);
  return chunks;
}