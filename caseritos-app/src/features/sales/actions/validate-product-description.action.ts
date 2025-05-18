"use server";

import { revalidatePath } from "next/cache";
import { processImage, validateReviewWithImage } from "@/lib/near-agent";

/**
 * Validates if a product description matches the provided product image
 *
 * @param description - The product description to validate
 * @param imageUrl - The URL of the product image
 * @returns A validation result with accuracy and explanation
 */
export async function validateProductDescription(
  description: string,
  imageUrl: string
): Promise<{ accurate: boolean; explanation: string }> {
  try {
    const response = await processImage(imageUrl, description);

    revalidatePath("/dashboard/sales");

    return {
      accurate: response.accurate,
      explanation: response.explanation,
    };
  } catch (error) {
    console.error("Error validating product description:", error);
    return {
      accurate: false,
      explanation: `Error validating description: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
