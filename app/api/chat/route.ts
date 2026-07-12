import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
    try {
  const body = await request.json();
  const { messages }: { messages: UIMessage[] } = body;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter("openrouter/free"),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
} catch (error) {
  console.error("Error in POST request:", error);
  return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
}
}