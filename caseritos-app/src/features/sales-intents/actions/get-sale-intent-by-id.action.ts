"use server";

import prisma from "@/lib/prisma";

/**
 * Retrieves a sale intent by ID with the associated sale information
 *
 * @param saleIntentId - The ID of the sale intent
 * @returns The sale intent details with sale information
 */
export async function getSaleIntentByIdAction(saleIntentId: string) {
  try {
    const saleIntent = await prisma.saleIntent.findUnique({
      where: {
        id: saleIntentId,
      },
      include: {
        sale: true,
        review: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!saleIntent) {
      return null;
    }

    return {
      id: saleIntent.id,
      saleId: saleIntent.saleId,
      userId: saleIntent.userId,
      reviewId: saleIntent.reviewId,
      createdAt: saleIntent.createdAt,
      productName: saleIntent.sale.productName,
      productDescription: saleIntent.sale.productDescription,
      photoUrl: saleIntent.sale.photoUrl,
      review: saleIntent.review,
      seller: saleIntent.user,
    };
  } catch (error) {
    console.error("Error fetching sale intent:", error);
    throw new Error(
      `Failed to fetch sale intent: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
