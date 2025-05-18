import OpenAI from "openai";
import { serverNearAICredentials } from "@/config/near-ai-credentials";

/**
 * Interface for the review validation request
 */
export interface ReviewValidationRequest {
  image: string; // Base64 encoded image
  review: string; // Review text to validate
}

/**
 * Interface for the review validation result
 */
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
 * Agent ID for validation
 */
const AGENT_ID = "ultirequiem2.near/validate_review_with_image/0.2.0";

/**
 * Validates if a description matches the provided image using NEAR AI's validation agent
 * 
 * @param reviewText - Description text to validate against the image
 * @param imageData - Image data as Buffer or base64 string
 * @param imageType - MIME type of the image (defaults to image/jpeg)
 * @returns Promise with validation result indicating if description matches the image
 */
export async function validateDescriptionWithImage(
  reviewText: string,
  imageData: Buffer | string,
  imageType: string = "image/jpeg"
): Promise<ReviewValidationResult> {
  try {
    // Initialize OpenAI client with NEAR AI credentials
    const openai = new OpenAI({
      baseURL: "https://api.near.ai/v1",
      apiKey: `Bearer ${JSON.stringify(serverNearAICredentials)}`,
    });
    
    // Process the image data
    // Convert Buffer to base64 string if needed
    let base64Image: string;
    if (Buffer.isBuffer(imageData)) {
      base64Image = imageData.toString('base64');
    } else {
      // If it's already a base64 string, ensure it doesn't have the data URL prefix
      base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;
    }
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    
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
      explanation: `Error processing validation: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Parse and validate a request directly from JSON input
 * Similar to the Python implementation's full workflow
 * 
 * @param jsonInput - JSON string or object containing image and review
 * @returns Promise with validation result
 */
export async function validateReviewFromJson(
  jsonInput: string | ReviewValidationRequest
): Promise<ReviewValidationResult> {
  try {
    let data: ReviewValidationRequest;
    
    if (typeof jsonInput === "string") {
      try {
        data = JSON.parse(jsonInput) as ReviewValidationRequest;
      } catch (e) {
        return {
          accurate: false,
          explanation: "⚠️ Invalid JSON format. Please send in format: {\"image\": \"base64_string\", \"review\": \"text\"}"
        };
      }
    } else {
      data = jsonInput;
    }
    
    const { image, review } = data;
    
    if (!image) {
      return {
        accurate: false,
        explanation: "🖼️ No image provided in the request"
      };
    }
    
    const reviewText = review || "Is this description accurate?";
    
    // Process base64 image and review text through validation
    return await validateDescriptionWithImage(reviewText, image);
  } catch (error) {
    console.error("Error processing validation request:", error);
    return {
      accurate: false,
      explanation: `⚠️ Error processing request: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Validates if a description matches the provided image using NEAR AI's validation agent
 * 
 * @param reviewText - Description text to validate against the image
 * @param imageData - Image data as Buffer or base64 string
 * @param imageType - MIME type of the image (defaults to image/jpeg)
 * @returns Promise with validation result indicating if description matches the image
 */
export async function validateDescriptionWithImage(
  reviewText: string,
  imageData: Buffer | string,
  imageType: string = "image/jpeg"
): Promise<ReviewValidationResult> {
  try {
    // Initialize OpenAI client with NEAR AI credentials
    const openai = new OpenAI({
      baseURL: "https://api.near.ai/v1",
      apiKey: `Bearer ${JSON.stringify(serverNearAICredentials)}`,
    });
    
    // Process the image data - similar to Python's process_message function
    // Convert Buffer to base64 string if needed
    let base64Image: string;
    if (Buffer.isBuffer(imageData)) {
      base64Image = imageData.toString('base64');
    } else {
      // If it's already a base64 string, ensure it doesn't have the data URL prefix
      base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;
    }
    
    // Create the messages array with system prompt - similar to Python's run function
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      }
    ];
    
    // Build content with image and text - similar to Python's build_content function
    const content = buildContent(base64Image, reviewText);
    
    // Add user message with the content
    messages.push({
      role: "user",
      content
    });
    
    // Create a thread with the initial system message
    const thread = await openai.beta.threads.create();
    
    // Add the system message
    await openai.beta.threads.messages.create(
      thread.id,
      messages[0]
    );
    
    // Add the user message with image and text
    await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content
      }
    );
    
    // Run the validation agent
    const agentId = "ultirequiem2.near/validate_review_with_image/0.2.0";
    
    // Create and poll the run - similar to Python's env.completion call
    const run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      {
        assistant_id: agentId,
      }
    );
    
    // Check if the run completed successfully
    if (run.status !== "completed") {
      throw new Error(`Run failed with status: ${run.status}`);
    }
    
    // Get the assistant's response - similar to env.add_reply in Python
    const messages_response = await openai.beta.threads.messages.list(thread.id);
    
    // Find the assistant's response
    for (const message of messages_response.data) {
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
      explanation: `Error processing validation: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Parse and validate a request directly from JSON input
 * Similar to the Python implementation's full workflow
 * 
 * @param jsonInput - JSON string or object containing image and review
 * @returns Promise with validation result
 */
export async function validateReviewFromJson(
  jsonInput: string | ReviewValidationRequest
): Promise<ReviewValidationResult> {
  try {
    let data: ReviewValidationRequest;
    
    if (typeof jsonInput === "string") {
      try {
        data = JSON.parse(jsonInput) as ReviewValidationRequest;
      } catch (e) {
        return {
          accurate: false,
          explanation: "⚠️ Invalid JSON format. Please send in format: {\"image\": \"base64_string\", \"review\": \"text\"}"
        };
      }
    } else {
      data = jsonInput;
    }
    
    const { image, review } = data;
    
    if (!image) {
      return {
        accurate: false,
        explanation: "🖼️ No image provided in the request"
      };
    }
    
    const reviewText = review || "Is this description accurate?";
    
    // Process base64 image and review text through validation
    return await validateDescriptionWithImage(reviewText, image);
  } catch (error) {
    console.error("Error processing validation request:", error);
    return {
      accurate: false,
      explanation: `⚠️ Error processing request: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}