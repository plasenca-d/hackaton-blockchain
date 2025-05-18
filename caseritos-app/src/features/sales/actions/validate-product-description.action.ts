"use server";

import { validateDescriptionWithImage } from "@/features/reviews/utils/validate-description-with-image";
import { revalidatePath } from "next/cache";

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
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // Determine content type
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

    const validationResult = await validateDescriptionWithImage(
      description,
      imageBuffer,
      contentType
    );

    revalidatePath("/dashboard/sales");

    return validationResult;
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
