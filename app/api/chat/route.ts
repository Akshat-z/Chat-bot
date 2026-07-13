import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { textModel as model } from "@/lib/openrouter-config";



export async function POST(request: Request) {
    try {
  const body = await request.json();
  const { messages }: { messages: UIMessage[] } = body;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: model,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
} catch (error) {
  console.error("Error in POST request:", error);
  return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
}
}