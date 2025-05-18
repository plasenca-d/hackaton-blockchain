import OpenAI from "openai";
import type { NearAuthData } from "./near-ai-api";
import { serverNearAICredentials } from "../config/near-ai-credentials";

export interface ImageAttachment {
  content: string | Buffer;
  mimeType: string;
  filename?: string;
}

export interface MessageWithAttachments {
  text: string;
  images?: ImageAttachment[];
}

/**
 * Validates if a review description matches the provided image
 * @param reviewText - The description text to validate against the image
 * @param imageData - Image data as a Buffer or Base64 string
 * @param imageType - MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * @param auth - Optional auth data (uses server credentials by default)
 * @returns Promise with validation result: {accurate: boolean, explanation: string}
 */
export async function validateReviewWithImage(
  reviewText: string,
  imageData: Buffer | string,
  imageType: string = "image/jpeg",
  auth: NearAuthData = serverNearAICredentials
): Promise<{ accurate: boolean; explanation: string }> {
  try {
    const imageContent = Buffer.isBuffer(imageData)
      ? imageData.toString("base64")
      : typeof imageData === "string" && !imageData.includes("base64,")
      ? imageData
      : imageData.split("base64,")[1];

    const messageWithImage: MessageWithAttachments = {
      text: reviewText,
      images: [
        {
          content: imageContent,
          mimeType: imageType,
        },
      ],
    };

    const agentId = "ultirequiem2.near/validate_review_with_image/0.2.0";

    const response = await evaluateMessageWithAgent(
      auth,
      agentId,
      messageWithImage
    );

    try {
      const result = JSON.parse(response);
      return {
        accurate: Boolean(result.accurate),
        explanation: String(result.explanation || ""),
      };
    } catch (parseError) {
      console.error("Failed to parse agent response:", parseError);
      return {
        accurate: false,
        explanation: "Failed to parse validation result: " + String(parseError),
      };
    }
  } catch (error) {
    console.error("Error validating review with image:", error);
    return {
      accurate: false,
      explanation: "Error processing validation: " + String(error),
    };
  }
}

/**
 * Evaluates a message with an agent, supporting both text and image attachments
 * @param auth - Authentication data
 * @param agentId - The agent ID to use (e.g., 'ultirequiem2.near/validate_review_with_image/0.2.0')
 * @param message - Text message or object containing text and image attachments
 * @returns Promise with the agent's response
 */
export async function evaluateMessageWithAgent(
  auth: NearAuthData = serverNearAICredentials,
  agentId: string,
  message: string | MessageWithAttachments
): Promise<string> {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.near.ai/v1",
      apiKey: `Bearer ${JSON.stringify(auth)}`,
    });

    const thread = await openai.beta.threads.create();

    let content:
      | string
      | Array<{
          type: string;
          text?: { value: string };
          image_url?: { url: string };
        }>;

    if (typeof message === "string") {
      content = message;
    } else {
      content = [];

      content.push({
        type: "text",
        text: { value: message.text },
      });

      if (message.images && message.images.length > 0) {
        for (const image of message.images) {
          content.push({
            type: "image_url",
            image_url: {
              url:
                typeof image.content === "string"
                  ? `data:${image.mimeType};base64,${image.content}`
                  : `data:${image.mimeType};base64,${image.content.toString(
                      "base64"
                    )}`,
            },
          });
        }
      }
    }

    const _userMessage = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: content,
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: agentId,
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);

      for (const message of messages.data) {
        if (message.role === "assistant") {
          // Check if the message has content
          if (message.content && message.content.length > 0) {
            // Find the first text content part
            const textContent = message.content.find(
              (part) => part.type === "text"
            );
            if (
              textContent &&
              "text" in textContent &&
              textContent.text.value
            ) {
              return textContent.text.value;
            }
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
