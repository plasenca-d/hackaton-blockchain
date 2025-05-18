"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions/get-user.action";
import { processImage, validateReviewWithImage } from "@/lib/near-agent";

export interface CreateReviewInput {
  saleIntentId: string;
  rating: number;
  comment: string;
  photoUrl: string;
}

/**
 * Creates a new review for a sale intent and validates it with AI
 *
 * @param data - Review data including rating, comment, and photo URL
 * @returns The created review with validation results
 */
export async function createReview(data: CreateReviewInput) {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get the sale intent
    const saleIntent = await prisma.saleIntent.findUnique({
      where: { id: data.saleIntentId },
      include: { sale: true },
    });

    if (!saleIntent) {
      throw new Error("Sale intent not found");
    }

    // Prevent the seller from reviewing their own product
    if (saleIntent.sale.sellerId === currentUser.id) {
      return {
        success: false,
        error: "Validation error",
        explanation: "No puedes crear una reseña para tu propio producto",
      };
    }

    // Validate the review with AI
    const validationResult = await processImage(data.comment, data.photoUrl);

    if (!validationResult.accurate) {
      return {
        success: false,
        error: "Review validation failed",
        explanation: validationResult.explanation,
      };
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: saleIntent.sale.sellerId, // The seller ID
        buyerId: currentUser.id, // The current user (buyer)
        rating: data.rating,
        comment: data.comment,
        photoUrl: data.photoUrl,
      },
    });

    // Update the sale intent with the review ID
    await prisma.saleIntent.update({
      where: { id: data.saleIntentId },
      data: { reviewId: review.id },
    });

    // Revalidate paths
    revalidatePath(`/sales-intents/${data.saleIntentId}`);
    revalidatePath("/dashboard/reviews");

    return {
      success: true,
      reviewId: review.id,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: `Failed to create review: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
