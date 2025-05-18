"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/actions/get-user.action";

/**
 * Gets reviews for the current authenticated user
 *
 * @returns Array of user's reviews
 */
export async function getUserReviews() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get reviews where the user is the seller (reviews of products they sold)
    const reviews = await prisma.review.findMany({
      where: {
        userId: currentUser.id, // User as seller
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || "",
      photoUrl: review.photoUrl,
      hash: review.hash,
      createdAt: review.createdAt.toISOString(),
      productName: review.productName,
      buyer: {
        id: review.buyer.id,
        name: review.buyer.name,
        image: review.buyer.image,
      },
    }));
  } catch (error) {
    console.error("Error getting user reviews:", error);
    throw error;
  }
}
