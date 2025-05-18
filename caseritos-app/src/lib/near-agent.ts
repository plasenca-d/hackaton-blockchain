import OpenAI from "openai";
import type { NearAuthData } from "./near-ai-api";

export async function evaluateMessageWithAgent(
  auth: NearAuthData,
  agentId: string,
  message: string
): Promise<string> {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.near.ai/v1",
      apiKey: `Bearer ${JSON.stringify(auth)}`,
    });

    const thread = await openai.beta.threads.create();

    const _userMessage = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: agentId,
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);

      for (const message of messages.data) {
        if (message.role === "assistant") {
          if (message.content.length > 0) {
            continue;
          }

          if (message.content[0].type === "text") {
            return message.content[0].text.value;
          }
        }
      }

      throw new Error("No assistant response found in thread");
    } else {
      throw new Error(`Run failed with status: ${run.status}`);
    }
  } catch (error) {
    console.error("Error evaluating message with agent:", error);
    throw error;
  }
}
