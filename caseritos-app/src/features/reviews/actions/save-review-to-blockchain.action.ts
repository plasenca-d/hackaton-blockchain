"use server";

import { getCurrentUser } from "@/features/auth/actions/get-user.action";
import prisma from "@/lib/prisma";
import { generateReviewHash } from "../utils/hash-utils";

interface BlockchainRecordResponse {
  success: boolean;
  error?: string;
  recordId?: string;
}

/**
 * Saves a review record to the blockchain
 *
 * @param reviewId - The ID of the review to save to the blockchain
 * @returns The result of the blockchain record creation
 */
export async function saveReviewToBlockchain(
  reviewId: string
): Promise<BlockchainRecordResponse> {
  try {
    // Get the review with user and buyer information
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: true, // Seller
        buyer: true, // Buyer
      },
    });

    if (!review) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    // Generate a hash from review data
    const hash = generateReviewHash({
      comment: review.comment || "",
      rating: review.rating,
      productName: review.productName,
      id: review.id,
    });

    // Extract user DIDs
    const did1 = review.user?.did || "unknown-seller";
    const did2 = review.buyer?.did || "unknown-buyer";

    // Create the payload
    const payload = {
      did1,
      hash,
      did2,
    };

    // Send the data to the blockchain API
    const response = await fetch(
      "https://caseritos-app-production.up.railway.app/add-record",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `Blockchain API error: ${
          errorData.message || response.statusText
        }`,
      };
    }

    const data = await response.json();

    // Update the review with the hash
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        hash: hash,
      },
    });

    return {
      success: true,
      recordId: data.id || "record-created",
    };
  } catch (error) {
    console.error("Error saving review to blockchain:", error);
    return {
      success: false,
      error: `Failed to save to blockchain: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
