"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions/get-user.action";

/**
 * Gets a review by its ID
 * 
 * @param reviewId - The ID of the review to retrieve
 * @returns The review data or null if not found
 */
export async function getReviewById(reviewId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!review) {
      return null;
    }

    // Check if the current user is either the buyer or the seller
    const isBuyer = review.buyerId === currentUser.id;
    const isSeller = review.userId === currentUser.id;

    if (!isBuyer && !isSeller) {
      // Only allow the buyer or seller to view the review
      throw new Error("No tienes permiso para ver esta reseña");
    }

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment || "",
      photoUrl: review.photoUrl || "",
      hash: review.hash,
      createdAt: review.createdAt.toISOString(),
      productName: review.productName,
      seller: {
        id: review.user.id,
        name: review.user.name || "Vendedor",
        image: review.user.image || "",
      },
      buyer: {
        id: review.buyer.id,
        name: review.buyer.name || "Comprador",
        image: review.buyer.image || "",
      },
    };
  } catch (error) {
    console.error("Error getting review:", error);
    throw error;
  }
}
