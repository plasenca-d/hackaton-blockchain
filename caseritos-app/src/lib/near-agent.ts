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

export async function getFileIdFromBuffer(openaiClient: OpenAI, image: Buffer) {
  const file = await openaiClient.files.create({
    file: new Response(new Blob([image as BlobPart])),
    purpose: "vision",
  });

  return file.id;
}

export interface ReviewValidationRequest {
  image: string; // Base64 encoded image
  review: string; // Review text to validate
}

export interface ReviewValidationResult {
  accurate: boolean;
  explanation: string;
}

/**
 * System prompt for the image validation model
 */
const SYSTEM_PROMPT = `You're an image description validator. Analyze the image and user's description.
Your response MUST be valid JSON in this format: {"accurate": boolean, "explanation": "string"}

If the description is accurate, respond with: {"accurate": true, "explanation": "brief confirmation"}
If the description is inaccurate, respond with: {"accurate": false, "explanation": "concise explanation"}

Keep explanations under 100 words. Prioritize objective visual elements. 
IMPORTANT: Only return the JSON object, no additional text before or after.`;

/**
 * Validates if a review description matches the provided image
 * @param reviewText - The description text to validate against the image
 * @param imageData - Image data as a Buffer or base64 string
 * @param imageType - MIME type of the image (optional, defaults to image/jpeg)
 * @param auth - Optional auth data (uses server credentials by default)
 * @returns Promise with validation result: {accurate: boolean, explanation: string}
 */
export async function validateReviewWithImage(
  reviewText: string,
  imageData: Buffer | string,
  imageType: string = "image/jpeg",
  auth = serverNearAICredentials
): Promise<ReviewValidationResult> {
  try {
    // Initialize OpenAI client with NEAR AI credentials
    const openai = new OpenAI({
      baseURL: "https://api.near.ai/v1",
      apiKey: `Bearer ${JSON.stringify(auth)}`,
    });
    
    // Convert Buffer to base64 if needed
    let base64Image: string;
    if (Buffer.isBuffer(imageData)) {
      base64Image = imageData.toString('base64');
    } else {
      // If it's already a base64 string, ensure it doesn't have the data URL prefix
      base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;
    }
    
    // Create a thread first
    const thread = await openai.beta.threads.create();
    
    // Then add a message with the content
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: `data:${imageType};base64,${base64Image}`
          }
        } as const,
        {
          type: "text",
          text: {
            value: reviewText
          }
        } as const
      ]
    });
    
    // Run the thread with the validation agent
    const agentId = "ultirequiem2.near/validate_review_with_image/0.2.0";
    
    // Create the run with the agent
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: agentId,
    });
    
    // Check if the run completed successfully
    if (run.status !== "completed") {
      throw new Error(`Run failed with status: ${run.status}`);
    }
    
    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // Find the assistant's response
    for (const message of messages.data) {
      if (message.role === "assistant" && message.content?.length > 0) {
        const textContent = message.content.find(part => part.type === "text");
        if (textContent && "text" in textContent && textContent.text.value) {
          try {
            // Parse JSON response from the model
            const result = JSON.parse(textContent.text.value) as ReviewValidationResult;
            return result;
          } catch (e) {
            console.error("Failed to parse validation result:", e);
            throw new Error("Invalid response format from validation model");
          }
        }
      }
    }
    
    throw new Error("No valid response found from validation model");
  } catch (error) {
    console.error("Error validating review with image:", error);
    return {
      accurate: false,
      explanation: "Error processing validation: " + String(error)
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
    console.log(auth);
    const openai = new OpenAI({
      baseURL: "https://api.near.ai/v1",
      apiKey: `Bearer ${JSON.stringify(auth)}`,
    });

    const thread = await openai.beta.threads.create();

    let content: any;

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
            type: "file_id",
            file_id: {
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
